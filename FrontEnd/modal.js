const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");
const galerieModal = document.querySelector(".galerieModal");
const apiUrl = 'http://localhost:5678/api';
let token = window.localStorage.getItem("authToken");

modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));

function toggleModal() {
  modalContainer.classList.toggle("active");
}

async function displayGalerieModal() {
  galerieModal.innerHTML = "";
  try {
    const response = await fetch(`${apiUrl}/works`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des projets');
    }
    const projects = await response.json();
    projects.forEach(project => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const button = document.createElement('button');
      const trash = document.createElement('i');
      
      img.src = project.imageUrl;
      img.alt = project.title;

      trash.classList.add('fa-solid', 'fa-trash-can');
      trash.id = project.id;
      
      button.appendChild(trash);
      figure.appendChild(img);  // Append img before button for better UX
      figure.appendChild(button);
      galerieModal.appendChild(figure);
    });
    attachDeleteEvent();

    
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
  }
}

function attachDeleteEvent() {
  const trashAll = document.querySelectorAll('.fa-trash-can');
  trashAll.forEach(trash => {
    trash.removeEventListener("click", deleteProject); // Remove existing listener to avoid duplicates
    trash.addEventListener("click", deleteProject);
  });
  deleteProject()
}

async function deleteProject(event) {
  const id = e.target.id;
  const init = {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  };

  try {
    const response = await fetch(`${apiUrl}/works/${id}`, init);
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression du projet');
    }
    console.log("Le projet a été supprimé avec succès!");
    await displayGalerieModal();
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
  }
}

displayGalerieModal();

