<?php

header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/db.php';

// Get the search term
$q = $_GET['q'] ?? '';

if (!is_string($q)) {
    $q = '';
}

$q = trim($q);

// Create the search pattern
$pattern = '%' . $q . '%';

// SQL query
$sql = "
    SELECT
        books.title,
        books.author,
        books.year,
        subjects.name AS subject,
        books.copies,
        (books.copies - books.on_loan) AS available
    FROM books
    JOIN subjects
        ON books.subject_id = subjects.id
    WHERE books.title LIKE :title
       OR books.author LIKE :author
";

// Prepare the parameters
$params = [
    ':title' => $pattern,
    ':author' => $pattern
];

// Prepare and execute the statement
$stmt = $pdo->prepare($sql);

$stmt->execute($params);

// Retrieve the results
$books = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Send JSON
echo json_encode($books);
