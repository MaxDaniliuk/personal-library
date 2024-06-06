class Book {
    #title;
    #author;
    #pages;
    #status = false;
    constructor(title, author, pages) {
        this.#title = title;
        this.#author = author;
        this.#pages = pages;
    }
    get title() {
        return this.#title;
    }

    get author() {
        return this.#author;
    }

    get pages() {
        return this.#pages;
    }

    get status() {
        return this.#status;
    }

    changeStatusToFinished() {
        this.#status = true;
    }

    toggleReadStatus() {
        this.#status = this.#status ? false : true;
    }
}

class OnlineLibrary {
    static myLibrary;
    static {
        this.myLibrary = [];
    }

    static addBook(book) {
        this.myLibrary.push(book);
    }

    static removeBook(index) {
        this.myLibrary.splice(index, 1);
    }
}

class BookCardCreator {
    #checkBox;
    #cardsWrapper;
    #card = document.createElement('div');
    constructor(book, checkBox, cardsWrapper) {
        this.newBook = book;
        this.#checkBox = checkBox;
        this.#cardsWrapper = cardsWrapper;
        OnlineLibrary.addBook(this.newBook);
    }

    init() {
        this.#createBookCard();
    }

    #createBookCard() {
        this.#card.classList.add('book-card');
        this.#cardsWrapper.appendChild(this.#includeContent());
    }

    #includeContent() {
        for (let i = 0; i < 3; i++) {
            let node;
            if (i == 0) node = document.createTextNode(`"${this.newBook.title}"`);
            if (i == 1) node = document.createTextNode(`${this.newBook.author}`);
            if (i == 2) node = document.createTextNode(`${this.newBook.pages}`);
            let para = document.createElement('p');
            para.appendChild(node);
            this.#card.appendChild(para);
        }
        let buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper');
        this.#createButton(buttonWrapper, 'read-status')
        this.#createButton(buttonWrapper, 'card-delete-button')
        this.#card.appendChild(buttonWrapper);
        return this.#card;
    }

    #createButton(buttonDiv, className) {
        let button = document.createElement('button');
        button.classList.add(className);
        if (className === 'card-delete-button') button.textContent = 'X';
        if (className === 'read-status') this.#setReadStatus(button)
        buttonDiv.appendChild(button);
    }

    #setReadStatus(button) {
        if (this.#checkBox.checked) this.newBook.changeStatusToFinished();
        EventHandler.changeReadStatusIdentifier(button, OnlineLibrary.myLibrary.length-1)
    }
}

class EventHandler {
    static #dialog;
    static #inputFields = [...document.querySelectorAll('.input-book')];
    static #checkBox = document.querySelector('input[type="checkbox"]');
    static #cardWrapper = document.querySelector('.cards-wrapper');
    static {
        this.#dialog = document.querySelector("#dialog");
        document.querySelector('.add-book-button').addEventListener('click', this.#openDialog.bind(this));
        document.querySelector('#confirmBtn').addEventListener('click', this.#createBookCard.bind(this));
        this.#dialog.addEventListener('close', this.#resetFields.bind(this));
        this.#dialog.addEventListener('click', this.#closeDialog.bind(this));
        this.#cardWrapper.addEventListener('click', this.#findBookCard.bind(this));
    }

    static #findBookCard(e) {
        [...document.querySelectorAll('.book-card')].forEach((bookCard, index) => {
            if (e.target.parentNode.parentNode === bookCard) {
                if (e.target.classList.contains('card-delete-button')) {
                    OnlineLibrary.removeBook(index);
                    e.target.parentNode.parentNode.remove();
                }
                if (e.target.classList.contains('read-status')) {
                    OnlineLibrary.myLibrary[index].toggleReadStatus()
                    EventHandler.changeReadStatusIdentifier(e.target, index)
                }
            }
        })
    }

    static changeReadStatusIdentifier(targetButton, index) {
        if (OnlineLibrary.myLibrary[index].status) {
            targetButton.textContent = 'Read';
            targetButton.style.backgroundColor = '#00b76d';
        } else {
            targetButton.textContent = 'Not read';
            targetButton.style.backgroundColor = '#cfcfcf';
        }
    }
    
    static #openDialog() {
        this.#dialog.showModal();
    }
    static #createBookCard(e) {
        if (this.#inputFields[0].checkValidity() && this.#inputFields[1].checkValidity() && this.#inputFields[2].checkValidity()) {
            new BookCardCreator(new Book(this.#inputFields[0].value, this.#inputFields[1].value, this.#inputFields[2].value), this.#checkBox, this.#cardWrapper).init();
        }
        this.#resetFields();
        e.preventDefault();
        this.#dialog.close();
    }

    static #resetFields() {
        this.#checkBox.checked = false;
        this.#inputFields.forEach(input => input.value = null);
    }

    static #closeDialog(e) {
        const dialogDimensions = this.#dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            this.#resetFields();
            this.#dialog.close();
        }
    }
}