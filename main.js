const addBookBtn = document.querySelector('.add-book-button');
const dialog = document.querySelector("#dialog");
const closeBtn = document.querySelector('#closeBtn');
const inputFields = document.querySelectorAll('.input-book');
const confirmBtn = document.querySelector('#confirmBtn');

const cardsWrapper = document.querySelector('.cards-wrapper');
const checkBox = document.querySelector('input[type="checkbox"]');

const myLibrary = [];


checkBox.addEventListener('change', e => {
    console.log('YUo')
})

addBookBtn.addEventListener('click', () => {
    if (checkBox.checked) {
        checkBox.checked = false;
    }   // Let's see how it will affet the color of button based on the checkbox state
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
        makeFieldsEmpty([...inputFields]);
        dialog.close();
    }
})

confirmBtn.addEventListener('click', (e) => {
    let inputs = [...inputFields];
    if (inputs[0].checkValidity() && inputs[1].checkValidity() && inputs[2].checkValidity()) {
        let book = new Book(inputs[0].value, inputs[1].value, inputs[2].value);
        addBookToLibrary(cardsWrapper, book)
        makeFieldsEmpty(inputs);
        e.preventDefault();
        dialog.close();  // Input require isn't working because of this
        myLibrary.push(book);
        console.log("Library after adding a book", myLibrary);
    }
})

function Book(title, author, pages) {  
    this.title = title;   
    this.author = author; 
    this.pages = pages;   
}

function addBookToLibrary(cardsContainer, bookObject) {
    let div = document.createElement('div');
    createCard(div, bookObject);
    createButton(div, 'Read Status', 'read-status'); // "Finished" when checked - green
    createButton(div, 'X', 'card-delete-button');    // "Not read" default red

    cardsContainer.appendChild(div); 
}

function setReadStatus() {

}

/*
const checkbox = document.getElementById('myCheckbox')

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    alert('checked');
  } else {
    alert('not checked');
  }
})
*/


function createButton(cardElement, text, className) {
    let button = document.createElement('button');
    let node = document.createTextNode(text);
    button.appendChild(node);
    button.classList.add(className);
    cardElement.appendChild(button);
}

function createCard(cardElement ,obj) {
    for (let i = 0; i < 3; i++) {
        let para = document.createElement('p');
        let node;
        if (i == 0) {
            node = document.createTextNode(`"${obj['title']}"`);
        } else if (i == 1) {
            node = document.createTextNode(obj['author']);
        } else if (i == 2) {
            node = document.createTextNode(obj['pages']);
        }
        para.appendChild(node);
        cardElement.appendChild(para);
    }
    cardElement.classList.add('book-card');
}

function makeFieldsEmpty(array) {
    array.forEach(element => {
        element.value = '';
    })
}

cardsWrapper.addEventListener('click', e => {
    if (!e.target.classList.contains('card-delete-button')) return;
    deleteBook(e.target.parentNode);
    e.target.parentNode.remove();
})

function deleteBook(card) {
    let cardsNode = document.querySelectorAll('.book-card');
    let cardElements = [...cardsNode];
    let index = 0;
    cardElements.forEach(cardElement => {
        if (cardElement === card) {
            console.log(myLibrary[index]);
            myLibrary.splice(index, 1);
            return;
        }
        index++;
    })
}

