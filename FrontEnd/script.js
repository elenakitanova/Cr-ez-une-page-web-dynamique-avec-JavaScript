// GESTION DE LA GALERIE
// Je récupère la galerie
const gallery = document.querySelector(".gallery");
var works = []; // 'works' est défini ici
var categories = []; // 'categories' est défini ici

// GESTION DU LOG IN/LOG OUT ET DU MASQUE DES FILTRES UNE FOIS USER CONNECTÉ
    document.addEventListener("DOMContentLoaded", () => {
    // Appel initial des fonctions de la modale

    // Déclaration des éléments de la modale
    const modal = document.getElementById("modal"); // la modale "carré blanc avec le texte"
    const modalWrapper = document.querySelector(".modal-wrapper"); // fond transparent autour de la modale
    const closeBtn = document.querySelector(".modal-close"); // la fermeture de la modale
    const modifierBtn = document.querySelector(".modifier-section"); // bouton modifier
    const filtersContainer = document.querySelector(".filters"); // filtres
    const editBanner = document.querySelector(".edit-banner"); // Sbandeau noir mode edition
    const body = document.body; // Sélection de la balise body
    
    // Déclaration des éléments pour la navigation entre les vues de la modale
    const addPhotoBtn = document.querySelector(".modal-add-btn");
    const galleryView = document.querySelector(".modal-content.gallery-view");
    const addPhotoView = document.querySelector(".modal-content.add-photo");
    const backBtn = document.querySelector(".modal-back");

    // Éléments du formulaire d'ajout
    let imageInput = document.getElementById("image"); //let nous permet de modifier la valeur de imageInput plus tard
    //Récupère l'élément directement au chargement

    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const submitButton = document.querySelector("#add-work-form .submit-btn");
    const formError = document.getElementById("form-error");
    const imagePreviewContainer = document.getElementById("image-preview-container"); 
    const previewImage = document.getElementById("preview-image"); 
    

    // J'affiche dynamiquement les projets dans la galerie
    function renderGallery(works) {
    gallery.innerHTML = ""; // Je vide la galerie
    // Je lance une boucle sur chaque élément du tableau works, chaque work est un objet représentant un projet
    works.forEach(work => {
        const figure = document.createElement("figure"); // Je crée l'élément <figure> dynamiquement = pour regrouper une image et sa légende

        const img = document.createElement("img"); // Je crée l'élément <img>
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement("figcaption"); // Je crée l'élément <figcaption>, qui sert de légende à l’image, et on y insère le titre du projet
        caption.textContent = work.title;
        // j'insère l’image et la légende dans la balise <figure>.
        figure.appendChild(img);
        figure.appendChild(caption);
        // J'ajoute la figure complète (image + légende) dans la galerie HTML, dans le div.gallery
        gallery.appendChild(figure);
    });
}

    // Je RÉCUPÈRE LES TRAVAUX via l'API et JE LES AFFICHE avec la fonction fetch
    async function loadWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();

        renderGallery(works);       // on affiche 
        loadCategories(works);      // on charge les catégories filtres
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
}

    // Je met en surbrillance le bouton actif 
    function updateActiveButton(activeBtn) { // Je définis la fonction qui prend en paramètre le bouton qu’on veut rendre actif
    const buttons = document.querySelectorAll(".filter-btn"); // Je sélectionne tous les boutons du filtre 
    buttons.forEach(btn => btn.classList.remove("active")); // Je boucle sur chaque bouton et je lui retire la classe CSS active, pour m’assurer qu’aucun bouton ne reste actif visuellement
    activeBtn.classList.add("active"); // J'ajoute la classe active uniquement au bouton qui a été cliqué 
}
    // GESTION DES FILTRES

// je déclare la fonction asynchrone qui reçoit works (la liste des projets) en paramètre
async function loadCategories(works) {
    try {
        const response = await fetch("http://localhost:5678/api/categories"); // j'appelle l’API des catégories qui renvoie un tableau de catégories
        categories = await response.json(); // On transforme la réponse de l’API (au format JSON brut) en un tableau JavaScript exploitable

        // Je crée le bouton "Tous" 
        const allBtn = document.createElement("button"); // Je récupère le bouton
        allBtn.textContent = "Tous";
        allBtn.classList.add("filter-btn", "active"); // avec les classes css filter-btn et active
        allBtn.addEventListener("click", () => { // au click clique sur ce bouton
            renderGallery(works); // j'affiche tous les projets 
            updateActiveButton(allBtn); // je met à jour l’état visuel du bouton sélectionné 
        });
        filtersContainer.appendChild(allBtn); //  J'insère le bouton dans le conteneur .filters du HTML

        // Création des boutons de chaque catégorie 
        categories.forEach(category => { // Pour chaque catégorie reçue, je crée un bouton avec son nom
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("filter-btn");
            btn.addEventListener("click", () => { // au click sur le bouton 
                const filtered = works.filter(w => w.categoryId === category.id); // on filtre les projets en ne gardant que ceux qui ont la categoryId correspondante
                renderGallery(filtered); // on les affiche
                updateActiveButton(btn); // on met le bouton en état actif visuellement
            });
            filtersContainer.appendChild(btn); // J'ajoute chaque bouton de catégorie dans le conteneur HTML .filters.
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
}

    // Fonction pour réinitialiser l'aperçu de l'image
    function resetImagePreview() {
    
       // Récupération des éléments DOM nécessaires à cette fonction
    const previewImage = document.getElementById("preview-image");
    const uploadIconSvg = document.querySelector(".upload-icon-svg");
    const addPhotoText = document.querySelector(".add-photo-text");
    const fileSizeInfo = document.querySelector(".file-size-info");
    const imagePreviewContainer = document.getElementById("image-preview-container");
    const imageInput = document.getElementById("image"); 

    // Vérifier que tous les éléments sont bien présents avant de continuer
    if (!previewImage || !uploadIconSvg || !addPhotoText || !fileSizeInfo || !imagePreviewContainer || !imageInput) {
        console.error("Un ou plusieurs éléments de prévisualisation d'image sont manquants dans resetImagePreview.");
        return; 
    }

    previewImage.src = "#"; 
    previewImage.style.display = "none"; 

    uploadIconSvg.style.display = "block"; 
    addPhotoText.style.display = "block"; 
    fileSizeInfo.style.display = "block"; 
    imagePreviewContainer.classList.remove("has-image"); 
    imageInput.value = ""; 
}

    function setupImageInputHandler() { //Cette fonction ne fait qu'attacher l'écouteur d'événement
    // Récupération des éléments DOM nécessaires à cette fonction (NOUVELLES LIGNES À COLLER)
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview-image");
    const uploadIconSvg = document.querySelector(".upload-icon-svg");
    const addPhotoText = document.querySelector(".add-photo-text");
    const fileSizeInfo = document.querySelector(".file-size-info");
    const imagePreviewContainer = document.getElementById("image-preview-container");

    // Vérifier que tous les éléments sont bien présents avant d'attacher l'écouteur (NOUVELLES LIGNES À COLLER)
    if (!imageInput || !previewImage || !uploadIconSvg || !addPhotoText || !fileSizeInfo || !imagePreviewContainer) {
        console.error("Un ou plusieurs éléments d'input d'image sont manquants dans setupImageInputHandler.");
        return; // Arrête la fonction si un élément est manquant
    }

    // Le code de l'écouteur 'imageInput.onchange' qui était déjà là (VOUS LE COLLEZ ICI)
    imageInput.onchange = function() {
        const file = this.files[0];

        if (file) {
            // Vérification de la taille du fichier (max 4 Mo)
            if (file.size > 4 * 1024 * 1024) {
                alert("Le fichier est trop volumineux. La taille maximale est de 4 Mo.");
                resetImagePreview();  //Appelle la fonction de réinitialisation visuelle
                checkFormValidity();
                return; 
    }

            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result; //Définit la source de l'image
                previewImage.style.display = "block"; //Affiche l'image

                //Masque les éléments d'upload
                uploadIconSvg.style.display = "none";
                addPhotoText.style.display = "none";
                fileSizeInfo.style.display = "none";

                //Quand une image est sélectionnée dans le formulaire de la MODALE, pour qu'elle ajoute/retire la classe has-image
                imagePreviewContainer.classList.add("has-image"); 
            };

            reader.readAsDataURL(file);

        } else {
           // Si aucun fichier n'est sélectionné (par exemple, l'utilisateur annule la sélection)
             resetImagePreview(); // Appelle la fonction de réinitialisation visuelle de la MODALE
        }

        checkFormValidity(); // Vérifie la validité du formulaire après l'action sur l'image
    };
}

       //Ajout de la fonction checkFormValidity() et de ses écouteurs VÉRIFICATION DU FORMULAIRE d'activation du bouton VALIDER ---
    function checkFormValidity() {
        // Récupération des éléments DOM nécessaires à cette fonction
        const imageInput = document.getElementById("image"); 
        const titleInput = document.getElementById("title");
        const categorySelect = document.getElementById("category");
        const submitButton = document.querySelector("#add-work-form .submit-btn");

    // Ajoutez une vérification pour vous assurer que les éléments existent
    if (!imageInput || !titleInput || !categorySelect || !submitButton) {
        console.warn("Un ou plusieurs éléments du formulaire sont manquants pour checkFormValidity.");
        return; // Arrête la fonction si un élément est manquant
    }

        // Vérifie si un fichier a été sélectionné pour l'image
        const isImageSelected = imageInput.files.length > 0;
        
        // Vérifie si le champ titre n'est pas vide (après avoir retiré les espaces)
        const isTitleFilled = titleInput.value.trim() !== "";
        
        // Vérifie si une catégorie valide a été sélectionnée (c'est-à-dire pas l'option vide par défaut)
        const isCategorySelected = categorySelect.value !== "";

        if (isImageSelected && isTitleFilled && isCategorySelected) {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#1D6154"; // Vert
            submitButton.style.cursor = "pointer";
        } else {
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#A7A7A7"; // Gris
            submitButton.style.cursor = "not-allowed";
        }
    }


// Affichage dynamique des projets dans la modale
function renderModalGallery(works) { //On récupère les travaix et on les affiche dynamiquement dans la modale
    const modalGallery = document.querySelector(".modal-gallery"); //on séléctionne la gallerie de la modale
    modalGallery.innerHTML = ""; // On vide l'ancienne galerie

    works.forEach(work => { //On crée une balise <figure> pour chaque projet
        const figure = document.createElement("figure");
        figure.classList.add("modal-figure");

        const img = document.createElement("img"); //On insère l’image du projet
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteBtn = document.createElement("button"); //On ajoute le bouton de suppression (avec son icône SVG)
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
    <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
  </svg>`;
        deleteBtn.addEventListener("click", () => deleteWork(work.id, figure));//Quand on clique sur la corbeille, on appelle la fonction deleteWork() pour supprimer le projet

        figure.appendChild(img); //On ajoute l’image et le bouton de la corbeille à chaque figure, et on l’insère dans .modal-gallery
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
}

    //Suppression d’un projet (modale + galerie principale)
    async function deleteWork(id, figureElement) { //Fonction qui envoie une requête DELETE à l’API avec le token
    const token = localStorage.getItem("token");

    try { //Requête vars l'API pour supprimer un projet
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) { //Si suppression réussie, on retire l’élément de la modale
            // Supprimer dans la modale
            figureElement.remove();

            // Supprimer dans la galerie principale en la rechargeant
            loadWorks(); // Recharge la galerie principale et les filtres pour refléter le changement

        } else { //Gestion des erreurs si la requête échoue
            alert("Échec de la suppression.");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
}

    // Fonction pour charger les CATÉGORIES dans le FORMULAIRE de la MODALE
    async function loadCategoriesForForm() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    const select = document.getElementById("category");
    select.innerHTML = ""; // Vider le select avant d’ajouter les options

    const defaultOption = document.createElement("option");//Gestion du champs catégorie VIDE
    defaultOption.value = ""; // Valeur vide
    defaultOption.disabled = true; // Empêche l'utilisateur de la sélectionner après coup
    defaultOption.selected = true; // La rend sélectionnée par défaut au chargement
    select.appendChild(defaultOption);

    categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
    });
    checkFormValidity(); // Appel de checkFormValidity() après le chargement des catégories
  } catch (error) {
    console.error("Erreur lors du chargement des catégories dans le formulaire :", error);
  }
}

    // S'assurer que les écouteurs sont attachés aux champs du formulaire de la modale
    if (titleInput) titleInput.addEventListener("input", checkFormValidity);
    if (categorySelect) categorySelect.addEventListener("change", checkFormValidity);

    // Charger les catégories pour le formulaire (une seule fois au démarrage)
    loadCategoriesForForm();

    // Configurer le gestionnaire d'input d'image une fois au chargement initial
    setupImageInputHandler();

    // Vérifier l'état initial du formulaire (bouton Valider)
    checkFormValidity();


    // Je récupère le jeton (token) pour vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    
    // Je sélectionne les éléments DOM nécessaires
    const loginLink = document.getElementById("login-link");//la balise login
    const modifierSection = document.querySelector(".modifier-section"); //bouton "modifier"

    // Ajuster l'interface utilisateur en fonction de l'état de connexion de l'utilisateur
    if (token) {
        // Si connecté : Changer "login" en "logout" et configurer la fonctionnalité de déconnexion
        if (loginLink) {
            loginLink.textContent = "logout";
            loginLink.href = "#"; // Empêche la navigation par défaut
            loginLink.addEventListener("click", (e) => {
                e.preventDefault(); // Empêche le lien d'agir comme un lien normal
                localStorage.removeItem("token"); // Supprime le jeton
                window.location.reload(); // Recharge la page pour refléter l'état déconnecté
            });
        }
        
        // Masque la section des filtres pour les utilisateurs connectés
        if (filtersContainer) {
            filtersContainer.style.display = "none"; // cache les boutons de filtre
        }

        // Affiche la section de modification (bouton "modifier") pour les utilisateurs connectés
        if (modifierSection) {
            modifierSection.style.display = "flex"; // rend le bouton "modifier" visible
        }

            // Affiche le Bandeau mode édition
    if (editBanner) {
        editBanner.style.display = "flex"; // affiche le bandeau
    }

    body.classList.add("logged-in-mode"); // Ajout de la classe au body pour déclarer le contenu
   

    } else {
        // si aucun jeton n'est présent, l'utilisateur est déconnecté
        if (loginLink) {
            loginLink.textContent = "login";
            loginLink.href = "login.html"; // pointe vers la page de connexion
            // Pas besoin d'écouteur de clic à cet endroit, l'attribut href gère la navigation
        }

        // S'assure que les filtres sont visibles pour les utilisateurs déconnectés
        if (filtersContainer) {
            filtersContainer.style.display = "flex"; // affiche les boutons de filtre
        }

        // s'assure que la section de modification est masquée pour les utilisateurs déconnectés
        if (modifierSection) {
            modifierSection.style.display = "none"; // cache le bouton "modifier"
        }

        // s'assure que le bandeau "mode édition" est masqué pour les utilisateurs déconnectés
    if (editBanner) {
        editBanner.style.display = "none"; // masque le bandeau
    }

    body.classList.remove("logged-in-mode"); // Retire la classe du body pour annuler le décalage
    
}
    
        // Ouverture de la modale (au clic sur le bouton "modifier")
        modifierBtn.addEventListener("click", async () => {
        modal.style.display = "flex"; //la modale principale (#modal) est rendue visible (display: flex;)
        modal.setAttribute("aria-hidden", "false");
        // La première vue (galerie photo) est affichée par défaut à l'ouverture
        galleryView.classList.remove("hidden");
        addPhotoView.classList.add("hidden"); //La deuxième view (add photo) est cachée
        // Recharge les projets dans la galerie de la modale à chaque ouverture
        renderModalGallery(works);
    });

        // Fermeture de la modale par la croix
        closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        // S'assurer de revenir à la première vue et cacher la flèche en fermant la modale
        galleryView.classList.remove("hidden"); // Affiche la vue galerie (pour la prochaine ouverture)
        addPhotoView.classList.add("hidden"); // Cache la vue formulaire
        backBtn.classList.add("hidden"); // Cache la flèche de retour
        // Réinitialiser le formulaire et les messages d'erreur
        document.getElementById("add-work-form").reset();
        resetImagePreview(); // Réinitialise la prévisualisation visuelle de l'image de la MODALE

        document.getElementById("form-error").textContent = "";
        checkFormValidity(); // Appel de checkFormValidity() lors de la fermeture et du retour en arrière, bouton VALIDER
    });

        // Fermeture de la modale en cliquant en dehors du contenu principal
        modal.addEventListener("click", (e) => {
        // Vérifie si le clic est en dehors du modal-wrapper (le contenu blanc)
        if (!modalWrapper.contains(e.target) && !e.target.closest('.modal-close') && !e.target.closest('.modal-back')) { // Ajout de conditions pour éviter de fermer en cliquant sur les boutons
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");

        // S'assurer de revenir à la première vue et cacher la flèche en fermant la modale
        galleryView.classList.remove("hidden");
        addPhotoView.classList.add("hidden");
        backBtn.classList.add("hidden"); // Cache la flèche de retour

        // Réinitialiser le formulaire et les messages d'erreur
        document.getElementById("add-work-form").reset();
        resetImagePreview(); // Réinitialise la prévisualisation visuelle de l'image de la MODALE

        document.getElementById("form-error").textContent = "";
        }
    });

        // Passage de la première vue (galerie) à la deuxième vue (ajout photo)
        addPhotoBtn.addEventListener("click", () => {
        galleryView.classList.add("hidden");
        addPhotoView.classList.remove("hidden");
        backBtn.classList.remove("hidden");

        resetImagePreview(); // Réinitialise la prévisualisation visuelle de l'image de la MODALE

        //Appel à setupImageInputHandler() après reset pour s'assurer que l'écouteur est bien attaché au bon input
        setupImageInputHandler();

        titleInput.addEventListener("input", checkFormValidity);
        categorySelect.addEventListener("change", checkFormValidity);

        loadCategoriesForForm(); // Charge dynamiquement les catégories pour le formulaire
        checkFormValidity(); // Vérifie la validité du formulaire au moment de l'ouverture
    });

        // Retour de la deuxième vue (ajout photo) à la première vue (galerie)
        backBtn.addEventListener("click", () => { //au clicke sur la flèche de retour
        addPhotoView.classList.add("hidden");  // Cache le formulaire d'ajout
        galleryView.classList.remove("hidden"); // Affiche la galerie
        backBtn.classList.add("hidden");       // Cache la flèche de retour

        // Réinitialiser le formulaire quand on revient en arrière
        document.getElementById("add-work-form").reset(); // Réinitialise tous les champs du formulaire
        resetImagePreview(); // Réinitialise la prévisualisation visuelle de l'image de la MODALE
        document.getElementById("form-error").textContent = ""; // Efface les messages d'erreur
    });

        //Envoi du formulaire d’ajout
    document.getElementById("add-work-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // empêche rechargement

    // Récupération des éléments DOM nécessaires 
    const imageInput = document.getElementById("image"); 
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const submitButton = document.querySelector("#add-work-form .submit-btn");
    const formError = document.getElementById("form-error");

    // Ajoutez une vérification pour vous assurer que les éléments existent
    if (!imageInput || !titleInput || !categorySelect || !submitButton || !formError) {
        console.error("Un ou plusieurs éléments du formulaire de soumission sont manquants.");
        return; // Arrête la fonction si un élément est manquant
    }

  const token = localStorage.getItem("token");
  
  // Vérification des champs du FORMULAIRE
   // Si le bouton VALIDER est disabled, cela signifie que les champs ne sont pas tous valides
  // C'est une double sécurité, car le bouton ne devrait pas être cliquable si disabled
  if (submitButton.disabled) { 
    formError.textContent = "Veuillez remplir tous les champs requis.";
    return; // Arrête l'envoi si le formulaire n'est pas valide
  }

  // Construction du FormData
  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categorySelect.value);

  try {
     const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    if (response.ok) {
      formError.textContent = "";

      // Recharger la galerie principale
      await loadWorks(); //Attendre le rechargement de la galerie avant de rafraîchir la modale (Formulaire d'ajout)


      // Revenir à la vue galerie dans la modale
      // Ferme complètement la modale et réinitialise la vue par défaut pour la prochaine ouverture
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");

        // Assure que la modale est sur la vue galerie et la flèche cachée pour la prochaine ouverture
        galleryView.classList.remove("hidden"); // S'assure que la vue galerie est visible
        addPhotoView.classList.add("hidden");   // S'assure que la vue ajout est cachée
        backBtn.classList.add("hidden");        // S'assure que la flèche de retour est cachée

      // Réinitialiser le formulaire
      document.getElementById("add-work-form").reset();
      resetImagePreview(); // Réinitialise la prévisualisation visuelle de l'image de la MODALE
      checkFormValidity(); //Appel checkFormValidity() après soumission réussie et réinitialisation

      alert("Projet ajouté avec succès !"); // Ajout d'une alerte pour confirmer le succès


    } else {
    // Gestion des erreurs
    const errorData = await response.json();
    formError.textContent = `Échec de l’ajout du projet: ${errorData.message || response.statusText}`;
}

  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    formError.textContent = "Une erreur est survenue.";
  }
});

loadWorks();

});












