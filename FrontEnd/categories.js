document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:5678/api';
  
    // Fonction pour récupérer les catégories depuis l'API
    async function fetchCategories() {
      try {
        const response = await fetch(`${apiUrl}/categories`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
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
  
    // Fonction pour afficher les catégories dans une div
    function displayCategories(categories) {
      const categoriesDiv = document.querySelector('.categories');
      categoriesDiv.innerHTML = ''; // Clear existing content
  
      categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.textContent = category.name; // Assumes the category has a 'name' property
        categoryDiv.classList.add('category-item');
        categoriesDiv.appendChild(categoryDiv);
      });
    }
  
    // Fonction principale pour initialiser l'application
    async function main() {
      const categories = await fetchCategories();
      displayCategories(categories);
    }
  
    // Appeler la fonction principale pour démarrer l'application
    main();
  });
  