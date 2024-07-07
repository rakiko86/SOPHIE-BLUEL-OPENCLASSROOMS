document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la connexion
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');



    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche l'envoi du formulaire par défaut

            // Récupérer les valeurs des champs email et mot de passe
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

             
              // Appel de la fonction de connexion
              login(email, password);
          });
      }
  
      function login(email, password) {
          fetch('http://localhost:5678/api/users/login', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  email: email,
                  password: password
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.token) {
                  // Stocker le token dans le localStorage ou sessionStorage
                  sessionStorage.setItem('authToken', data.token);
                  // Réussite de la connexion
                  alert('Connexion réussie ! Redirection...');
                  // Redirection vers une autre page après la connexion réussie
                  window.location.href = afficherPageAdmin(){const divCategoriesMenu = document.querySelector("#categories-menu");
                  if (divCategoriesMenu) {
                    divCategoriesMenu.style.display = "none";
                  }
                  const loginButton = document.querySelector(".login-button");
                  if (loginButton) {
                    loginButton.textContent = "Logout";
                    loginButton.addEventListener("click", function() {
                      localStorage.removeItem("authToken");
                      window.location.href = "login.html";
                    });};
              } else { window.location.href = "index.html";
                 ;
                 
              }
          })
          .catch(error => {
              console.error('Erreur:', error);
              errorMessage.textContent = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          });
      }
    // Création dynamique des liens de navigation
    const navItems = document.querySelectorAll('#nav-list li');

    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.getAttribute('data-link');
        link.textContent = item.textContent;

        // Pour l'élément contenant l'image (Instagram)
        if (item.querySelector('img')) {
            link.innerHTML = item.innerHTML;
            link.style.display = 'inline-block';
        }

        // Vide le contenu de l'élément li et ajoute l'élément a
        item.textContent = '';
        item.appendChild(link);
    });
});