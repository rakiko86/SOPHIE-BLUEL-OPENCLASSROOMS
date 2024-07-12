const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal))
 function toggleModal(){
modalContainer.classList.toggle("active")
 }

 const galeryModal = document.querySelector(".galeryModal");
 async function displayGalleryModal(){
    galeryModal.innerHTML ="";
    const galery = await getWorks();
    galery.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const trash =document.createElement ('i');
        trash.classList.add('fa-solid','fa-trash-can');
        trash.id = work.id;
        img.src = work.imageUrl;
        span.appendChild(trash);
        figure.appendChild(span);
        figure.appendChild(img);
        galleryModal.appendChild(figure);
    });

    deleteWorks()

 }

 displayGaleryModal()
  function deleteWorks(){
    const trashAll = document.querySelectorAll('.fa-trash-can');
    trashAll.forEach(trash => {
        trash.addEventListener("click",()=>{
            const id =trash.id;
            const init = {
                method:"DELETE",
                headers:{ Authorization: "Bearer " + authToken},
            }
            fetch('http://localhost:5678/api/works/'+id,init)
            .then((response)=> {
                if(!response.ok){
                    console.log("Le delete n'est pas éffectué!")
                }
                return response.json
            })
            .then((data)=>{
                console.log("Le delete est effectué voici la data:",data)
                displayGalleryModal()
                displayWorks()
            })
        })
    })
  }