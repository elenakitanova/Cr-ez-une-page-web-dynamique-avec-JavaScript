// SECTION 1 : INITIALISATION ET DÉCLARATION DES VARIABLES GLOBALES ET ÉLÉMENTS DU DOM
// GESTION DE LA GALERIE PRINCIPALE
// Je récupère l'élément HTML dans lequel vont s'afficher les projets
const gallery = document.querySelector(".gallery");
// Je déclare un tableau pour stocker tous les projets (works) récupérés de l'API
var works = [];
// Je déclare un tableau pour stocker toutes les catégories récupérées de l'API
var categories = [];

// GESTION DU LOG IN/LOG OUT ET DU MASQUAGE DES FILTRES LORSQUE L'UTILISATEUR EST CONNECTÉ
document.addEventListener("DOMContentLoaded", () => {
    // Ce bloc de code est exécuté une fois que le DOM (structure HTML) est entièrement chargé

    // DÉCLARATION DES ÉLÉMENTS DU DOM LIÉS À LA MODALE PRINCIPALE (MODALE 1)
    const modal = document.getElementById("modal"); // Référence à l'élément de la modale principale (le conteneur blanc)
    const modalWrapper = document.querySelector(".modal-wrapper"); // Référence au fond transparent qui entoure la modale
    const closeBtn = document.querySelector(".modal-close"); // Référence au bouton de fermeture (la croix)
    const modifierBtn = document.querySelector(".modifier-section"); // Référence au bouton "Modifier" qui ouvre la modale
    const filtersContainer = document.querySelector(".filters"); // Référence au conteneur des boutons de filtre de la galerie principale
    const editBanner = document.querySelector(".edit-banner"); // Référence au bandeau noir affiché en mode édition
    const body = document.body; // Référence à la balise <body> pour gérer les classes CSS globales

    // DÉCLARATION DES ÉLÉMENTS DU DOM POUR LA NAVIGATION ENTRE LES VUES DE LA MODALE
    const addPhotoBtn = document.querySelector(".modal-add-btn"); // Bouton pour passer de la galerie à la vue d'ajout de photo
    const galleryView = document.querySelector(".modal-content.gallery-view"); // La première vue de la modale : la galerie des photos
    const addPhotoView = document.querySelector(".modal-content.add-photo"); // La deuxième vue de la modale : le formulaire d'ajout de photo
    const backBtn = document.querySelector(".modal-back"); // Bouton de retour (flèche) pour revenir à la galerie de la modale

    // DÉCLARATION DES ÉLÉMENTS DU DOM LIÉS AU FORMULAIRE D'AJOUT DE PHOTO (MODALE 2)
    let imageInput = document.getElementById("image"); // L'input de type fichier pour la sélection d'image (utilise 'let' pour pouvoir réinitialiser sa valeur)
    const titleInput = document.getElementById("title"); // L'input pour le titre du projet
    const categorySelect = document.getElementById("category"); // Le sélecteur de catégorie
    const submitButton = document.querySelector("#add-work-form .submit-btn"); // Le bouton de soumission du formulaire
    const formError = document.getElementById("form-error"); // L'élément où s'affichent les messages d'erreur du formulaire
    const imagePreviewContainer = document.getElementById("image-preview-container"); // Le conteneur de prévisualisation de l'image
    const previewImage = document.getElementById("preview-image"); // L'élément <img> où l'image sélectionnée sera prévisualisée


// ---
// SECTION 2 : FONCTIONS PRINCIPALES D'AFFICHAGE DE LA GALERIE ET GESTION DES FILTRES

    // Fonction pour afficher dynamiquement les projets dans la galerie principale de la page d'accueil
    function renderGallery(works) {
        gallery.innerHTML = ""; // Je vide la galerie pour éviter les duplicatas à chaque mise à jour
        // Je parcours chaque projet ('work') du tableau 'works'
        works.forEach(work => {
            const figure = document.createElement("figure"); // Je crée une balise <figure> pour chaque projet
            const img = document.createElement("img"); // Je crée l'élément <img> pour l'image du projet
            img.src = work.imageUrl; // Je définis la source de l'image avec l'URL du projet
            img.alt = work.title; // Je définis le texte alternatif de l'image

            const caption = document.createElement("figcaption"); // Je crée une légende pour l'image
            caption.textContent = work.title; // Le texte de la légende est le titre du projet

            figure.appendChild(img); // J'ajoute l'image à la figure
            figure.appendChild(caption); // J'ajoute la légende à la figure
            gallery.appendChild(figure); // J'ajoute la figure complète à la galerie principale
        });
    }

    // Fonction asynchrone pour récupérer les projets de l'API et déclencher leur affichage
    async function loadWorks() {
        try {
            const response = await fetch("http://localhost:5678/api/works"); // J'envoie la requête pour obtenir la liste des projets
            works = await response.json(); // Je convertis la réponse en objet JavaScript et la stocké dans 'works'

            renderGallery(works); // J'affiche les projets dans la galerie principale
            loadCategories(works); // Je charge également les catégories et les filtres associés
        } catch (error) {
            console.error("Erreur lors du chargement des projets :", error); // Gestion des erreurs de chargement
        }
    }

    // Fonction pour mettre en surbrillance le bouton de filtre actif
    function updateActiveButton(activeBtn) {
        const buttons = document.querySelectorAll(".filter-btn"); // Je sélectionne tous les boutons de filtre
        buttons.forEach(btn => btn.classList.remove("active")); // Je retire la classe 'active' de tous les boutons
        activeBtn.classList.add("active"); // J'ajoute la classe 'active' au bouton cliqué pour le mettre en surbrillance
    }

// ---
// SECTION 3 : GESTION DES FILTRES DE LA GALERIE PRINCIPALE

    // Fonction asynchrone pour charger et créer dynamiquement les boutons de filtre
    async function loadCategories(works) {
        try {
            const response = await fetch("http://localhost:5678/api/categories"); // J'appelle l'API pour obtenir la liste des catégories
            categories = await response.json(); // Je convertis la réponse en tableau JavaScript

            // CRÉATION DU BOUTON "TOUS"
            const allBtn = document.createElement("button"); // Je crée un nouveau bouton HTML
            allBtn.textContent = "Tous"; // Je définis le texte du bouton
            allBtn.classList.add("filter-btn", "active"); // J'applique les classes CSS et le rend actif par défaut
            allBtn.addEventListener("click", () => { // J'ajoute un écouteur d'événement pour le clic
                renderGallery(works); // Au clic, j'affiche tous les projets sans filtre
                updateActiveButton(allBtn); // Je mets à jour l'état visuel du bouton
            });
            filtersContainer.appendChild(allBtn); // J'insère le bouton "Tous" dans le conteneur des filtres

            // CRÉATION DES BOUTONS POUR CHAQUE CATÉGORIE INDIVIDUELLE
            categories.forEach(category => { // Pour chaque catégorie récupérée
                const btn = document.createElement("button"); // Je crée un nouveau bouton
                btn.textContent = category.name; // Le texte du bouton est le nom de la catégorie
                btn.classList.add("filter-btn"); // J'applique la classe CSS de style
                btn.addEventListener("click", () => { // J'ajoute un écouteur d'événement pour le clic
                    // Je filtre les projets pour ne garder que ceux qui correspondent à la categoryId cliquée
                    const filtered = works.filter(w => w.categoryId === category.id);
                    renderGallery(filtered); // J'affiche les projets filtrés
                    updateActiveButton(btn); // Je mets à jour l'état visuel du bouton
                });
                filtersContainer.appendChild(btn); // J'ajoute le bouton de catégorie au conteneur des filtres
            });
        } catch (error) {
            console.error("Erreur lors du chargement des catégories :", error); // Gestion des erreurs de chargement
        }
    }

// ---
// SECTION 4 : FONCTIONS DE GESTION DU FORMULAIRE D'AJOUT DE PHOTO (MODALE 2)

    // Fonction pour réinitialiser l'aperçu de l'image et l'état du champ d'upload dans le formulaire
    function resetImagePreview() {
        // Récupération des éléments DOM liés à l'aperçu de l'image
        const previewImage = document.getElementById("preview-image");
        const uploadIconSvg = document.querySelector(".upload-icon-svg");
        const addPhotoText = document.querySelector(".add-photo-text");
        const fileSizeInfo = document.querySelector(".file-size-info");
        const imagePreviewContainer = document.getElementById("image-preview-container");
        const imageInput = document.getElementById("image");

        // Vérifie que tous les éléments nécessaires sont présents avant de continuer
        if (!previewImage || !uploadIconSvg || !addPhotoText || !fileSizeInfo || !imagePreviewContainer || !imageInput) {
            console.error("Un ou plusieurs éléments de prévisualisation d'image sont manquants dans resetImagePreview.");
            return; // Arrête la fonction si un élément est manquant
        }

        previewImage.src = "#"; // Réinitialise la source de l'image de prévisualisation (efface l'image affichée)
        previewImage.style.display = "none"; // Masque l'élément <img> de prévisualisation

        uploadIconSvg.style.display = "block"; // Affiche l'icône d'upload
        addPhotoText.style.display = "block"; // Affiche le texte "Ajouter photo"
        fileSizeInfo.style.display = "block"; // Affiche l'information sur la taille maximale du fichier
        imagePreviewContainer.classList.remove("has-image"); // Retire la classe CSS qui indique la présence d'une image
        imageInput.value = ""; // Réinitialise la valeur de l'input de type 'file' (efface le fichier sélectionné précédemment)
    }

    // Fonction qui configure le gestionnaire d'événement pour l'input d'image
    function setupImageInputHandler() {
        // Récupération des éléments DOM nécessaires pour la gestion de l'input d'image
        const imageInput = document.getElementById("image");
        const previewImage = document.getElementById("preview-image");
        const uploadIconSvg = document.querySelector(".upload-icon-svg");
        const addPhotoText = document.querySelector(".add-photo-text");
        const fileSizeInfo = document.querySelector(".file-size-info");
        const imagePreviewContainer = document.getElementById("image-preview-container");

        // Vérifie si tous les éléments sont présents avant d'attacher l'écouteur
        if (!imageInput || !previewImage || !uploadIconSvg || !addPhotoText || !fileSizeInfo || !imagePreviewContainer) {
            console.error("Un ou plusieurs éléments d'input d'image sont manquants dans setupImageInputHandler.");
            return; // Arrête la fonction si un élément est manquant
        }

        // L'écouteur d'événement 'onchange' qui se déclenche quand un fichier est sélectionné
        imageInput.onchange = function() {
            const file = this.files[0]; // Récupère le premier fichier sélectionné

            if (file) {
                // Vérification de la taille du fichier (max 4 Mo)
                if (file.size > 4 * 1024 * 1024) {
                    alert("Le fichier est trop volumineux. La taille maximale est de 4 Mo."); // Affiche une alerte si le fichier dépasse 4 Mo
                    resetImagePreview(); // Réinitialise la prévisualisation visuelle
                    checkFormValidity(); // Vérifie la validité du formulaire après cette action
                    return;
                }

                const reader = new FileReader(); // Crée un lecteur de fichiers
                reader.onload = function(e) { // Quand le fichier est lu
                    previewImage.src = e.target.result; // Définit la source de l'image de prévisualisation
                    previewImage.style.display = "block"; // Affiche l'image de prévisualisation

                    // Masque les éléments d'upload par dessus
                    uploadIconSvg.style.display = "none";
                    addPhotoText.style.display = "none";
                    fileSizeInfo.style.display = "none";

                    imagePreviewContainer.classList.add("has-image"); // Ajoute une classe pour styliser le conteneur si une image est présente
                };

                reader.readAsDataURL(file); // Lance la lecture du fichier en tant qu'URL de données

            } else {
                // Si aucun fichier n'est sélectionné (par exemple, l'utilisateur annule)
                resetImagePreview(); // Appelle la fonction de réinitialisation visuelle de la modale
            }
            checkFormValidity(); // Vérifie la validité du formulaire après cette action sur l'image
        };
    }

    // Fonction pour vérifier la validité du formulaire d'ajout et activer/désactiver le bouton "Valider"
    function checkFormValidity() {
        // Récupération des éléments DOM nécessaires à cette vérification
        const imageInput = document.getElementById("image");
        const titleInput = document.getElementById("title");
        const categorySelect = document.getElementById("category");
        const submitButton = document.querySelector("#add-work-form .submit-btn");

        // Vérifie que tous les éléments du formulaire sont bien présents
        if (!imageInput || !titleInput || !categorySelect || !submitButton) {
            console.warn("Un ou plusieurs éléments du formulaire sont manquants pour checkFormValidity.");
            return; // Arrête la fonction si un élément est manquant
        }

        // Vérifie si un fichier a été sélectionné pour l'image
        const isImageSelected = imageInput.files.length > 0;

        // Vérifie si le champ titre n'est pas vide (après avoir supprimé les espaces inutiles)
        const isTitleFilled = titleInput.value.trim() !== "";

        // Vérifie si une catégorie valide a été sélectionnée (pas l'option vide par défaut)
        const isCategorySelected = categorySelect.value !== "";

        // Si tous les champs sont valides, le bouton "Valider" est activé et style en vert
        if (isImageSelected && isTitleFilled && isCategorySelected) {
            submitButton.disabled = false;
            submitButton.style.backgroundColor = "#1D6154"; // Couleur verte
            submitButton.style.cursor = "pointer"; // Curseur pointeur
        } else {
            // Sinon, le bouton est désactivé et style en gris
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "#A7A7A7"; // Couleur grise
            submitButton.style.cursor = "not-allowed"; // Curseur non autorisé
        }
    }


// ---
// SECTION 5 : GESTION DES PROJETS DANS LA MODALE (SUPPRESSION ET AFFICHAGE)

    // Fonction pour afficher dynamiquement les projets dans la galerie de la modale
    function renderModalGallery(works) {
        const modalGallery = document.querySelector(".modal-gallery"); // Je sélectionne la galerie dans la modale
        modalGallery.innerHTML = ""; // Je vide la galerie de la modale avant de la remplir

        works.forEach(work => { // Pour chaque projet
            const figure = document.createElement("figure"); // Je crée une balise <figure>
            figure.classList.add("modal-figure"); // J'ajoute une classe CSS spécifique

            const img = document.createElement("img"); // J'insère l'image du projet
            img.src = work.imageUrl;
            img.alt = work.title;

            // Je crée le bouton de suppression avec son icône SVG
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
                    <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
                </svg>`;
            // Au clic sur l'icône de corbeille, j'appelle la fonction deleteWork() pour supprimer le projet
            deleteBtn.addEventListener("click", () => deleteWork(work.id, figure));

            figure.appendChild(img); // J'ajoute l'image à la figure
            figure.appendChild(deleteBtn); // J'ajoute le bouton de suppression à la figure
            modalGallery.appendChild(figure); // J'insère la figure complète dans la galerie de la modale
        });
    }

    // Fonction asynchrone pour supprimer un projet (de la modale et de la galerie principale)
    async function deleteWork(id, figureElement) {
        const token = localStorage.getItem("token"); // Je récupère le jeton d'authentification de l'utilisateur

        try {
            // J'envoie une requête DELETE à l'API pour supprimer le projet par son ID
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}` // J'inclue le jeton d'authentification dans l'en-tête
                }
            });

            if (response.ok) { // Si la suppression est réussie (statut 200 OK)
                figureElement.remove(); // Je retire l'élément du projet de la modale
                loadWorks(); // Je relance le chargement des projets pour mettre à jour la galerie principale
            } else { // Si la suppression échoue
                alert("Échec de la suppression."); // J'affiche une alerte
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error); // Gestion des erreurs réseau
        }
    }

    // Fonction asynchrone pour charger les catégories et les afficher dans le sélecteur du formulaire d'ajout
    async function loadCategoriesForForm() {
        try {
            const response = await fetch("http://localhost:5678/api/categories"); // Je récupère les catégories de l'API
            const categories = await response.json(); // Je convertis la réponse en objet JavaScript

            const select = document.getElementById("category"); // Je sélectionne l'élément <select> du formulaire
            select.innerHTML = ""; // Je vide le sélecteur avant d'ajouter les nouvelles options

            // CRÉATION DE L'OPTION PAR DÉFAUT (VIDE)
            const defaultOption = document.createElement("option");
            defaultOption.value = ""; // Sa valeur est vide
            defaultOption.disabled = true; // Elle est désactivée (non sélectionnable après le choix initial)
            defaultOption.selected = true; // Elle est sélectionnée par défaut au chargement
            select.appendChild(defaultOption); // J'ajoute l'option au sélecteur

            // Ajout des catégories récupérées de l'API au sélecteur
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id; // La valeur de l'option est l'ID de la catégorie
                option.textContent = category.name; // Le texte affiche est le nom de la catégorie
                select.appendChild(option); // J'ajoute l'option au sélecteur
            });
            checkFormValidity(); // J'appelle la vérification de validité du formulaire après le chargement des catégories
        } catch (error) {
            console.error("Erreur lors du chargement des catégories dans le formulaire :", error); // Gestion des erreurs
        }
    }

// ---
// SECTION 6 : CONFIGURATION DES ÉCOUTEURS D'ÉVÉNEMENTS ET LOGIQUE D'AFFICHAGE (LOGIN/LOGOUT)

    // J'attache les écouteurs d'événements pour la vérification de validité du formulaire d'ajout
    // Si l'input de titre existe, j'ajoute un écouteur 'input' qui déclenche checkFormValidity à chaque saisie
    if (titleInput) titleInput.addEventListener("input", checkFormValidity);
    // Si le sélecteur de catégorie existe, j'ajoute un écouteur 'change' qui déclenche checkFormValidity lorsqu'une option est sélectionnée
    if (categorySelect) categorySelect.addEventListener("change", checkFormValidity);

    // Je charge les catégories pour le formulaire d'ajout une fois au démarrage de l'application
    loadCategoriesForForm();

    // Je configure le gestionnaire de l'input d'image (pour la prévisualisation et la taille) une fois au chargement initial
    setupImageInputHandler();

    // Je vérifie l'état initial du formulaire pour définir l'état du bouton "Valider" au chargement de la page
    checkFormValidity();

    // Je récupère le jeton d'authentification pour savoir si l'utilisateur est connecté
    const token = localStorage.getItem("token");

    // Je sélectionne les éléments du DOM liés au lien de connexion/déconnexion et à la section "Modifier"
    const loginLink = document.getElementById("login-link"); // Le lien "Login" ou "Logout"
    const modifierSection = document.querySelector(".modifier-section"); // La section qui contient le bouton "Modifier"

    // J'ajuste l'interface utilisateur en fonction de l'état de connexion de l'utilisateur
    if (token) { // Si un jeton est présent (utilisateur connecté)
        // Je change le texte du lien "Login" en "Logout" et configure la fonctionnalité de déconnexion
        if (loginLink) {
            loginLink.textContent = "logout";
            loginLink.href = "#"; // Empêche la navigation par défaut du lien
            loginLink.addEventListener("click", (e) => {
                e.preventDefault(); // Empêche le comportement par défaut du lien
                localStorage.removeItem("token"); // Je supprime le jeton du stockage local
                window.location.reload(); // Je recharge la page pour refléter l'état déconnecté
            });
        }

        // Je masque la section des filtres pour les utilisateurs connectés
        if (filtersContainer) {
            filtersContainer.style.display = "none";
        }

        // J'affiche la section de modification (bouton "Modifier") pour les utilisateurs connectés
        if (modifierSection) {
            modifierSection.style.display = "flex";
        }

        // J'affiche le bandeau "Mode édition" en haut de page
        if (editBanner) {
            editBanner.style.display = "flex";
        }

        body.classList.add("logged-in-mode"); // J'ajoute une classe au body pour décaler le contenu lorsque le bandeau est présent

    } else { // Si aucun jeton n'est présent (utilisateur déconnecté)
        // Je m'assure que le lien est "Login" et pointe vers la page de connexion
        if (loginLink) {
            loginLink.textContent = "login";
            loginLink.href = "login.html";
        }

        // Je m'assure que les filtres sont visibles pour les utilisateurs déconnectés
        if (filtersContainer) {
            filtersContainer.style.display = "flex";
        }

        // Je m'assure que la section de modification est masquée pour les utilisateurs déconnectés
        if (modifierSection) {
            modifierSection.style.display = "none";
        }

        // Je m'assure que le bandeau "Mode édition" est masqué pour les utilisateurs déconnectés
        if (editBanner) {
            editBanner.style.display = "none";
        }

        body.classList.remove("logged-in-mode"); // Je retire la classe du body pour annuler le décalage
    }

// ---
// SECTION 7 : GESTION DES INTERFACES DE LA MODALE (OUVERTURE, FERMETURE, NAVIGATION ENTRE VUES)

    // Ouverture de la modale lors du clic sur le bouton "Modifier"
    modifierBtn.addEventListener("click", async () => {
        modal.style.display = "flex"; // Rend la modale visible
        modal.setAttribute("aria-hidden", "false"); // Améliore l'accessibilité

        // Affiche la première vue (galerie photo de la modale) par défaut
        galleryView.classList.remove("hidden");
        // Masque la deuxième vue (formulaire d'ajout de photo)
        addPhotoView.classList.add("hidden");
        // Je relance l'affichage des projets dans la galerie de la modale à chaque ouverture
        renderModalGallery(works);
    });

    // Fermeture de la modale lors du clic sur la croix
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none"; // Masque la modale
        modal.setAttribute("aria-hidden", "true"); // Améliore l'accessibilité

        // Réinitialise l'affichage à la première vue (galerie) et masque la flèche de retour pour la prochaine ouverture
        galleryView.classList.remove("hidden");
        addPhotoView.classList.add("hidden");
        backBtn.classList.add("hidden"); // Cache la flèche de retour

        // Réinitialise le formulaire d'ajout et les messages d'erreur lors de la fermeture
        document.getElementById("add-work-form").reset();
        resetImagePreview(); // Réinitialise la prévisualisation de l'image du formulaire
        document.getElementById("form-error").textContent = ""; // Efface tout message d'erreur précédent
        checkFormValidity(); // Re-vérifie la validité du formulaire pour réinitialiser l'état du bouton "Valider"
    });

    // Fermeture de la modale en cliquant en dehors de son contenu principal
    modal.addEventListener("click", (e) => {
        // Vérifie si le clic n'est pas sur le contenu blanc de la modale, ni sur la croix, ni sur la flèche de retour
        if (!modalWrapper.contains(e.target) && !e.target.closest('.modal-close') && !e.target.closest('.modal-back')) {
            modal.style.display = "none"; // Masque la modale
            modal.setAttribute("aria-hidden", "true"); // Améliore l'accessibilité

            // Réinitialise l'affichage à la première vue et masque la flèche de retour
            galleryView.classList.remove("hidden");
            addPhotoView.classList.add("hidden");
            backBtn.classList.add("hidden");

            // Réinitialise le formulaire et les messages d'erreur
            document.getElementById("add-work-form").reset();
            resetImagePreview();
            document.getElementById("form-error").textContent = "";
        }
    });

    // Passage de la première vue (galerie de la modale) à la deuxième vue (ajout de photo)
    addPhotoBtn.addEventListener("click", () => {
        galleryView.classList.add("hidden"); // Masque la vue galerie
        addPhotoView.classList.remove("hidden"); // Affiche la vue formulaire d'ajout
        backBtn.classList.remove("hidden"); // Affiche la flèche de retour

        resetImagePreview(); // Réinitialise l'aperçu de l'image du formulaire

        // S'assure que le gestionnaire d'input d'image est bien attaché (essentiel après un reset)
        setupImageInputHandler();

        // Ré-attache les écouteurs pour la validité du formulaire (bien que déjà fait au début, cela assure robustesse)
        titleInput.addEventListener("input", checkFormValidity);
        categorySelect.addEventListener("change", checkFormValidity);

        loadCategoriesForForm(); // Charge dynamiquement les catégories pour le sélecteur du formulaire
        checkFormValidity(); // Vérifie la validité du formulaire au moment de l'ouverture de cette vue
    });

    // Retour de la deuxième vue (ajout photo) à la première vue (galerie de la modale)
    backBtn.addEventListener("click", () => {
        addPhotoView.classList.add("hidden"); // Masque le formulaire d'ajout
        galleryView.classList.remove("hidden"); // Affiche la galerie de la modale
        backBtn.classList.add("hidden"); // Cache la flèche de retour

        // Réinitialise le formulaire et ses états lorsque l'on revient en arrière
        document.getElementById("add-work-form").reset();
        resetImagePreview();
        document.getElementById("form-error").textContent = "";
        checkFormValidity(); // Re-vérifie la validité pour réinitialiser l'état du bouton "Valider"
    });

// ---
// SECTION 8 : GESTION DE LA SOUMISSION DU FORMULAIRE D'AJOUT DE PHOTO

    // Gestion de l'envoi du formulaire d'ajout d'un nouveau projet
    document.getElementById("add-work-form").addEventListener("submit", async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

        // Récupération des éléments du DOM nécessaires pour le traitement du formulaire
        const imageInput = document.getElementById("image");
        const titleInput = document.getElementById("title");
        const categorySelect = document.getElementById("category");
        const submitButton = document.querySelector("#add-work-form .submit-btn");
        const formError = document.getElementById("form-error");

        // Vérifie que tous les éléments du formulaire sont bien présents
        if (!imageInput || !titleInput || !categorySelect || !submitButton || !formError) {
            console.error("Un ou plusieurs éléments du formulaire de soumission sont manquants.");
            return; // Arrête la fonction si un élément est manquant
        }

        const token = localStorage.getItem("token"); // Je récupère le jeton d'authentification

        // Double vérification : si le bouton "Valider" est désactivé, cela signifie que les champs ne sont pas valides
        if (submitButton.disabled) {
            formError.textContent = "Veuillez remplir tous les champs requis."; // Affiche un message d'erreur
            return; // Arrête la soumission du formulaire
        }

        // Construction de l'objet FormData pour envoyer les données du formulaire (y compris le fichier image)
        const formData = new FormData();
        formData.append("image", imageInput.files[0]); // Ajoute le fichier image
        formData.append("title", titleInput.value); // Ajoute le titre
        formData.append("category", categorySelect.value); // Ajoute la catégorie

        try {
            // J'envoie la requête POST à l'API pour ajouter un nouveau projet
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST", // Méthode HTTP POST
                headers: {
                    Authorization: `Bearer ${token}`, // J'inclue le jeton d'authentification
                },
                body: formData // Les données du formulaire
            });

            if (response.ok) { // Si la réponse est OK (projet ajouté avec succès)
                formError.textContent = ""; // J'efface tout message d'erreur

                await loadWorks(); // Je recharge la galerie principale pour afficher le nouveau projet

                // Je ferme complètement la modale et réinitialise son état pour la prochaine ouverture
                modal.style.display = "none";
                modal.setAttribute("aria-hidden", "true");

                // J'assure que la modale revient sur la vue galerie et la flèche de retour est masquée
                galleryView.classList.remove("hidden");
                addPhotoView.classList.add("hidden");
                backBtn.classList.add("hidden");

                // Je réinitialise le formulaire après un ajout réussi
                document.getElementById("add-work-form").reset();
                resetImagePreview(); // Réinitialise la prévisualisation de l'image
                checkFormValidity(); // Re-vérifie la validité du formulaire pour réinitialiser l'état du bouton

                alert("Projet ajouté avec succès !"); // J'affiche une alerte de succès à l'utilisateur

            } else { // Si l'ajout échoue
                const errorData = await response.json(); // Je tente de parser le message d'erreur de l'API
                formError.textContent = `Échec de l’ajout du projet: ${errorData.message || response.statusText}`; // Affiche l'erreur
            }

        } catch (error) {
            console.error("Erreur lors de l'envoi :", error); // Gestion des erreurs réseau lors de l'envoi
            formError.textContent = "Une erreur est survenue."; // Message d'erreur générique
        }
    });

// ---
// SECTION 9 : APPELS INITIAUX AU CHARGEMENT DE LA PAGE

    // Je lance le chargement des projets et des catégories dès le départ
    loadWorks();

}); // FIN DE document.addEventListener("DOMContentLoaded")