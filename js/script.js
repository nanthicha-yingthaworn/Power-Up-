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