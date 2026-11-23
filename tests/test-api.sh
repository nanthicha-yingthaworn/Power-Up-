#!/bin/bash

# รับค่า URL จากคำสั่งที่พิมพ์ใน Bash (ถ้าไม่ได้พิมพ์ต่อท้าย จะขึ้นช่องให้วาง URL แทน)
BASE_URL="$1"

if [ -z "$BASE_URL" ]; then
  read -p "กรุณาวาง URL ของ Server (เช่น http://... หรือ https://...): " BASE_URL
fi

# ตรวจสอบว่ามีการใส่ URL มาจริงหรือไม่
if [ -z "$BASE_URL" ]; then
  echo "Error: ยังไม่ได้ระบุ URL ของ Server"
  exit 1
fi

# ตัดเครื่องหมาย / ตัวท้ายสุดออก (ป้องกันกรณีวางลิงก์ที่มี / ต่อท้าย)
BASE_URL="${BASE_URL%/}"

echo "=========================================="
echo "เริ่มการทดสอบ API บน: $BASE_URL"
echo "=========================================="

# 1. ทดสอบการเข้าถึงหน้าเว็บหลัก (HTTP 200)
echo -n "[Test 1] ทดสอบเปิดหน้าเว็บหลัก: "
STATUS=$(curl -sk -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ "$STATUS" -eq 200 ]; then
  echo "PASS (HTTP $STATUS)"
else
  echo "FAIL (HTTP $STATUS)"
fi

# 2. ทดสอบดึงรายการ Portfolios (GET api/portfolios.php)
echo -n "[Test 2] ทดสอบอ่านข้อมูล Portfolios จาก Server: "
STATUS=$(curl -sk -o /dev/null -w "%{http_code}" "$BASE_URL/api/portfolios.php")
if [ "$STATUS" -eq 200 ]; then
  echo "PASS (HTTP $STATUS)"
else
  echo "FAIL (HTTP $STATUS)"
fi

# 3. ทดสอบ Server-side Validation (ส่งข้อมูลว่างไปสร้าง Portfolio ต้องโดนปฏิเสธ)
echo -n "[Test 3] ทดสอบ Server-side Validation (ส่งข้อมูลว่าง): "
STATUS=$(curl -sk -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{}' "$BASE_URL/api/portfolios.php")
if [ "$STATUS" -eq 400 ] || [ "$STATUS" -eq 422 ]; then
  echo "PASS (ระบบปฏิเสธถูกต้อง HTTP $STATUS)"
else
  echo "FAIL (คาดหวัง HTTP 400 แต่ได้ $STATUS)"
fi

# 4. ทดสอบการป้องกันการเข้าถึงไฟล์ฐานข้อมูล JSON โดยตรง
echo -n "[Test 4] ทดสอบป้องกันการเปิดไฟล์ /data/portfolios.json โดยตรง: "
STATUS=$(curl -sk -o /dev/null -w "%{http_code}" "$BASE_URL/data/portfolios.json")
if [ "$STATUS" -eq 403 ] || [ "$STATUS" -eq 404 ]; then
  echo "PASS (ระบบบล็อกการเข้าถึงสำเร็จ HTTP $STATUS)"
else
  echo "FAIL (อันตราย: เปิดไฟล์ตรงได้ HTTP $STATUS)"
fi

echo "=========================================="
echo "เสร็จสิ้นการทดสอบ"
echo "=========================================="