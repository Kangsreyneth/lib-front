$(document).ready(function () {
  const API_URL = "http://localhost:8000/api/books";

  // Load books
  function loadBooks() {
    $("#books-container").html(`
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin"></i><p>Loading books...</p>
      </div>
    `);

    $.ajax({
      url: API_URL,
      method: "GET",
      success: function (res) {
        const books = res.data || res; // depends on API response format
        $("#books-container").empty();

        let totalBooks = books.length;
        let authors = [...new Set(books.map(b => b.author))].length;
        let categories = [...new Set(books.map(b => b.category))].length;
        let latestYear = Math.max(...books.map(b => b.year));

        $("#totalBooks").text(totalBooks);
        $("#totalAuthors").text(authors);
        $("#totalCategories").text(categories);
        $("#latestYear").text(latestYear);

        books.forEach(book => {
          $("#books-container").append(`
            <div class="book-card">
              <h4>${book.title}</h4>
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>Year:</strong> ${book.year}</p>
              <p><strong>Category:</strong> ${book.category}</p>
            </div>
          `);
        });
      },
      error: function (xhr) {
        $("#books-container").html(`<p style="color:red;">Failed to load books: ${xhr.status}</p>`);
      }
    });
  }

  loadBooks();

  // Add new book
  $("#addBookForm").submit(function (e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.ajax({
      url: API_URL,
      method: "POST",
      data: formData,
      success: function (res) {
        alert("✅ Book added successfully!");
        $("#addBookForm")[0].reset();
        loadBooks();
      },
      error: function (xhr) {
        console.error("Error adding book:", xhr.responseText);
        alert("❌ Failed to add book");
      }
    });
  });
});
