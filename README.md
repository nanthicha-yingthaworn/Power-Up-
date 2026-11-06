# CS100 POWER UP!

Web App สำหรับสร้าง Personal Learning Portfolio และเพิ่มประสบการณ์การเรียนรู้ผ่านฟอร์ม
พัฒนาโดยกลุ่ม 12 ในรายวิชา CS100

## ความสามารถของเว็บ

- **Create Portfolio:** กรอกชื่อ (จริงหรือสมมติ), What I Enjoy, What I've Tried, What I'm Curious About
- **Add Portfolio Item:** เพิ่มได้หลายรายการต่อ 1 Portfolio (Title, Type, Date, Role, Description, Skills, Reflection 4 ช่อง, Evidence อย่างน้อย 1 ลิงก์)
- **View & Validate:** แสดงข้อมูลเป็น Portfolio พร้อมตรวจช่องที่จำเป็นและรูปแบบ URL/วันที่ พร้อมข้อความแจ้งเตือนเมื่อกรอกผิด
- **Save & Load:** บันทึกใน `localStorage` และข้อมูลยังอยู่หลัง Refresh หรือปิด/เปิด Browser เดิม
- **Multiple Portfolios:** รองรับหลาย Portfolios โดยข้อมูลของแต่ละ Portfolio ไม่ปะปนกัน

## เทคโนโลยีที่ใช้

- HTML, CSS, Bootstrap (ผ่าน CDN)
- JavaScript
- Git / GitHub

## โครงสร้าง Project

```
   Power-Up-/
   ├── index.html
   ├── CSS/
       ├── style.css
   ├── js/
       ├── script.js
   ├── sample-portfolio-1.json
   ├── sample-portfolio-2.json
   └── README.md
```

## วิธีเปิดและทดลองเว็บไซต์

1. ดาวน์โหลดหรือ clone โปรเจกต์
   ```bash
   git clone https://github.com/nanthicha-yingthaworn/Power-Up-.git
   ```
2. เปิดไฟล์ `index.html` ด้วย Browser (เช่น Chrome) ได้โดยตรง ไม่ต้องติดตั้งอะไรเพิ่ม
   - ต้องมีอินเทอร์เน็ตเพื่อโหลด Bootstrap จาก CDN
3. ทดลองใช้งาน
   1. สร้าง Portfolio ใหม่ในฟอร์ม Create Portfolio
   2. เพิ่ม Portfolio Item อย่างน้อย 2 รายการ
   3. กด Save แล้วตรวจว่าข้อมูลแสดงบนหน้าเว็บ
   4. กด Refresh แล้วตรวจว่าข้อมูลกลับมาครบ
   5. สร้าง Portfolio ที่ 2 พร้อม 2 Items แล้วตรวจว่าข้อมูลไม่ปะปนกับ Portfolio แรก

## ตัวอย่างโครงสร้างข้อมูล (JSON)

ดูตัวอย่างข้อมูล Portfolio ได้ที่ `sample-portfolio-1.json` และ `sample-portfolio-2.json`

## ข้อจำกัดของ Checkpoint นี้

- ข้อมูลเก็บใน `localStorage` ของ Browser เท่านั้น จึงไม่ถูกแชร์ข้าม Browser/เครื่อง
- ยังไม่มี Server-side script, ฐานข้อมูล หรือการเขียนไฟล์ JSON บน Server (จะทำในขั้น Final Demo)

## หมายเหตุ

- ไม่มีข้อมูลส่วนตัวหรือข้อมูล sensitive ในระบบทดลอง
- ใช้ AI ช่วยศึกษา/เขียนโค้ด โดยสมาชิกตรวจ แก้ ทดสอบ และอธิบายโค้ดได้เอง
