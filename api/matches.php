<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$dataFile = __DIR__ . '/../data/matches.json';

if ($method === 'GET') {
    if (!is_file($dataFile)) {
        echo '[]';
        exit;
    }

    $content = file_get_contents($dataFile);
    if ($content === false || trim($content) === '') {
        echo '[]';
        exit;
    }

    json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(500);
        echo json_encode(['error' => 'Stored match data is invalid.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo $content;
    exit;
}

if ($method === 'POST') {
    $rawBody = file_get_contents('php://input');
    $decoded = json_decode($rawBody ?? '', true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $dir = dirname($dataFile);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }

    $encoded = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($encoded === false || file_put_contents($dataFile, $encoded . PHP_EOL, LOCK_EX) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not persist match data.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

header('Allow: GET, POST');
http_response_code(405);
echo json_encode(['error' => 'Method not allowed.'], JSON_UNESCAPED_UNICODE);
