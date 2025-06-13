// GESTION DE LA GALERIE
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

// Je RÉCUPÈRE LES TRAVAUX via l'API et JE LES AFFICHE avec la fonction fetch
async function loadWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

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
        const categories = await response.json(); // On transforme la réponse de l’API (au format JSON brut) en un tableau JavaScript exploitable

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

// GESTION DU LOG IN/LOG OUT

// On vérifie si l'utilisateur est connecté => on récupère le "ticket d'identité" de l'utilisateur pour savoir s'il est connecté ou non
const token = localStorage.getItem("token"); // chercher la donnée stockée sous la clé "token" dans l'espace de stockage du navigateur
const loginLink = document.getElementById("login-link"); // je sélectionne l’élément HTML qui a l’attribut id="login-link" du lien "login" dans le menu <nav>

if (token) {
    // Si connecté : changer le lien login en logout
    loginLink.textContent = "logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token"); // Supprime le token
        window.location.reload(); // Recharge la page pour revenir à l'état "déconnecté"
    });
}

// GESTION DU MASQUE DES FILTRES UNE FOIS USER CONNECTÉ

// On vérifie si l'utilisateur est connecté => on récupère le "ticket d'identité"
document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token");

	if (token) {
		// Masquer les filtres
		const filters = document.querySelector(".filters");
		if (filters) {
			filters.style.display = "none";
		}

		// Afficher toute la barre de modification (le crayon + bouton)
		const modifierSection = document.querySelector(".modifier-section");
    if (modifierSection) {
	    modifierSection.style.display = "flex";
}
	}
});

// GESTION DE LA MODALE
document.addEventListener("DOMContentLoaded", () => {
	const modifier = document.querySelector(".modifier-section");
	const modal = document.getElementById("modal");
	const modalWrapper = document.querySelector(".modal-wrapper");
	const closeBtn = document.querySelector(".modal-close");

	if (!modifier || !modal || !modalWrapper || !closeBtn) return;

	modifier.addEventListener("click", () => {
		modal.style.display = "flex";
		modal.setAttribute("aria-hidden", "false");
	});

	closeBtn.addEventListener("click", () => {
		modal.style.display = "none";
		modal.setAttribute("aria-hidden", "true");
	});

	modal.addEventListener("click", (e) => {
		if (!modalWrapper.contains(e.target)) {
			modal.style.display = "none";
			modal.setAttribute("aria-hidden", "true");
		}
	});
});
document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token");
	const modifier = document.querySelector(".modifier-section");

	if (!token && modifier) {
		modifier.style.display = "none";
	}
});
// Génération des miniatures dans la modale
function renderModalGallery(works) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""; // Vide l'ancienne galerie

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.classList.add("modal-figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="9" height="11" viewBox="0 0 9 11" fill="none">
    <path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.5 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.42857 3.85714Z" fill="white"/>
  </svg>`;
        deleteBtn.addEventListener("click", () => deleteWork(work.id, figure));

        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
}
async function deleteWork(id, figureElement) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Supprimer dans la modale
            figureElement.remove();

            // Supprimer dans la galerie principale
            const mainGallery = document.querySelectorAll(".gallery figure");
            mainGallery.forEach(fig => {
                const img = fig.querySelector("img");
                if (img && img.src.includes(id)) {
                    fig.remove();
                }
            });
        } else {
            alert("Échec de la suppression.");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
}
document.querySelector(".modifier-section").addEventListener("click", async () => {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        renderModalGallery(works);
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
});
