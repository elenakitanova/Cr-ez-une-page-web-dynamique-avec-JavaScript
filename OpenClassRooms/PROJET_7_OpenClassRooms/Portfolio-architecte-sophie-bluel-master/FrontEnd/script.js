// Je récupère la galerie
const gallery = document.querySelector(".gallery");

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

// Je récupère les travaux via l'API et je les affiche avec la fonction fetch
async function loadWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

        renderGallery(works);       // on affiche avec la fonction dédiée
        loadCategories(works);      // on charge les filtres
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
}

// Je crée les filtres dynamiquement et les boutons du filtre en fonction des catégories récupérées depuis l’API
const filtersContainer = document.querySelector(".filters"); // Je récupère les filtres
// je déclare la fonction asynchrone qui reçoit works (la liste des projets) en paramètre
async function loadCategories(works) {
    try {
        const response = await fetch("http://localhost:5678/api/categories"); // j'appelle l’API des catégories qui renvoie un tableau de catégories
        const categories = await response.json(); // On transforme la réponse de l’API (au format JSON brut) en un tableau JavaScript exploitable

        // Je crée le bouton "Tous" 
        const allBtn = document.createElement("button");
        allBtn.textContent = "Tous";
        allBtn.classList.add("filter-btn", "active"); // avec les classes css filter-btn et active
        allBtn.addEventListener("click", () => { // // au click clique sur ce bouton
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


