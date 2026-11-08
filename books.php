<?php

header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/db.php';

// Get the search term
$q = $_GET['q'] ?? '';

if (!is_string($q)) {
    $q = '';
}

$q = trim($q);

$pattern = '%' . $q . '%';

// Validate the subject filter
$subject = filter_input(
    INPUT_GET,
    'subject',
    FILTER_VALIDATE_INT
);

if (!is_int($subject) || $subject < 1) {
    $subject = null;
}

// Check the availability filter
$available = isset($_GET['available'])
    && $_GET['available'] === '1';

// Base SQL query
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
    WHERE (
        books.title LIKE :title
        OR books.author LIKE :author
    )
";

// Parameters
$params = [
    ':title' => $pattern,
    ':author' => $pattern
];

// Subject filter
if (is_int($subject)) {

    $sql .= " AND books.subject_id = :subject";

    $params[':subject'] = $subject;
}

// Availability filter
if ($available) {

    $sql .= " AND (books.copies - books.on_loan) > 0";

}

// Sort results
$sql .= " ORDER BY books.title";

// Execute query
$stmt = $pdo->prepare($sql);

$stmt->execute($params);

// Retrieve books
$books = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON
echo json_encode($books);
