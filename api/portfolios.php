<?php
require 'storage.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    sendJson(readPortfolios());
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['errors' => ['ใช้ได้เฉพาะ GET หรือ POST']], 405);
}


$action = $_POST['action'] ?? '';
if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $portfolios = readPortfolios();                 
    foreach ($portfolios as $i => $portfolio) {
        if ($portfolio['id'] === $id) {
            array_splice($portfolios, $i, 1);       
            writePortfolios($portfolios);           
            sendJson(['ok' => true]);
        }
    }
    sendJson(['errors' => ['ไม่พบ Portfolio']], 404);
}


$name    = trim($_POST['displayName'] ?? '');
$enjoy   = trim($_POST['whatIEnjoy'] ?? '');
$tried   = trim($_POST['whatIveTried'] ?? '');
$curious = trim($_POST['whatImCuriousAbout'] ?? '');

$errors = [];
if ($name === '')    $errors[] = 'กรุณากรอกชื่อที่ต้องการแสดง (Display Name)';
if ($enjoy === '')   $errors[] = 'กรุณากรอก What I Enjoy';
if ($tried === '')   $errors[] = "กรุณากรอก What I've Tried";
if ($curious === '') $errors[] = "กรุณากรอก What I'm Curious About";
if (count($errors) > 0) {
    sendJson(['errors' => $errors], 400);
}

$portfolio = [
    'id'                 => uniqid('p'),
    'displayName'        => $name,
    'whatIEnjoy'         => $enjoy,
    'whatIveTried'       => $tried,
    'whatImCuriousAbout' => $curious,
    'items'              => []
];

$portfolios = readPortfolios();     
$portfolios[] = $portfolio;         
writePortfolios($portfolios);       
sendJson($portfolio, 201);