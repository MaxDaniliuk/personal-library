const addBookBtn = document.querySelector('.add-book-button');
const dialog = document.querySelector("#dialog");
const closeBtn = document.querySelector('#closeBtn');
const inputFields = document.querySelectorAll('.input-book');
const confirmBtn =document.querySelector('#confirmBtn');

const cardsWrapper = document.querySelector('.cards-wrapper');

const myLibrary = [];


addBookBtn.addEventListener('click', () => {
    dialog.showModal();
})

closeBtn.addEventListener('click', () => {
    makeFieldsEmpty([...inputFields]);
    dialog.close();
})

dialog.addEventListener('click', e => {
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        dialog.close();
    }
})

confirmBtn.addEventListener('click', (e) => {
    let inputs = [...inputFields];
    let book = new Book(inputs[0].value, inputs[1].value, inputs[2].value);

    addBookToLibrary(cardsWrapper, book)

    makeFieldsEmpty(inputs);
    e.preventDefault();
    dialog.close();
    myLibrary.push(book);
    console.log(myLibrary);
})

// Script


function Book(title, author, pages) {
                          // this id should be the same as array's id and change accordingly.  
    this.title = title;   // bookId should be the same as library's index and div position in the DOM, array start at 0. 
    this.author = author; // When I add it, it always at the end of array. But I need to track the index, bookId and
    this.pages = pages;   // div position in the DOM when I remove one.
}

/*
function addBookToLibrary(obj) { //Now I need to assign values to properties and then append those values to the 
    let div = createCard();   // corresponding textNodes "" 
                              //***  How can I access those text nodes from another function   ***
    let paraAll = document.querySelectorAll('')
}
*/

function addBookToLibrary(cardsContainer, bookObject) {
    let div = document.createElement('div');
    for (let i = 0; i < 3; i++) {
        let para = document.createElement('p');
        let node;
        if (i == 0) {
            node = document.createTextNode(`"${bookObject['title']}"`);
        } else if (i == 1) {
            node = document.createTextNode(bookObject['author']);
        } else if (i == 2) {
            node = document.createTextNode(bookObject['pages']);
        }
        para.appendChild(node);
        div.appendChild(para);
    }
    div.classList.add('book-card');
    
    cardsContainer.appendChild(div); //Haven't been run yet.
}

function makeFieldsEmpty(array) {
    array.forEach(element => {
        element.value = '';
    })
}