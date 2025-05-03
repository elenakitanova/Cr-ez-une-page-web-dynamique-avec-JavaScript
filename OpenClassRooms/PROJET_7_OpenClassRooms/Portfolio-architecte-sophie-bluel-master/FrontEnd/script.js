// Je récupère la galerie
const gallery = document.querySelector(".gallery");

// Fonction pour afficher dynamiquement les projets dans la galerie
function renderGallery(works) {
    gallery.innerHTML = ""; // Je vide la galerie

    works.forEach(work => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const caption = document.createElement("figcaption");
        caption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(caption);
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

// Je crée les filtres dynamiquement
const filtersContainer = document.querySelector(".filters");

async function loadCategories(works) {
    try {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        // Bouton "Tous"
        const allBtn = document.createElement("button");
        allBtn.textContent = "Tous";
        allBtn.classList.add("filter-btn", "active");
        allBtn.addEventListener("click", () => {
            renderGallery(works);
            updateActiveButton(allBtn);
        });
        filtersContainer.appendChild(allBtn);

        // Boutons par catégorie
        categories.forEach(category => {
            const btn = document.createElement("button");
            btn.textContent = category.name;
            btn.classList.add("filter-btn");
            btn.addEventListener("click", () => {
                const filtered = works.filter(w => w.categoryId === category.id);
                renderGallery(filtered);
                updateActiveButton(btn);
            });
            filtersContainer.appendChild(btn);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
}

// Je met à jour le style du bouton actif et je crée une boucle pour les autres boutons
function updateActiveButton(activeBtn) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    activeBtn.classList.add("active");
}

// Lancement au démarrage
loadWorks();


