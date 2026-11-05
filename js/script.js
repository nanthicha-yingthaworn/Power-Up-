//ฟังก์ชันตรวจสอบ URL
function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false;
  }
}

//ฟังก์ชันนำข้อความแจ้ง Error ไปขึ้นใน Alert Box ของ Bootstrap
function displayErrors(containerId, messages) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (messages.length > 0) {
    container.innerHTML = `<ul class="mb-0 ps-3">${messages
      .map((msg) => `<li>${msg}</li>`)
      .join("")}</ul>`;
    container.classList.remove("d-none");
  } else {
    container.innerHTML = "";
    container.classList.add("d-none"); //ซ่อนกล่องเมื่อไม่มีข้อผิดพลาด
  }
}

const portfolioForm = document.getElementById("portfolioForm");

portfolioForm.addEventListener("submit", function (event) {
  event.preventDefault(); //ไม่ให้เบราว์เซอร์รีโหลดหน้าเว็บ

  const errors = [];

  //อ่านค่าจากฟิลด์และตัดช่องว่างหัวท้าย
  const displayName = document.getElementById("displayName").value.trim();
  const whatIEnjoy = document.getElementById("whatIEnjoy").value.trim();
  const whatIveTried = document.getElementById("whatIveTried").value.trim();
  const whatImCuriousAbout = document.getElementById("whatImCuriousAbout").value.trim();

  //ตรวจสอบค่าว่างและขึ้นข้อความ Error
  if (!displayName) errors.push("กรุณากรอกชื่อที่ต้องการแสดง (Display Name)");
  if (!whatIEnjoy) errors.push("กรุณากรอก What I Enjoy (ชอบทำอะไร)");
  if (!whatIveTried) errors.push("กรุณากรอก What I've Tried (ลองทำอะไรมาแล้ว)");
  if (!whatImCuriousAbout) errors.push("กรุณากรอก What I'm Curious About (อยากรู้อะไรเพิ่ม)");

  if (errors.length > 0) {
    displayErrors("portfolioErrors", errors);
    return;
  }

  //ล้างกล่อง Error เมื่อผู้ใช้พิมพ์ถูกแล้ว
  displayErrors("portfolioErrors", []);

  console.log("✓ Portfolio Form ผ่านการ Validate แล้ว:", {
    displayName,
    whatIEnjoy,
    whatIveTried,
    whatImCuriousAbout
  });
});
