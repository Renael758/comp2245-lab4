// Get the form and page elements
const form = document.querySelector('form');

const subjectList = form.elements.subject;

const status = document.querySelector('#status');

const tableBody = document.querySelector('#results tbody');


// Load the subjects
async function loadSubjects() {

    const response = await fetch('subjects.php');

    if (!response.ok) {
        throw new Error('Could not load subjects');
    }

    const subjects = await response.json();

    subjects.forEach(subject => {

        const option = document.createElement('option');

        option.value = subject.id;

        option.textContent = subject.name;

        subjectList.append(option);

    });

}


// Search for books
async function searchBooks() {

    const params = new URLSearchParams(new FormData(form));

    const response = await fetch(`books.php?${params}`);

    if (!response.ok) {
        throw new Error('Could not load books');
    }

    const books = await response.json();


    // Clear the existing results
    tableBody.replaceChildren();


    // Create a row for every book
    books.forEach(book => {

        const row = document.createElement('tr');

        const title = document.createElement('td');
        title.textContent = book.title;

        const author = document.createElement('td');
        author.textContent = book.author;

        const year = document.createElement('td');
        year.textContent = book.year;

        const subject = document.createElement('td');
        subject.textContent = book.subject;

        const availability = document.createElement('td');

        availability.textContent =
            `${book.available} of ${book.copies}`;


        // Mark unavailable books in red
        if (Number(book.available) === 0) {
            availability.classList.add('out');
        }


        // Add the cells to the row
        row.append(
            title,
            author,
            year,
            subject,
            availability
        );

        // Add the row to the table
        tableBody.append(row);

    });


    // Display the number of results
    if (books.length === 0) {

        status.textContent = 'No books match your search.';

    } else {

        status.textContent =
            `${books.length} book${books.length === 1 ? '' : 's'} found.`;

    }

}


// Load subjects and books when the page loads
loadSubjects().catch(error => {
    console.error(error);
});

searchBooks().catch(error => {
    console.error(error);
});


// Search when the form is submitted
form.addEventListener('submit', event => {

    event.preventDefault();

    searchBooks().catch(error => {
        console.error(error);
    });

});
