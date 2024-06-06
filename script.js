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

    changeStatusToFinished(checkBox) {
        if (checkBox.checked) this.#status = true;
        return false;
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
        button.classList.add(className);                                //book.setStatus()
        button.textContent = className === 'card-delete-button' ? 'X' : this.#checkBox.checked ? 'Read' : 'Not read';
        buttonDiv.appendChild(button);
    }
}

class EventHandler {
    #dialog;
    #inputFields = [...document.querySelectorAll('.input-book')];
    #checkBox = document.querySelector('input[type="checkbox"]');
    #cardWrapper = document.querySelector('.cards-wrapper');
    constructor() {
        this.#dialog = document.querySelector("#dialog");

        document.querySelector('.add-book-button').addEventListener('click', this.#openDialog.bind(this));
        document.querySelector('#confirmBtn').addEventListener('click', this.#createBookCard.bind(this));
        this.#dialog.addEventListener('close', this.#resetFileds.bind(this));
        this.#cardWrapper.addEventListener('click', this.#findBookCard.bind(this));
    }

    #findBookCard(e) {
        [...document.querySelectorAll('.book-card')].forEach((bookCard, index) => {
            if (e.target.parentNode.parentNode === bookCard) {
                if (e.target.classList.contains('card-delete-button')) {
                    OnlineLibrary.removeBook(index);
                    e.target.parentNode.parentNode.remove();
                }
            }
        })
    }
    
    #openDialog() {
        this.#dialog.showModal();
    }
    #createBookCard(e) {
        if (this.#inputFields[0].checkValidity() && this.#inputFields[1].checkValidity() && this.#inputFields[2].checkValidity()) {
            new BookCardCreator(new Book(this.#inputFields[0].value, this.#inputFields[1].value, this.#inputFields[2].value), this.#checkBox, this.#cardWrapper).init();
        }
        this.#resetFileds();
        e.preventDefault();
        this.#dialog.close();
    }

    #resetFileds() {
        this.#checkBox.checked = false;
        this.#inputFields.forEach(input => input.value = null);
    }
}

new EventHandler();

