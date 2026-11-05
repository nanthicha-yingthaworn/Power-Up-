let portfolios = [];
let currentPortfolioId = null;

//ฟังก์ชันดึงข้อมูล Portfolio ปัจจุบันที่กำลังเลือกอยู่
function getCurrentPortfolio() {
    return portfolios.find((p) => p.id === currentPortfolioId) || null;
}



//เรนเดอร์ภาพรวมทั้งหมดลงใน #portfolioView
function renderPortfolioView() {
    const viewContainer = document.getElementById("portfolioView");
    if (!viewContainer) return;

    const current = getCurrentPortfolio();

    //กรณีที่ 1: ยังไม่มีการเลือกหรือสร้าง Portfolio ให้แสดง Empty State
    if (!current) {
        viewContainer.innerHTML = `
      <div class="box empty text-center">
        <div class="big-emoji">📂</div>
        <h3 class="mt-3">ยังไม่มีข้อมูล Portfolio</h3>
        <p class="text-muted">กรุณาสร้าง Portfolio ใหม่เพื่อเริ่มต้นใช้งาน</p>
      </div>
    `;
        return;
    }

    //ทำรูป Avatar
    const initial = current.displayName ? current.displayName.charAt(0).toUpperCase() : "?";

    //กรณีที่ 2: มี Portfolio แล้ว ให้เรนเดอร์ Profile Header
    let html = `
    <div class="box profile">
      <div class="avatar">${initial}</div>
      <h2>${current.displayName}</h2>
      <div class="row g-2 mt-3 text-start">
        <div class="col-md-4">
          <div class="about">
            <b>What I Enjoy</b>
            <p>${current.whatIEnjoy}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="about">
            <b>What I've Tried</b>
            <p>${current.whatIveTried}</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="about">
            <b>What I'm Curious About</b>
            <p>${current.whatImCuriousAbout}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="items-title d-flex justify-content-between align-items-center">
      <span>รายการผลงาน (${current.items.length})</span>
    </div>
    <div id="itemsContainer"></div>
  `;

    viewContainer.innerHTML = html;

    //เรนเดอร์การ์ดผลงาน
    renderItemsList(current.items);
}


//ฟังก์ชันเรนเดอร์รายการ Item
function renderItemsList(items) {
    const container = document.getElementById("itemsContainer");
    if (!container) return;

    //กรณีที่ 1: ยังไม่มีผลงานใน Portfolio
    if (items.length === 0) {
        container.innerHTML = `
      <div class="box text-center py-4 text-muted">
        <p class="mb-0">ยังไม่มีชิ้นงานใน Portfolio นี้ เพิ่มผลงานได้จากฟอร์มข้อ 3</p>
      </div>
    `;
        return;
    }

    //กรณีที่ 2: มีผลงาน แปลงแต่ละ item ออกมาเป็นการ์ด HTML
    const itemsHtml = items.map((item) => {
        //แปลง Skills ให้แยกกันแต่ละทักษะ
        const skillsHtml = item.skills && item.skills.length > 0
            ? item.skills.map((s) => `<span class="skill">${s}</span>`).join(" ")
            : "";

        //แปลงลิงก์ Evidence ให้คลิกเปิดแท็บใหม่ได้
        const evidenceHtml = item.evidence && item.evidence.length > 0
            ? item.evidence
                .map(
                    (link) =>
                        `<div><a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></div>`
                )
                .join("")
            : '<span class="text-muted">-</span>';

        //โครงสร้างการ์ด 1 ใบ
        return `
      <div class="item-card">
        <div class="d-flex justify-content-between align-items-start">
          <span class="type">${item.type}</span>
          <small class="text-muted">${item.date}</small>
        </div>

        <h4>${item.title}</h4>
        <p class="text-muted mb-2"><b>Role:</b> ${item.role}</p>
        <p>${item.description}</p>

        <div class="mb-3">
          ${skillsHtml}
        </div>

        <div class="reflection mb-3">
          <p><b>What I did:</b> ${item.reflection.whatIDid}</p>
          <p><b>What I learned:</b> ${item.reflection.whatILearned}</p>
          <p><b>Challenge:</b> ${item.reflection.challenge}</p>
          <p class="mb-0"><b>Next step:</b> ${item.reflection.nextStep}</p>
        </div>

        <div>
          <small class="text-muted d-block mb-1"><b>Evidence:</b></small>
          ${evidenceHtml}
        </div>
      </div>
    `;
    }).join("");

    container.innerHTML = itemsHtml;
}

//ฟังก์ชันอัปเดตตัวเลือกใน Dropdown
function updatePortfolioSelect() {
    const select = document.getElementById("portfolioSelect");
    if (!select) return;

    if (portfolios.length === 0) {
        select.innerHTML = '<option value="">-- ยังไม่มี Portfolio --</option>';
        return;
    }

    select.innerHTML = portfolios
        .map(
            (p) =>
                `<option value="${p.id}" ${p.id === currentPortfolioId ? "selected" : ""}>
          ${p.displayName}
        </option>`
        )
        .join("");
}

//เมื่อผู้ใช้เลือกเปลี่ยน Portfolio จาก Dropdown
const portfolioSelect = document.getElementById("portfolioSelect");
if (portfolioSelect) {
    portfolioSelect.addEventListener("change", function (e) {
        currentPortfolioId = e.target.value;
        renderPortfolioView();
    });
}





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


//ตรงส่วนข้อมูลผู้ใช้ (Portfolio Form)
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

    const portfolioData = {
        id: "p_" + Date.now(),
        displayName: displayName,
        whatIEnjoy: whatIEnjoy,
        whatIveTried: whatIveTried,
        whatImCuriousAbout: whatImCuriousAbout,
        items: []
    };

    //เพิ่มข้อมูลใหม่ลงใน State
    portfolios.push(portfolioData);
    currentPortfolioId = portfolioData.id;

    //อัปเดต Dropdown และเรนเดอร์ขึ้นหน้าเว็บ
    updatePortfolioSelect();
    renderPortfolioView();

    alert("✓ บันทึก Portfolio สำเร็จ");
});


//ตรงส่วนข้อมูลผลงาน (Item Form)
const itemForm = document.getElementById("itemForm");

itemForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const errors = [];

    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value.trim();
    const date = document.getElementById("date").value.trim();
    const role = document.getElementById("role").value.trim();
    const description = document.getElementById("description").value.trim();
    const skillsRaw = document.getElementById("skills").value.trim();

    const whatIDid = document.getElementById("whatIDid").value.trim();
    const whatILearned = document.getElementById("whatILearned").value.trim();
    const challenge = document.getElementById("challenge").value.trim();
    const nextStep = document.getElementById("nextStep").value.trim();

    const evidenceRaw = document.getElementById("evidence").value.trim();

    //ตรวจสอบฟิลด์พื้นฐาน
    if (!title) errors.push("กรุณากรอก Title (ชื่อผลงาน)");
    if (!type) errors.push("กรุณาเลือก Type (ประเภทของผลงาน)");
    if (!date) {
        errors.push("กรุณาระบุ Date (วันที่)");
    } else if (isNaN(new Date(date).getTime())) {
        errors.push("รูปแบบวันที่ไม่ถูกต้อง");
    }
    if (!role) errors.push("กรุณากรอก Role (บทบาท)");
    if (!description) errors.push("กรุณากรอก Description (รายละเอียด)");
    if (!skillsRaw) errors.push("กรุณาระบุ Skills อย่างน้อย 1 ทักษะ");

    //ตรวจสอบ Reflection ครบทั้ง 4 ส่วน
    if (!whatIDid) errors.push("กรุณากรอก Reflection: What I did");
    if (!whatILearned) errors.push("กรุณากรอก Reflection: What I learned");
    if (!challenge) errors.push("กรุณากรอก Reflection: Challenge");
    if (!nextStep) errors.push("กรุณากรอก Reflection: Next step");

    //ตรวจสอบ Evidence (ตัดตามบรรทัดและตรวจ URL)
    const evidenceList = evidenceRaw
        .split("\n")
        .map((link) => link.trim())
        .filter((link) => link.length > 0);

    if (evidenceList.length === 0) {
        errors.push("กรุณาระบุ Evidence (ลิงก์หลักฐาน) อย่างน้อย 1 รายการ");
    } else {
        const hasInvalidUrl = evidenceList.some((url) => !isValidUrl(url));
        if (hasInvalidUrl) {
            errors.push("Evidence URL ต้องขึ้นต้นด้วย http:// หรือ https://");
        }
    }

    //ถ้ามี Error ให้แจ้งเตือนและหยุดทำงาน
    if (errors.length > 0) {
        displayErrors("itemErrors", errors);
        return;
    }

    //ล้างข้อความ Error เมื่อผู้ใช้กรอกข้อมูลถูกต้อง
    displayErrors("itemErrors", []);

    //ตรวจสอบว่ามี Portfolio ปัจจุบันให้ผูกผลงานเข้าไปหรือไม่
    const current = getCurrentPortfolio();
    if (!current) {
        alert("กรุณาสร้างหรือเลือก Portfolio ก่อนเพิ่มผลงาน");
        return;
    }

    //แปลงข้อความ Skills ที่คั่นด้วยจุลภาคให้กลายเป็น Array
    const skillsArray = skillsRaw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const itemData = {
        id: "item_" + Date.now(),
        title: title,
        type: type,
        date: date,
        role: role,
        description: description,
        skills: skillsArray,
        reflection: {
            whatIDid: whatIDid,
            whatILearned: whatILearned,
            challenge: challenge,
            nextStep: nextStep
        },
        evidence: evidenceList
    };

    //เพิ่มผลงานลงใน Portfolio ที่กำลังเปิดอยู่
    current.items.push(itemData);

    renderPortfolioView();

    alert("✓ เพิ่มชิ้นงานลงใน Portfolio สำเร็จ!");
    itemForm.reset(); //ล้างฟอร์ม
});


renderPortfolioView();