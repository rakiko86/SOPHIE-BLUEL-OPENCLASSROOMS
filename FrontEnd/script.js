// Fetch des travaux depuis l'API
async function fetchWorks() {
    try {
        const response = await fetch(`http://localhost:5678/api/works`, {
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

// Affichage des travaux
function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear existing content
    works.forEach(work => {
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

// Trier par catégorie
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

// Fetch des catégories depuis l'API
async function fetchCategories() {
    try {
        const response = await fetch(`http://localhost:5678/api/categories`, {
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

// Générer le menu des catégories
function generateCategoriesMenu(categories, projects) {
    const categoriesMenu = document.getElementById('categories-menu');
    categoriesMenu.innerHTML = '';
    const button = document.createElement('button');
    button.textContent = "Tous";

    
    //button.id = category.id;

    categoriesMenu.appendChild(button);

    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.addEventListener('click', (e) => {
            filterProjects(category.name, projects);
            setActiveCategory(button);
        });
        categoriesMenu.appendChild(button);
    });
    const firstButton = categoriesMenu.querySelector('button');
    firstButton.classList.add('active');
}

// Filtrer les projets par catégorie
function filterProjects(category, projects) {
    if (category === 'Tous') {
        displayWorks(projects);
    } else {
        const filteredProjects = projects.filter(project => project.category.name === category);
        displayWorks(filteredProjects);
    }
}

// Définir la catégorie active
function setActiveCategory(activeButton) {
    const buttons = document.querySelectorAll('#categories-menu button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Initialisation de l'application
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

// Vérifier si l'utilisateur est connecté
function isUserLoggedIn() {
    return token !== null; // Assuming 'token' is globally defined
}

// Activer le mode administrateur
function enableAdminMode() {
     document.querySelector(".login").innerText = "Logout";
const loginButton = document.getElementById("login-logout");
//loginButton.innerText = "Logout";
loginButton.id = "logout-button";
loginButton.addEventListener('click', handleLogout);
}

// Gérer la déconnexion
function handleLogout() {
    // Supprimer le token (par exemple, depuis le localStorage)
    localStorage.removeItem('authToken','.modal-btn modal-trigger'); // Assuming 'token' is stored in localStorage
    // Rediriger vers la page index.html
    window.location.href = 'index.html'; // Change to your index page URL
}

// Appel de enableAdminMode() pour s'assurer qu'il est activé
if (isUserLoggedIn()) {
    enableAdminMode();
}
enableAdminMode();