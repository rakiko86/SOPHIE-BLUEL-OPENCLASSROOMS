
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

async function deleteProject(e) {
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


//faire apparaitre 2 modale à partir  du bouton ajouter
const btnAddModal = document.querySelector(".addPhoto");
const modalAddPhoto = document.querySelector(".modalAddPhoto");
const arrowLeft = document.querySelector(".fa-arrow-left");
const modal = document.querySelector(".modal");
const markAdd = document.querySelector(".fa-x");

function displayAddModal() {
    btnAddModal.addEventListener("click", () => {
        modalAddPhoto.style.display = "flex";
            modal.style.display = "none";

       
    });
    arrowLeft.addEventListener("click",()=>{
        modalAddPhoto.style.display = "none";
       
        modal.style.display = "flex";

    });
    markAdd.addEventListener("click",()=>{
      modalContainer.style.display = "none"
    });
};
displayAddModal();

// Sélectionner les éléments nécessaires
const previewImg = document.querySelector("#picturePreview");
const inputFile = document.querySelector("#picture");
const buttonFile = document.querySelector(".add-photo");
const pFile = document.querySelector(".file-info");

// Écouter les changements sur l'input file
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  console.log("file");

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex"; // Affiche l'image si elle est masquée
      previewImg.classList.add("image-preview");
      pFile.style.display = "none";
    };

    reader.readAsDataURL(file); // Convertir l'image en base64

    pFile.textContent = file.name; // Afficher le nom du fichier
  } else {
    alert("Veuillez sélectionner un fichier image (jpg, png, jpeg).");
  }
});

// Optionnel: Déclencher l'input file en cliquant sur le bouton
buttonFile.addEventListener("click", () => {
  inputFile.click();
});

// Fonction pour obtenir les catégories depuis l'API
async function getCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Fonction pour afficher les catégories dans l'élément select
async function displayCategoryModal() {
  const select = document.querySelector(".modalAddPhoto select");
  
  // Nettoyer les options existantes
  select.innerHTML = '';

  const categories = await getCategories();
  
  // Vérifier si des catégories ont été récupérées
  if (categories.length === 0) {
    console.error('Aucune catégorie disponible');
    return;
  }
  
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

displayCategoryModal();
