const addBookBtn = document.querySelector('.add-book-button');
const dialog = document.querySelector("#dialog");
const closeBtn = document.querySelector('#closeBtn');
const inputFields = document.querySelectorAll('.input-book');
const confirmBtn = document.querySelector('#confirmBtn');
const cardsWrapper = document.querySelector('.cards-wrapper');
const checkBox = document.querySelector('input[type="checkbox"]');
const myLibrary = [];

function Book(title, author, pages) {  
    this.title = title;   
    this.author = author; 
    this.pages = pages;   
    this.status;
}

addBookBtn.addEventListener('click', () => {
    if (checkBox.checked) {
        checkBox.checked = false;
    }
    dialog.showModal();
})

function addBookToLibrary(cardsContainer, bookObject) {
    let div = document.createElement('div');
    createCard(div, bookObject);
    cardsContainer.appendChild(div); 
}

function setReadStatus(bookObject, readStatusButton) {
    if (checkBox.checked) {
        changeToGreen(bookObject, readStatusButton);
    } else {
        changeToRed(bookObject, readStatusButton);
    }
}

confirmBtn.addEventListener('click', (e) => {
    let inputs = [...inputFields];
    if (inputs[0].checkValidity() && inputs[1].checkValidity() && inputs[2].checkValidity()) {
        let book = new Book(inputs[0].value, inputs[1].value, inputs[2].value);
        addBookToLibrary(cardsWrapper, book)
        makeFieldsEmpty(inputs);
        e.preventDefault();
        dialog.close();
        myLibrary.push(book);
    }
})

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
    createButton(cardElement, 'Read Status', 'read-status', obj); 
    createButton(cardElement, 'X', 'card-delete-button'); 
}

function createButton(cardElement, text, className, objectBook = undefined) {
    let button = document.createElement('button');
    let node = document.createTextNode(text);
    button.appendChild(node);
    button.classList.add(className);
    if (objectBook) {
        setReadStatus(objectBook, button);
    }
    cardElement.appendChild(button);
}

function makeFieldsEmpty(array) {
    array.forEach(element => {
        element.value = '';
    })
}

cardsWrapper.addEventListener('click', e => {
    if (e.target.classList.contains('card-delete-button')) {
        findBook(e.target.parentNode, 'delete');
        e.target.parentNode.remove();
    }
    if (e.target.classList.contains('read-status')) {
        findBook(e.target.parentNode, e.target)
    }
})

function findBook(card, buttonElement) {
    let cardsNode = document.querySelectorAll('.book-card');
    let cardElements = [...cardsNode];
    let index = 0;
    cardElements.forEach(cardElement => {
        if (cardElement === card) {
            if (buttonElement.innerText === "delete") {
                myLibrary.splice(index, 1);
            }
            if (buttonElement.innerText === "Read" || buttonElement.innerText === "Not read") {
                toggleStatus(myLibrary[index], buttonElement);
            }
            return;
        }
        index++;
    })
}

function toggleStatus(bookObject, readStatusButton) {
    if (readStatusButton.innerText === 'Not read') {
        changeToGreen(bookObject, readStatusButton);
    } else if (readStatusButton.innerText === 'Read') {
        changeToRed(bookObject, readStatusButton);
    }
}

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

function changeToGreen(bookObject, readStatusButton) {
    bookObject['status'] = 'Read';
    readStatusButton.style.backgroundColor = 'green';
    readStatusButton.textContent = 'Read';
}

function changeToRed(bookObject, readStatusButton) {
    bookObject['status'] = 'Not read';
    readStatusButton.style.backgroundColor = 'red';
    readStatusButton.textContent = 'Not read';
}