// Get the subject dropdown
const form = document.querySelector('form');

const subjectList = form.elements.subject;

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

// Run when the page loads
loadSubjects().catch(error => {
    console.error(error);
});
