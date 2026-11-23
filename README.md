# CS100 POWER UP! — Final System (กลุ่ม 12)

Web App สำหรับสร้าง Personal Learning Portfolio และเพิ่มประสบการณ์การเรียนรู้ (Portfolio Items) ผ่านฟอร์ม
ข้อมูลเก็บเป็นไฟล์ JSON บน Server (PHP) ใช้งานผ่าน AWS EC2 ได้ พร้อม Challenge Booth สำหรับแลกเปลี่ยน Portfolio Item JSON ข้ามกลุ่ม

## ความสามารถของระบบ

- **Create Portfolio / Add Item:** สร้างหลาย Portfolio และเพิ่มหลาย Item ต่อ Portfolio (โครงสร้างตาม `portfolio-example.json`)
- **Server-side Storage:** PHP รับข้อมูลจากฟอร์ม ตรวจซ้ำ แล้วบันทึกเป็นไฟล์ JSON บน Server
- **Load จาก Server:** อ่านข้อมูลจาก Server เป็นหลัก เปิดจากต่าง Browser/เครื่องเห็นข้อมูลชุดเดียวกัน (`localStorage` ใช้จำแค่ Portfolio ที่เลือก)
- **Challenge Booth:** Host สร้าง Portfolio Item JSON ให้ผู้ทำ Challenge สำเร็จ
- **Import Portfolio Item:** Paste JSON → Import → เลือก Portfolio → ตรวจ/แก้ Reflection → Save ลง Server
- **Export My Portfolio:** ดาวน์โหลด `my-portfolio.json` เฉพาะ Portfolio ของตนเอง

## เทคโนโลยีที่ใช้

- HTML, CSS, Bootstrap (ผ่าน CDN)
- JavaScript
- Git / GitHub
- PHP + Apache บน Ubunte

## โครงสร้าง Project

```
Power-Up-/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── api/
│   ├── storage.php     
│   ├── portfolios.php   
│   ├── items.php         
│   └── export.php    
├── tests/
│   ├── test-api.sh
├── .gitignore
├──  README.md
├──  sample-portfolio-1.json
└──  sample-portfolio-2.json
```

## วิธีติดตั้งบน AWS EC2 (Ubuntu)

1. สร้าง EC2 (Ubuntu) และตั้ง **Security Group เปิดเฉพาะ HTTP 80 (ทุกที่) และ SSH 22 (จำกัดเฉพาะ IP ของผู้ดูแลระบบ)**
2. ติดตั้งโปรแกรม
   ```bash
   sudo apt update
   sudo apt install apache2 php libapache2-mod-php git -y
   ```
3. **Security Group:** เปิดเฉพาะ Port 80 (HTTP, 0.0.0.0/0) และ Port 22 (SSH, จำกัดเฉพาะ IP ผู้ดูแลระบบ)
4. นำโค้ดขึ้น
   ```bash
   git clone https://github.com/nanthicha-yingthaworn/Power-Up-.git
   sudo rm -f /var/www/html/index.html
   sudo cp -r Power-Up-/* /var/www/html/
   ```
5. เปิด `http://<Public IP>/` ต้องเห็นเว็บ และเปิด `http://<Public IP>/api/portfolios.php` ต้องเห็น `[]` หรือข้อมูล JSON
6. อัปเดตโค้ดครั้งต่อไป: `git pull origin main` แล้ว `sudo cp -r` ซ้ำ

## วิธีรันบนเครื่องตัวเอง

ติดตั้ง PHP (`php -v` เพื่อตรวจ) แล้วรันในโฟลเดอร์ของ repo

```bash
php -S localhost:8000
```

เปิด `http://localhost:8000/` ข้อมูลจะถูกเก็บที่ `local-data/portfolios.json` (อยู่ใน `.gitignore`)

## วิธีทดสอบระบบ

**ชุดทดสอบอัตโนมัติ** (ผลที่ต้องได้คือ `FAIL 0` บันทึกไว้ที่ `tests/test-result.txt`)

```bash
bash tests/test-api.sh http://<Public IP> prod
```

**ทดสอบด้วยมือ**

| ทดสอบ | วิธี | ผลที่ต้องเห็น |
|---|---|---|
| Cross-device | บันทึกจาก Chrome แล้วเปิดจากมือถือ/Incognito | เห็นข้อมูลเดียวกัน |
| Persistence | `sudo systemctl restart apache2` และ `sudo reboot` | ข้อมูลยังอยู่ |
| Server Validation | กรอกไม่ครบ / URL ผิด / วันที่ผิด | แจ้งเตือนและไม่บันทึก (400) |
| File Access | เปิด `http://<IP>/data/portfolios.json` | 404 |
| Host สร้าง JSON | กด "เพื่อนทำสำเร็จ" แล้วกรอก Reflection/Evidence | ได้ Portfolio Item JSON ครบทุก field |
| Tester Import | วาง JSON → Import → Refresh | Item ยังอยู่บน Server |
| Import ผิด | วางข้อความที่ไม่ใช่ JSON / ลบ evidence | แจ้งเตือน ไม่บันทึก |
| Import ซ้ำ | Import JSON เดิมอีกครั้ง | ไม่สร้างรายการซ้ำ |
| Export | กดดาวน์โหลด `my-portfolio.json` | ไฟล์มี Portfolio + Items ครบ |
| Mobile | เปิดบนมือถือ | ใช้ฟอร์มและเมนูได้ |

## วิธีทดลอง Challenge และ Import/Export

**Challenge ของกลุ่ม** (ผู้เล่นที่ทำสำเร็จจะได้รับไฟล์ Portfolio Item JSON จาก Host)

**กิจกรรมที่ 1: หลักใครหลักมัน**
- **ผู้เล่น:** 2 คน คนที่ 1 เป็นหลักหน่วย คนที่ 2 เป็นหลักสิบ
- **วิธีเล่น:** ฟังโจทย์เลขแล้วตอบโดยการชูนิ้วตามหลักของตนเอง (คนที่ 1 ชูหลักหน่วย คนที่ 2 ชูหลักสิบ)
- **เกณฑ์สำเร็จ:** ทำครบอย่างน้อย 10 ข้อ
- **ทักษะที่ได้:** คิดเลขในใจ, ความเข้าใจค่าประจำหลัก, ทำงานเป็นทีม

**กิจกรรมที่ 2: ทายคำศัพท์ถอดรหัสภาพ**
- **วิธีเล่น:** ทายคำศัพท์ภาษาต่างประเทศ หากไม่รู้ใช้คำใบ้แบบถอดรหัสภาพเพื่อหาคำแปลของข้อนั้น
- **เกณฑ์สำเร็จ:** ตอบได้อย่างน้อย 3 ข้อ จึงถือว่าผ่านและได้รับไฟล์ JSON
- **ทักษะที่ได้:** ภาษา, การถอดรหัสภาพ

**ฝั่ง Host (เจ้าของบูธ)**
1. ให้เพื่อนต่างกลุ่มทำ Challenge
2. เมื่อสำเร็จ กด "เพื่อนทำสำเร็จ" แล้วกรอก Reflection และ Evidence (URL)
3. ระบบสร้าง Portfolio Item JSON ให้กด Copy (หรือดาวน์โหลดเป็น `.json`)

**ฝั่ง Tester (ผู้ทำ Challenge)**
1. วาง JSON ในช่อง Textarea ของเว็บกลุ่มตนเอง แล้วกด Import
2. เลือก Portfolio ปลายทาง
3. ตรวจ/ปรับ Reflection ให้ตรงกับสิ่งที่ทำจริง แล้วกด Save
4. Refresh เพื่อตรวจว่า Item ยังอยู่บน Server

**Export My Portfolio:** กดดาวน์โหลด `my-portfolio.json` (มีเฉพาะ Portfolio ของตนเอง)

## ความปลอดภัยเบื้องต้น

1. **จัดเก็บข้อมูล:** ไฟล์ JSON อยู่ที่ `/var/www/data` นอก Document Root เปิดผ่าน URL ตรงๆ ไม่ได้ (404)
2. **ตรวจข้อมูลซ้ำที่ Server:** แม้ Frontend ตรวจแล้ว ข้อมูลผิดจะได้ 400 และไฟล์ไม่เปลี่ยน
3. **Security Group:** เปิดเฉพาะ Port 22 และ 80
4. **ข้อมูลลับ:** `.gitignore` กัน `*.pem`, `*.key`, `.env`, `local-data/` ไม่นำ Password/AWS Credentials ขึ้น GitHub

## ข้อจำกัด

- ยังไม่มีระบบ Login/Database การเลือกชื่อไม่ถือเป็นการยืนยันตัวตน
- ใช้เฉพาะข้อมูลทดลองที่ไม่ sensitive

## หมายเหตุ

- ใช้ AI ช่วยศึกษา/เขียนโค้ด โดยสมาชิกตรวจ แก้ ทดสอบ และอธิบายโค้ดได้เอง (หลักฐานใน GitHub Issues/Commits)
- ไม่มีข้อมูลส่วนตัวหรือข้อมูล sensitive ในระบบทดลอง
