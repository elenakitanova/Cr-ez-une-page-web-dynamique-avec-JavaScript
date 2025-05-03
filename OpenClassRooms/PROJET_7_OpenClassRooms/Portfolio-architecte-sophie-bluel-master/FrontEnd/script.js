// Je récupère la galerie
const gallery = document.querySelector(".gallery");

// J'execute la fonction appel à l’API pour récupérer les travaux depuis l'API
async function loadWorks() {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();

        // Je nettoie la galerie
        gallery.innerHTML = "";

        // J'ajoute à la galerie les travaux récupérés. Pour chaque projet, je crée les balises <figure> dynamiquement
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
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
}
// Je déclare la fonction qui prend en compte les projets à afficher
function renderGallery(works) {
    gallery.innerHTML = ""; // Je vide la galerie au cas où il y aurait déjà des projets affichés, pour ne pas les empiler deux fois

    // Je crée un boucle pour parcourir chaque projet dans le tableau works
    works.forEach(work => {
        const figure = document.createElement("figure");
        // Ensuite, pour chaque projet work, je crée les balises
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

// Appel de la fonction au démarrage
loadWorks();

