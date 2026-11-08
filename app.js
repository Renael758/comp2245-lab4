// Get the form and page elements
const form = document.querySelector('form');

const subjectList = form.elements.subject;

const availableCheckbox = form.elements.available;

const searchButton = form.querySelector('button[type="submit"]');

const status = document.querySelector('#status');

const tableBody = document.querySelector('#results tbody');


// Load subjects from the database
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


// Search and display books
async function searchBooks() {

    // Disable the Search button
    searchButton.disabled = true;

    status.textContent = 'Searching…';

    try {

        // Collect the form information
        const params = new URLSearchParams(new FormData(form));

        // Fetch the books
        const response = await fetch(`books.php?${params}`);

        if (!response.ok) {
            throw new Error('Could not load books');
        }

        const books = await response.json();


        // Clear previous results
        tableBody.replaceChildren();


        // Display each book
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


            // Highlight unavailable books
            if (Number(book.available) === 0) {

                availability.classList.add('out');

            }


            // Add cells to the row
            row.append(
                title,
                author,
                year,
                subject,
                availability
            );

            tableBody.append(row);

        });


        // Update the status message
        if (books.length === 0) {

            status.textContent = 'No books match your search.';

        } else {

            status.textContent =
                `${books.length} book${books.length === 1 ? '' : 's'} found.`;

        }


    } catch (error) {

        // Clear the results if something fails
        tableBody.replaceChildren();

        status.textContent =
            "Couldn't load the books. Please try again.";

        console.error(error);


    } finally {

        // Enable the Search button again
        searchButton.disabled = false;

    }

}


// Load the subjects when the page opens
loadSubjects().catch(error => {
    console.error(error);
});


// Load all books when the page opens
searchBooks();


// Search when the form is submitted
form.addEventListener('submit', event => {

    event.preventDefault();

    searchBooks();

});


// Automatically search when the subject changes
subjectList.addEventListener('change', () => {

    searchBooks();

});


// Automatically search when availability changes
availableCheckbox.addEventListener('change', () => {

    searchBooks();

});
