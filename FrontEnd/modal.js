// Sélection des éléments du DOM
const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const galerieModal = document.querySelector(".galerieModal");
const apiUrl = 'http://localhost:5678/api';
let token = window.localStorage.getItem("authToken");

// Gestion des événements pour les triggers du modal
modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));

function toggleModal() {
    modalContainer.classList.toggle("active");
}

// Affichage du modal de la galerie
async function displayGalerieModal() {
    galerieModal.innerHTML = "";
    const projects = await fetchWorks();
    projects.forEach(project => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const trash = document.createElement('i');
        img.src = project.imageUrl;
        img.alt = project.title;

        trash.classList.add('fa-solid', 'fa-trash-can');
        trash.id = project.id;
       
        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        galerieModal.appendChild(figure);
    });

    DeleteWorks();
}

// Attachement des événements de suppression
function attachDeleteEvent() {
    const trashAll = document.querySelectorAll('.fa-trash-can');
    trashAll.forEach(trash => {
        trash.addEventListener("click", async (e) => {
            const id = trash.id;
            const init = {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            };

            try {
                const response = await fetch(`${apiUrl}/works/${id}`, init);
                if (!response.ok) {
                    console.log("Le delete n'est pas effectué!");
                    return;
                }
                console.log("Le delete est effectué!");
                await displayGalerieModal();
                const projects = await fetchWorks();
                displayWorks(projects);
            } catch (error) {
                console.error('Erreur lors de la suppression du travail:', error);
            }
        });
    });
}
// Appel de l'affichage du modal de la galerie
displayGalerieModal();