const bookList = document.getElementById("book-list");
const container = document.getElementById("container");
const searchForm = document.getElementById("search");
const input = document.getElementById("input");
const nextButton = document.getElementById("next-button");
const apiEndpoint = "https://gutendex.com/books";

async function getBooks(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    if (!data.count) {
      showBook(data);
    } else {
      populateBookList(data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
// fetch books on pageload
getBooks(apiEndpoint);

function populateBookList(data) {
  console.log(data);
  while (bookList.firstChild) {
    bookList.firstChild.remove();
  }
  data.results.forEach((e) => {
    const bookTitle = document.createElement("li");
    bookTitle.textContent = e.title;
    bookList.append(bookTitle);
    bookTitle.addEventListener("click", () => {
      getBooks(`${apiEndpoint}/${e.id}`);
    });
  });

  nextButton.addEventListener("click", () => {
    getBooks(data.next);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function showBook(data) {
  const bookModal = document.createElement("dialog");
  bookModal.classList.add("modal");
  const bookTitle = document.createElement("h2");
  bookTitle.textContent = data.title;
  const bookAuthor = document.createElement("p");
  bookAuthor.textContent = data.authors[0].name;
  const bookSubjects = document.createElement("p");
  bookSubjects.textContent = data.subjects[0];
  bookModal.append(bookTitle, bookAuthor, bookSubjects);
  document.body.append(bookModal);
  bookModal.showModal();
  document.body.addEventListener("click", closeModal);
  function closeModal() {
    document.body.removeEventListener("click", closeModal);
    bookModal.close();
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = input.value;
  getBooks(`${apiEndpoint}?search=${searchTerm.replace(" ", "%20")}`);
});
