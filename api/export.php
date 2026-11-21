<?php
// =============================================
// api/export.php — ดาวน์โหลด my-portfolio.json
// ใช้แบบ GET:  api/export.php?id=<portfolio id>
// =============================================
require 'storage.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson(['errors' => ['ใช้ได้เฉพาะ GET']], 405);
}

// อ่าน id จาก URL (?id=...) แล้วหา Portfolio ที่ตรงกัน
$id = $_GET['id'] ?? '';
foreach (readPortfolios() as $portfolio) {
    if ($portfolio['id'] === $id) {
        // บอก Browser ให้ดาวน์โหลดเป็นไฟล์ชื่อ my-portfolio.json (Content-Type: JSON ตั้งใน sendJson)
        header('Content-Disposition: attachment; filename="my-portfolio.json"');
        sendJson($portfolio);
    }
}

// ไม่พบ id นี้ → 404
sendJson(['errors' => ['ไม่พบ Portfolio']], 404);
