<?php

header('Content-Type: application/json; charset=UTF-8');

require __DIR__ . '/db.php';

$sql = "SELECT id, name FROM subjects ORDER BY name";

$stmt = $pdo->query($sql);

$subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($subjects);
