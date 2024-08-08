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

function generateCategoriesMenu(categories, projects) {
    const categoriesMenu = document.getElementById('categories-menu');
    const button = document.createElement('button');
    button.textContent = "Tous";
    button.id = "tous";

    button.addEventListener('click', () => {
        filterProjects('Tous', projects);
        setActiveCategory(button);
    });
    
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
    if (firstButton) {
        firstButton.classList.add('active');
    }
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
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
    try {
        const [projects, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
        displayWorks(projects, categories);
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
    let token = window.localStorage.getItem('authToken');
    return token !== null;
}

function enableAdminMode() {
    const loginButton = document.getElementById("login-logout");
    const editMode =document.getElementById("bandeau")
    const modalBtn = document.querySelector(".modal-btn.modal-trigger")
    loginButton.innerText = "Logout";
    loginButton.id = "login-logout";
    modalBtn.style.display ="flex";
    editMode.style.display ="flex";
    loginButton.addEventListener('click', handleLogout);
}

function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.href = 'index.html'; // Change to your index page URL
}

if (isUserLoggedIn()) {
    enableAdminMode();
}
initializeApp();