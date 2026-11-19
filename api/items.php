<?php
require 'storage.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['errors' => ['ใช้ได้เฉพาะ POST']], 405);
}

$item = [
    'id'          => uniqid('item'),
    'title'       => trim($_POST['title'] ?? ''),
    'type'        => trim($_POST['type'] ?? ''),
    'date'        => trim($_POST['date'] ?? ''),
    'role'        => trim($_POST['role'] ?? ''),
    'description' => trim($_POST['description'] ?? ''),
    'skills'      => splitText($_POST['skills'] ?? '', ','),    
    'reflection'  => [
        'whatIDid'     => trim($_POST['whatIDid'] ?? ''),
        'whatILearned' => trim($_POST['whatILearned'] ?? ''),
        'challenge'    => trim($_POST['challenge'] ?? ''),
        'nextStep'     => trim($_POST['nextStep'] ?? '')
    ],
    'evidence'    => splitText($_POST['evidence'] ?? '', "\n")  
];

$errors = [];
if ($item['title'] === '')       $errors[] = 'กรุณากรอก Title (ชื่อผลงาน)';
if ($item['type'] === '')        $errors[] = 'กรุณาเลือก Type (ประเภทของผลงาน)';
if ($item['role'] === '')        $errors[] = 'กรุณากรอก Role (บทบาท)';
if ($item['description'] === '') $errors[] = 'กรุณากรอก Description (รายละเอียด)';
if (count($item['skills']) === 0) $errors[] = 'กรุณาระบุ Skills อย่างน้อย 1 ทักษะ';
if ($item['reflection']['whatIDid'] === '')     $errors[] = 'กรุณากรอก Reflection: What I did';
if ($item['reflection']['whatILearned'] === '') $errors[] = 'กรุณากรอก Reflection: What I learned';
if ($item['reflection']['challenge'] === '')    $errors[] = 'กรุณากรอก Reflection: Challenge';
if ($item['reflection']['nextStep'] === '')     $errors[] = 'กรุณากรอก Reflection: Next step';

$parts = explode('-', $item['date']);
if (count($parts) !== 3 || !checkdate((int)$parts[1], (int)$parts[2], (int)$parts[0])) {
    $errors[] = 'วันที่ต้องเป็นรูปแบบ YYYY-MM-DD';
}

if (count($item['evidence']) === 0) {
    $errors[] = 'กรุณาระบุ Evidence (ลิงก์หลักฐาน) อย่างน้อย 1 รายการ';
}
foreach ($item['evidence'] as $link) {
    if (substr($link, 0, 7) !== 'http://' && substr($link, 0, 8) !== 'https://') {
        $errors[] = 'Evidence URL ต้องขึ้นต้นด้วย http:// หรือ https://';
        break;
    }
}

if (count($errors) > 0) {
    sendJson(['errors' => $errors], 400);
}

$portfolioId = $_POST['portfolioId'] ?? '';
$portfolios = readPortfolios();                     
foreach ($portfolios as $i => $portfolio) {
    if ($portfolio['id'] === $portfolioId) {
        $portfolios[$i]['items'][] = $item;         
        writePortfolios($portfolios);               
        sendJson($item, 201);
    }
}
sendJson(['errors' => ['ไม่พบ Portfolio']], 404);