// GESTION DE LA GALERIE
// Je récupère la galerie
const gallery = document.querySelector(".gallery");
var works = [];
var categories = [];

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

// GESTION DES FILTRES

// JE CRÉE LES FILTRES dynamiquement et les boutons du filtre en fonction des catégories récupérées depuis l’API
const filtersContainer = document.querySelector(".filters"); // Je récupère les filtres
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

// Je met en surbrillance le bouton actif 
function updateActiveButton(activeBtn) { // Je définis la fonction qui prend en paramètre le bouton qu’on veut rendre actif
    const buttons = document.querySelectorAll(".filter-btn"); // Je sélectionne tous les boutons du filtre 
    buttons.forEach(btn => btn.classList.remove("active")); // Je boucle sur chaque bouton et je lui retire la classe CSS active, pour m’assurer qu’aucun bouton ne reste actif visuellement
    activeBtn.classList.add("active"); // J'ajoute la classe active uniquement au bouton qui a été cliqué 
}

// Lancement au démarrage
loadWorks();

function setupImageInputHandler() {
    if (imageInput) { // On s'assure que imageInput existe bien
        imageInput.onchange = function() { // onchange est utilisé pour remplacer un éventuel ancien gestionnaire
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Affiche l'image et recrée l'input file transparent PAR-DESSUS
                    imagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Prévisualisation" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        <input type="file" id="image" name="image" accept="image/png, image/jpeg" required style="opacity: 0; position: absolute; width: 100%; height: 100%; top: 0; left: 0; cursor: pointer; z-index: 10;" />`;

                    // IMPORTANT : On doit récupérer le NOUVEL input[type="file"] après la modification de innerHTML
                    imageInput = document.getElementById("image");

                    // Réattache l'écouteur onchange au NOUVEL input
                    // 'this' ici fait référence à la fonction 'onchange' elle-même
                    imageInput.onchange = this; 
                };
                reader.readAsDataURL(file);
            } else {
                // Si pas de fichier, réinitialise l'aperçu à l'état initial
                imagePreviewContainer.innerHTML = `
                    <i class="fa-regular fa-image upload-icon"></i>
                    <span>+ Ajouter photo</span>
                    <p class="file-size-info">jpg, png : 4mo max</p>
                    <img id="preview-image" src="#" alt="Prévisualisation du projet" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;">
                    <input type="file" id="image" name="image" accept="image/png, image/jpeg" required />
                `;
                imageInput = document.getElementById("image"); // Récupère le NOUVEL input
                imageInput.onchange = this; // Réattache l'écouteur
            }
            checkFormValidity(); // Vérifie la validité du formulaire après l'action sur l'image
        };
    }
}

// GESTION DU LOG IN/LOG OUT ET DU MASQUE DES FILTRES UNE FOIS USER CONNECTÉ
document.addEventListener("DOMContentLoaded", () => {
    // Je récupère le jeton (token) pour vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    
    // Je sélectionne les éléments DOM nécessaires
    const loginLink = document.getElementById("login-link");//la balise login
    const filtersContainer = document.querySelector(".filters"); //les filtres
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
        
        // Masquer les filtres
        if (filtersContainer) {
            filtersContainer.style.display = "none";
        }

        // Afficher la section de modification
        if (modifierSection) {
            modifierSection.style.display = "flex";
        }
    } else {
        // Si déconnecté : S'assurer que le lien "login" est correct et que les éléments de l'interface utilisateur sont masqués
        if (loginLink) {
            loginLink.textContent = "login";
            loginLink.href = "login.html"; // S'assurer qu'il pointe vers la page de connexion
            // Pas besoin d'écouteur de clic ici, l'attribut href gère la navigation
        }

        // S'assurer que les filtres sont visibles
        if (filtersContainer) {
            filtersContainer.style.display = "flex";
        }

        // S'assurer que la section de modification est masquée
        if (modifierSection) {
            modifierSection.style.display = "none";
        }
    }
});

// GESTION DE LA MODALE
// Déclaration des éléments de la modale
    // Déclaration des éléments de la modale (maintenant globales pour cette section)
    const modal = document.getElementById("modal");
    const modalWrapper = document.querySelector(".modal-wrapper");
    const closeBtn = document.querySelector(".modal-close");
    const modifierBtn = document.querySelector(".modifier-section"); // <-- Renommée de 'modifier' à 'modifierBtn'
    
    
    // Déclaration des éléments pour la navigation entre les vues de la modale
    const addPhotoBtn = document.querySelector(".modal-add-btn");
    const galleryView = document.querySelector(".modal-content.gallery-view");
    const addPhotoView = document.querySelector(".modal-content.add-photo");
    const backBtn = document.querySelector(".modal-back");

    // Éléments du formulaire d'ajout
    let imageInput = null; //let nous permet de modifier la valeur de imageInput plus tard
    //On le met à null car l'élément HTML n'existe pas encore au chargement initial de la page
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const submitButton = document.querySelector("#add-work-form .submit-btn");
    const formError = document.getElementById("form-error");
    const imagePreviewContainer = document.getElementById("image-preview-container"); 
    const previewImage = document.getElementById("preview-image"); 
    
    document.addEventListener("DOMContentLoaded", () => {

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    
     });

    // Sécurité : Vérifier que tous les éléments nécessaires existent
    if (!modifierBtn || !modal || !modalWrapper || !closeBtn || !addPhotoBtn || !galleryView || !addPhotoView || !backBtn || !imageInput || !titleInput || !categorySelect || !submitButton || !formError || !imagePreviewContainer || !previewImage) {
        console.error("Un ou plusieurs éléments de la modale sont introuvables. La modale ne fonctionnera pas correctement.");
        return;
    } // Arrête l'exécution si des éléments essentiels manquent
    
});
    // --- Ajout de la fonction checkFormValidity() et de ses écouteurs VÉRIFICATION DU FORMULAIRE d'activation du bouton VALIDER ---
    function checkFormValidity() {
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
    imagePreviewContainer.innerHTML = `
        <i class="fa-regular fa-image upload-icon"></i>
        <span>+ Ajouter photo</span>
        <p>jpg, png : 4mo max</p>
        <img id="preview-image" src="#" alt="Prévisualisation du projet" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;">
        <input type="file" id="image" name="image" accept="image/png, image/jpeg" required />
    `;
    imageInput = document.getElementById("image"); 
    setupImageInputHandler(); 

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
        document.getElementById("image-preview-container").innerHTML = `
            <i class="fa-regular fa-image upload-icon"></i>
            <span>+ Ajouter photo</span>
            <p>jpg, png : 4mo max</p>
            <input type="file" id="image" name="image" accept="image/png, image/jpeg" required />
        `;
        document.getElementById("form-error").textContent = "";
    }
});

    // Passage de la première vue (galerie) à la deuxième vue (ajout photo)
    addPhotoBtn.addEventListener("click", () => {
    galleryView.classList.add("hidden");
    addPhotoView.classList.remove("hidden");
    backBtn.classList.remove("hidden");

    // 1. On remet le contenu initial de la zone d'upload, qui inclut le <input type="file">
    imagePreviewContainer.innerHTML = `
        <i class="fa-regular fa-image upload-icon"></i>
        <span>+ Ajouter photo</span>
        <p class="file-size-info">jpg, png : 4mo max</p>
        <img id="preview-image" src="#" alt="Prévisualisation du projet" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;">
        <input type="file" id="image" name="image" accept="image/png, image/jpeg" required />
    `;

    // 2. On récupère le 'imageInput' qui vient d'être créé
    imageInput = document.getElementById("image"); 

    // 3. On attache le gestionnaire de prévisualisation à ce nouvel 'imageInput'
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
    document.getElementById("image-preview-container").innerHTML = `
        <i class="fa-regular fa-image upload-icon"></i>
        <span>+ Ajouter photo</span>
        <p>jpg, png : 4mo max</p>
        <input type="file" id="image" name="image" accept="image/png, image/jpeg" required />
    `; // Rétablit l'aperçu de l'image
    document.getElementById("form-error").textContent = ""; // Efface les messages d'erreur
});

 

//Masquer la section "modifier" si on n’est pas connecté
	const token = localStorage.getItem("token"); //On vérifie si l’utilisateur est connecté (via le token)
	

	if (!token && modifierBtn) { //Si pas de token, on cache .modifier-section
		modifierBtn.style.display = "none";
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

            // Supprimer dans la galerie principale
            const mainGallery = document.querySelectorAll(".gallery figure");//Puis, on cherche l’image correspondante dans la galerie principale et on la supprime aussi
            mainGallery.forEach(fig => {
                const img = fig.querySelector("img");
                if (img && img.src.includes(id)) {
                    fig.remove();
                }
            });

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

// CHARGEMENT DES CATÉGORIES DANS LA MODALE quand elle s’ouvre

//Envoi du formulaire d’ajout
document.getElementById("add-work-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche rechargement

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
      loadWorks();

      // Revenir à la vue galerie dans la modale
      addPhotoView.classList.add("hidden");
      galleryView.classList.remove("hidden");

      // Réinitialiser le formulaire
      document.getElementById("add-work-form").reset();

      imagePreviewContainer.innerHTML = `<i class="fa-regular fa-image upload-icon"></i>
        <span>+ Ajouter photo</span>
        <p>jpg, png : 4mo max</p>
        <img id="preview-image" src="#" alt="Prévisualisation du projet" style="display: none; max-width: 100%; max-height: 100%; object-fit: contain;">
        <input type="file" id="image" name="image" accept="image/png, image/jpeg" required />
    `;
    imageInput = document.getElementById("image"); 
    setupImageInputHandler(); 

      checkFormValidity(); //Appel checkFormValidity() après soumission réussie et réinitialisation


    } else {
      formError.textContent = "Échec de l’ajout du projet.";
    }

  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    formError.textContent = "Une erreur est survenue.";
  }
});
