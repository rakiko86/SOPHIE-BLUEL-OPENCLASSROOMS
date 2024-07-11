
const apiUrl = 'http://localhost:5678/api';
let token = window.localStorage.getItem("authToken");

console.log("Tokne is here:" + token)

async function fetchWorks() {
  try {
    const response = await fetch(`${apiUrl}/works`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux:', error);
    return [];
  }
}

function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = ''; // Clear existing content
  works.forEach((work) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement('figcaption');
    figcaption.innerText = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

function sortByCategory(data) {
  return data.reduce((acc, item) => {
    const categoryName = item.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});
}

async function fetchCategories() {
  try {
    const response = await fetch(`${apiUrl}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
}

function generateCategoriesMenu(categories, projects) {
  const categoriesMenu = document.getElementById('categories-menu');
  categoriesMenu.innerHTML = '';
  const button = document.createElement('button');
  button.textContent = "Tous";
  categoriesMenu.appendChild(button);

  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.addEventListener('click', () => {
      filterProjects(category.name, projects);
      setActiveCategory(button);
    });
    categoriesMenu.appendChild(button);
  });
  const firstButton = categoriesMenu.querySelector('button');
  firstButton.classList.add('active');
}

function filterProjects(category, projects) {
  if (category === 'Tous') {
    displayWorks(projects);
  } else {
    const filteredProjects = projects.filter(project => project.category.name === category);
    displayWorks(filteredProjects);
  }
}

function setActiveCategory(activeButton) {
  const buttons = document.querySelectorAll('#categories-menu button');
  buttons.forEach(button => {
    button.classList.remove('active');
  });
  activeButton.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});

async function initializeApp() {
  try {
    const [projects, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
    displayWorks(projects);
    if (isUserLoggedIn()) {
      enableAdminMode();
    } else {
      generateCategoriesMenu(categories, projects);
    }
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

function isUserLoggedIn() {
  return token !== null; // Assuming 'token' is globally defined
}

function enableAdminMode() {
  document.querySelector(".login").innerText = "Logout";
  
 
}
