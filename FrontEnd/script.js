//Fonction qui récupère les projets depuis l'API
async function fetchWorks () {
  try {
    //Effectuer une requete Get pour récupérer les projets
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'//indique que la réponse doit étre au format JSON
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json() 
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux:', error)
    return []
  }
}
//Afficher les projets dans la galerie
function displayWorks (works) {
  const gallery = document.querySelector('.gallery')
  gallery.innerHTML = '' 
  //Parcourir chaque projet et l'ajouter à la galerie
  works.forEach(work => {
    const figure = document.createElement('figure')
    const img = document.createElement('img')
    img.src = work.imageUrl
    img.alt = work.title
    const figcaption = document.createElement('figcaption')
    figcaption.innerText = work.title
    figure.appendChild(img)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
  })
}
//Fonction qui trie les projets par catégorie
function sortByCategory (data) {
  return data.reduce((acc, item) => {
    const categoryName = item.category.name
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(item)
    return acc
  }, {})
}
//Fonction qui récupère les catégorie depuis l'API
async function fetchCategories () {
  try {
    const response = await fetch(`http://localhost:5678/api/categories`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return []
  }
}
//Fonction qui génère le menu de catégories
function generateCategoriesMenu (categories, projects) {
  const categoriesMenu = document.getElementById('categories-menu')
  const button = document.createElement('button')
  button.textContent = 'Tous'
  button.id = 'tous'
   //Ajout un écouteur d'évènement pour filtrer tous les projets
  button.addEventListener('click', () => {
    filterProjects('Tous', projects)
    setActiveCategory(button)
  })
  categoriesMenu.appendChild(button)
  // Parcourt les catégories et crée un bouton pour chacune
  categories.forEach(category => {
    const button = document.createElement('button')
    button.textContent = category.name
    // Filtre les projets selon la catégorie
    button.addEventListener('click', e => {
      filterProjects(category.name, projects)
      setActiveCategory(button)
    })
    categoriesMenu.appendChild(button)
  })
// Active le premier bouton (Tous) par défaut
  const firstButton = categoriesMenu.querySelector('button')
  if (firstButton) {
    firstButton.classList.add('active')
  }
}
// Fonction qui filtre les projets en fonction de la catégorie sélectionnée
function filterProjects (category, projects) {
  if (category === 'Tous') {
    displayWorks(projects)// Affiche tous les projets si la catégorie est "Tous"
  } else {
    // Filtre les projets par catégorie
    const filteredProjects = projects.filter(
      project => project.category.name === category
    )
    displayWorks(filteredProjects)// Affiche les projets filtrés
  }
}
// Fonction qui met en surbrillance la catégorie active
function setActiveCategory (activeButton) {
  const buttons = document.querySelectorAll('button')
  // Supprime la classe 'active' de tous les boutons
  buttons.forEach(button => {
    button.classList.remove('active')
  })
   // Ajoute la classe 'active' au bouton sélectionné
  activeButton.classList.add('active')
}
// Ajoute un écouteur d'événement pour charger l'application une fois le DOM prêt
document.addEventListener('DOMContentLoaded', initializeApp)
// Fonction principale qui initialise l'application
async function initializeApp () {
  try {
    const [projects, categories] = await Promise.all([
      fetchWorks(),
      fetchCategories()
    ])
    displayWorks(projects, categories)
     // Active le mode admin si l'utilisateur est connecté
    if (isUserLoggedIn()) {
      enableAdminMode()
    } else {
      generateCategoriesMenu(categories, projects)
    }
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}
// Vérifie si l'utilisateur est connecté en fonction du token
function isUserLoggedIn () {
  let token = window.localStorage.getItem('authToken')
  return token !== null
}
// Active le mode admin avec des fonctionnalités supplémentaires
function enableAdminMode () {
  const loginButton = document.getElementById('login-logout')
  const editMode = document.getElementById('bandeau')
  const modalBtn = document.querySelector('.modal-btn.modal-trigger')
  loginButton.innerText = 'logout'
  loginButton.id = 'login-logout'
  modalBtn.style.display = 'flex'
  editMode.style.display = 'flex'
  loginButton.addEventListener('click', handleLogout)
}
// Fonction qui gère la déconnexion de l'utilisateur
function handleLogout () {
  localStorage.removeItem('authToken')
  window.location.href = 'index.html'
 }
// Active le mode admin si l'utilisateur est déjà connecté
if (isUserLoggedIn()) {
  enableAdminMode()
}
