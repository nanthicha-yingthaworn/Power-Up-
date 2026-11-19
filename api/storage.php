<?php

if (php_sapi_name() === 'cli-server') {
    define('DATA_DIR', __DIR__ . '/../local-data');
} else {
    define('DATA_DIR', '/var/www/data');
}
define('DATA_FILE', DATA_DIR . '/portfolios.json');

function lockData() {
    static $lock = null;
    if ($lock !== null) return;
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0775, true);
    $lock = fopen(DATA_DIR . '/portfolios.lock', 'c');
    flock($lock, LOCK_EX);
}

function readPortfolios() {
    lockData();     
    if (!file_exists(DATA_FILE)) return [];
    $portfolios = json_decode(file_get_contents(DATA_FILE), true);
    if (!is_array($portfolios)) return [];
    return $portfolios;
}

function writePortfolios($portfolios) {
    $json = json_encode($portfolios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents(DATA_FILE, $json);
}

function sendJson($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function splitText($text, $separator) {
    $list = [];
    $parts = explode($separator, $text);
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part !== '') {
            $list[] = $part;
        }
    }
    return $list;
}
