// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks()

    books.forEach((book) => {
      UI.addBookToList(book)
    })
  }

  static addBookToList(book) {
    const list = document.getElementById('book-list')
    const row = document.createElement('tr')

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `

    list.appendChild(row)
  }

  static deleteBook(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.parentElement.remove()
    }
  }

  static showAlert(message, className) {

    if (!document.getElementsByClassName('alert')[0]) {
      
      const div = document.createElement('div')
      div.className = `alert alert-${className} alert-dismissable fade show`
      div.setAttribute('role', 'alert')
      div.appendChild(document.createTextNode(message))

      const container = document.getElementsByClassName('container')[0]
      const form = document.getElementById('book-form')
      container.insertBefore(div, form)

      setTimeout(() => {
        document.getElementsByClassName('alert')[0].remove()
      }, 3000)
    }
  }

  static clearFields() {
    document.getElementById('title').value = null
    document.getElementById('author').value = null
    document.getElementById('isbn').value = null
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books
    if(localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }

    return books
  }

  static addBook(book) {
    const books = Store.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(isbn) {
    const books = Store.getBooks()

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })

    localStorage.setItem('books', JSON.stringify(books))
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a Book
document.getElementById('book-form').addEventListener('submit', (event) => {
  
  // Prevent submit button from actually submitting
  event.preventDefault()

  // Get form values
  const title = document.getElementById('title').value
  const author = document.getElementById('author').value
  const isbn = document.getElementById('isbn').value

  // Validate
  if(!title || !author || !isbn) {
    UI.showAlert('Please complete all fields.', 'danger')
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn)

    // Add Book to UI
    UI.addBookToList(book)

    // Add Book to Store
    Store.addBook(book)

    // Show success message
    UI.showAlert('Book Added', 'success')

    // Clear Fields
    UI.clearFields()
  }
})

// Event: Remove a Book
document.getElementById('book-list').addEventListener('click', (event) => {
  UI.deleteBook(event.target)

  // Remove Book from UI
  UI.deleteBook(event.target)

  // Remove Book from Store
  Store.removeBook(event.target.parentElement.previousElementSibling.textContent)

  // Show success message
  UI.showAlert('Book Removed', 'success')
})
