const API_URL = 'http://localhost:5678/api';
let token = window.localStorage.getItem("authToken");

async function fetchWorks() {
  try {
    const response = await fetch(`${API_URL}/works`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
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

async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
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
  button.addEventListener('click', () => {
    displayWorks(projects);
    setActiveCategory(button);
  });
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

document.addEventListener("DOMContentLoaded", async () => {
  const projects = await fetchWorks();
  const categories = await fetchCategories();
  displayWorks(projects);
  if (token === null) {
    
    generateCategoriesMenu(categories, projects);
  } else {
    afficherPageAdmin();
  }

  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // Empêche l'envoi du formulaire par défaut
      const email = emailInput.value;
      const password = passwordInput.value;
      await login(email, password);
    });
  }

  const navItems = document.querySelectorAll('nav li[data-link]');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetLink = item.getAttribute('data-link');
      window.location.href = targetLink;
    });
  });
});

async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la connexion');
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      alert('Connexion réussie ! Redirection...');
      afficherPageAdmin();
    } else {
      document.getElementById('error-message').textContent = 'Erreur dans l’identifiant ou le mot de passe.';
    }
  } catch (error) {
    console.error('Erreur:', error);
    document.getElementById('error-message').textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
  }
}

function afficherPageAdmin() {
  const divCategoriesMenu = document.querySelector("#categories-menu");
  if (divCategoriesMenu) {
    divCategoriesMenu.style.display = "none";
  }
  const loginButton = document.querySelector(".login-button");
  if (loginButton) {
    loginButton.textContent = "Logout";
    loginButton.addEventListener("click", function() {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  }
  const mesProjets = document.querySelector(".mes-projects");
  if (mesProjets) {
    const linkIcon = document.createElement("a");
    const editIcon = document.createElement("i");
    const iconText = document.createElement("span");
    linkIcon.href = "#modal1";
    linkIcon.classList.add("js-modal");
    editIcon.classList.add("fa-regular", "fa-pen-to-square", "fa-2xs", "edit-icon");
    iconText.textContent = "modifier";
    linkIcon.appendChild(editIcon);
    linkIcon.appendChild(iconText);
    mesProjets.appendChild(linkIcon);
  }
}

function afficherPageAccueil() {
  window.location.href = 'index.html';
}
