let portfolios = [];
let currentPortfolioId = null;

//ฟังก์ชันดึงข้อมูล Portfolio ปัจจุบันที่กำลังเลือกอยู่
function getCurrentPortfolio() {
    return portfolios.find((p) => p.id === currentPortfolioId) || null;
}

const CURRENT_KEY = "powerup_currentPortfolioId";
// ---------------------------------------------
// Challenge ของกลุ่มเรา (ชื่อ field ตาม Common Challenge Contract)
// ---------------------------------------------
const ourChallenges = [
    {
        schemaVersion: "1.0",
        id: "G12-C01",
        creatorGroup: "G12",
        title: "One-Minute Website Review",
        description: "ลองใช้ Web App Power Up! ของกลุ่ม 12 แล้วให้คำแนะนำ 1 จุดที่ทำให้เว็บดีขึ้น",
        category: "discover",
        instructions: [
            "สร้าง Portfolio ทดลองในเว็บของเรา",
            "เพิ่ม Portfolio Item 1 รายการ",
            "บอกจุดที่ใช้งานยากที่สุด 1 จุด และวิธีแก้ที่คิดว่าดี"
        ],
        estimatedMinutes: 5,
        evidencePrompt: "แนบลิงก์รูปหน้าจอที่ทดลอง และเล่าว่าจุดไหนที่ใช้งานยากที่สุด",
        tags: ["UX", "Feedback", "Web Testing"]
    },
    {
        schemaVersion: "1.0",
        id: "G12-C02",
        creatorGroup: "G12",
        title: "Mini CSS Makeover",
        description: "เปลี่ยนหน้าตาการ์ดผลงานด้วย CSS 3 บรรทัดใน CodePen ภายใน 10 นาที",
        category: "levelup",
        instructions: [
            "เปิด codepen.io แล้ววางโค้ดการ์ดตัวอย่างที่บูธ",
            "แก้ CSS ไม่เกิน 3 บรรทัด ให้การ์ดดูดีขึ้น",
            "กด Save แล้วคัดลอกลิงก์ CodePen"
        ],
        estimatedMinutes: 10,
        evidencePrompt: "แนบลิงก์ CodePen ที่ Save แล้ว และเล่าว่าแก้ CSS อะไรไปบ้าง",
        tags: ["CSS", "Design"]
    }
];

// =============================================
// 2. คุยกับ Server: fetch() + FormData
// =============================================

// ส่ง FormData ไปที่ PHP แบบ POST แล้วอ่านคำตอบ JSON กลับมา
async function sendToServer(url, formData) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        return { ok: response.ok, data: data };
    } catch (error) {
        return { ok: false, data: { errors: ["เชื่อมต่อ Server ไม่ได้ — ตรวจว่าเปิดผ่าน php -S หรือ Apache"] } };
    }
}

// โหลดข้อมูลทั้งหมดจาก Server (GET) แล้วแสดงผล
async function loadPortfolios() {
    try {
        const response = await fetch("api/portfolios.php");
        portfolios = await response.json();
    } catch (error) {
        alert("โหลดข้อมูลจาก Server ไม่ได้ — ตรวจว่าเปิดผ่าน php -S หรือ Apache");
        portfolios = [];
    }

    // ถ้า Portfolio ที่เลือกไว้ไม่มีแล้ว ให้ใช้อันแรก
    const savedId = localStorage.getItem(CURRENT_KEY);
    if (getCurrentPortfolio() === null) currentPortfolioId = savedId;
    if (getCurrentPortfolio() === null) {
        if (portfolios.length > 0) {
            currentPortfolioId = portfolios[0].id;
        } else {
            currentPortfolioId = null;
        }
    }
    localStorage.setItem(CURRENT_KEY, currentPortfolioId || "");

    showSelect();
    showPortfolio();
    showFestivalInfo();
}
// =============================================
// 3. แสดงผล Portfolio
// =============================================

// Dropdown เลือก Portfolio
function showSelect() {
    const select = document.getElementById("portfolioSelect");
    select.textContent = "";

    if (portfolios.length === 0) {
        select.appendChild(makeElement("option", "-- ยังไม่มี Portfolio --"));
        return;
    }
    for (let i = 0; i < portfolios.length; i++) {
        const option = makeElement("option", portfolios[i].displayName);
        option.value = portfolios[i].id;
        if (portfolios[i].id === currentPortfolioId) option.selected = true;
        select.appendChild(option);
    }
}

// เปลี่ยน Portfolio จาก Dropdown
document.getElementById("portfolioSelect").addEventListener("change", function (event) {
    currentPortfolioId = event.target.value;
    localStorage.setItem(CURRENT_KEY, currentPortfolioId);
    showPortfolio();
    showFestivalInfo();
});

// กล่องเล็ก ๆ "What I Enjoy" ฯลฯ
function makeAbout(title, text) {
    const column = makeElement("div", "", "col-md-4");
    const about = makeElement("div", "", "about");
    about.appendChild(makeElement("b", title));
    about.appendChild(makeElement("p", text));
    column.appendChild(about);
    return column;
}

// ภาพรวม Portfolio ที่เลือก ลงใน #portfolioView
function showPortfolio() {
    const view = document.getElementById("portfolioView");
    view.textContent = "";

    const current = getCurrentPortfolio();

    // ยังไม่มี Portfolio
    if (current === null) {
        const empty = makeElement("div", "", "box empty text-center");
        empty.appendChild(makeElement("div", "📂", "big-emoji"));
        empty.appendChild(makeElement("h3", "ยังไม่มีข้อมูล Portfolio", "mt-3"));
        empty.appendChild(makeElement("p", "กรุณาสร้าง Portfolio ใหม่เพื่อเริ่มต้นใช้งาน", "text-muted"));
        view.appendChild(empty);
        return;
    }

    // ส่วนหัว: Avatar + ชื่อ + About 3 ช่อง
    const profile = makeElement("div", "", "box profile");
    profile.appendChild(makeElement("div", current.displayName.charAt(0).toUpperCase(), "avatar"));
    profile.appendChild(makeElement("h2", current.displayName));
    const row = makeElement("div", "", "row g-2 mt-3 text-start");
    row.appendChild(makeAbout("What I Enjoy", current.whatIEnjoy));
    row.appendChild(makeAbout("What I've Tried", current.whatIveTried));
    row.appendChild(makeAbout("What I'm Curious About", current.whatImCuriousAbout));
    profile.appendChild(row);
    view.appendChild(profile);

    // หัวข้อรายการผลงาน
    const title = makeElement("div", "", "items-title");
    title.appendChild(makeElement("span", "รายการผลงาน (" + current.items.length + ")"));
    view.appendChild(title);

    // การ์ดผลงาน
    if (current.items.length === 0) {
        const none = makeElement("div", "", "box text-center py-4 text-muted");
        none.appendChild(makeElement("p", "ยังไม่มีชิ้นงานใน Portfolio นี้ เพิ่มผลงานได้จากฟอร์มข้อ 3 หรือ Import จากข้อ 4", "mb-0"));
        view.appendChild(none);
    }
    for (let i = 0; i < current.items.length; i++) {
        view.appendChild(makeItemCard(current.items[i]));
    }
}

// การ์ดผลงาน 1 ใบ
function makeItemCard(item) {
    const card = makeElement("div", "", "item-card");

    const top = makeElement("div", "", "d-flex justify-content-between align-items-start");
    top.appendChild(makeElement("span", item.type, "type"));
    top.appendChild(makeElement("small", item.date, "text-muted"));
    card.appendChild(top);

    card.appendChild(makeElement("h4", item.title));

    const role = makeElement("p", "", "text-muted mb-2");
    role.appendChild(makeElement("b", "Role: "));
    role.appendChild(document.createTextNode(item.role));
    card.appendChild(role);

    card.appendChild(makeElement("p", item.description));

    // Skills
    const skills = makeElement("div", "", "mb-3");
    for (let i = 0; i < item.skills.length; i++) {
        skills.appendChild(makeElement("span", item.skills[i], "skill"));
        skills.appendChild(document.createTextNode(" "));
    }
    card.appendChild(skills);

    // Reflection 4 ช่อง
    const reflection = makeElement("div", "", "reflection mb-3");
    reflection.appendChild(makeReflectionLine("What I did: ", item.reflection.whatIDid));
    reflection.appendChild(makeReflectionLine("What I learned: ", item.reflection.whatILearned));
    reflection.appendChild(makeReflectionLine("Challenge: ", item.reflection.challenge));
    reflection.appendChild(makeReflectionLine("Next step: ", item.reflection.nextStep));
    card.appendChild(reflection);

    // Evidence (ลิงก์เปิดแท็บใหม่)
    const evidence = makeElement("div", "");
    const label = makeElement("small", "", "text-muted d-block mb-1");
    label.appendChild(makeElement("b", "Evidence:"));
    evidence.appendChild(label);
    for (let i = 0; i < item.evidence.length; i++) {
        const line = makeElement("div", "");
        const link = makeElement("a", item.evidence[i]);
        link.href = item.evidence[i];
        link.target = "_blank";
        line.appendChild(link);
        evidence.appendChild(line);
    }
    card.appendChild(evidence);

    return card;
}

// บรรทัดใน Reflection เช่น "What I did: ..."
function makeReflectionLine(label, text) {
    const line = makeElement("p", "");
    line.appendChild(makeElement("b", label));
    line.appendChild(document.createTextNode(text));
    return line;
}
// =============================================
// 5. ฟอร์ม Portfolio Item → ส่งไป Server
// =============================================
const itemForm = document.getElementById("itemForm");

// อ่านค่าจากฟอร์ม → Object ตามโครงสร้าง Portfolio Item เดิม
function readItemForm() {
    return {
        title: document.getElementById("title").value.trim(),
        type: document.getElementById("type").value.trim(),
        date: document.getElementById("date").value.trim(),
        role: document.getElementById("role").value.trim(),
        description: document.getElementById("description").value.trim(),
        skills: splitText(document.getElementById("skills").value, ","),
        reflection: {
            whatIDid: document.getElementById("whatIDid").value.trim(),
            whatILearned: document.getElementById("whatILearned").value.trim(),
            challenge: document.getElementById("challenge").value.trim(),
            nextStep: document.getElementById("nextStep").value.trim()
        },
        evidence: splitText(document.getElementById("evidence").value, "\n")
    };
}

// ตรวจ Item (ใช้ร่วมกัน: ฟอร์ม / สร้าง JSON ให้เพื่อน / Import) → คืน array ข้อความ Error
function checkItem(item) {
    const errors = [];

    if (typeof item !== "object" || item === null || Array.isArray(item)) {
        errors.push("ข้อมูลต้องเป็น Portfolio Item 1 รายการ (JSON object)");
        return errors;
    }
    // ช่องไหนหายไป ให้ถือว่าว่าง
    if (!item.skills) item.skills = [];
    if (!item.evidence) item.evidence = [];
    if (!item.reflection) item.reflection = {};

    if (!item.title) errors.push("กรุณากรอก Title (ชื่อผลงาน)");
    if (!item.type) errors.push("กรุณาเลือก Type (ประเภทของผลงาน)");
    if (!item.date) {
        errors.push("กรุณาระบุ Date (วันที่)");
    } else if (isNaN(new Date(item.date).getTime())) {
        errors.push("รูปแบบวันที่ไม่ถูกต้อง ต้องเป็น YYYY-MM-DD");
    }
    if (!item.role) errors.push("กรุณากรอก Role (บทบาท)");
    if (!item.description) errors.push("กรุณากรอก Description (รายละเอียด)");
    if (item.skills.length === 0) errors.push("กรุณาระบุ Skills อย่างน้อย 1 ทักษะ");

    if (!item.reflection.whatIDid) errors.push("กรุณากรอก Reflection: What I did");
    if (!item.reflection.whatILearned) errors.push("กรุณากรอก Reflection: What I learned");
    if (!item.reflection.challenge) errors.push("กรุณากรอก Reflection: Challenge");
    if (!item.reflection.nextStep) errors.push("กรุณากรอก Reflection: Next step");

    if (item.evidence.length === 0) {
        errors.push("กรุณาระบุ Evidence (ลิงก์หลักฐาน) อย่างน้อย 1 รายการ");
    }
    for (let i = 0; i < item.evidence.length; i++) {
        const link = String(item.evidence[i]);
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            errors.push("Evidence URL ต้องขึ้นต้นด้วย http:// หรือ https://");
            break;
        }
    }
    return errors;
}

// ส่ง Item 1 ชิ้นไปบันทึกที่ Server (PHP ตรวจซ้ำอีกรอบ)
async function sendItem(item, portfolioId) {
    const formData = new FormData();
    formData.append("portfolioId", portfolioId);
    formData.append("title", item.title);
    formData.append("type", item.type);
    formData.append("date", item.date);
    formData.append("role", item.role);
    formData.append("description", item.description);
    formData.append("skills", item.skills.join(", "));
    formData.append("whatIDid", item.reflection.whatIDid);
    formData.append("whatILearned", item.reflection.whatILearned);
    formData.append("challenge", item.reflection.challenge);
    formData.append("nextStep", item.reflection.nextStep);
    formData.append("evidence", item.evidence.join("\n"));
    return await sendToServer("api/items.php", formData);
}

itemForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const current = getCurrentPortfolio();
    if (current === null) {
        alert("กรุณาสร้างหรือเลือก Portfolio ก่อนเพิ่มผลงาน");
        return;
    }

    const item = readItemForm();
    const errors = checkItem(item);
    if (errors.length > 0) {
        showErrors("itemErrors", errors);
        return;
    }
    showErrors("itemErrors", []);

    const result = await sendItem(item, current.id);
    if (!result.ok) {
        showErrors("itemErrors", result.data.errors);
        return;
    }

    await loadPortfolios();
    itemForm.reset();
    alert("✓ เพิ่มชิ้นงานลงใน Portfolio สำเร็จ!");
});
// =============================================
// 1. ฟังก์ชันช่วยเล็ก ๆ
// =============================================

// สร้าง element พร้อมข้อความ (ใช้ textContent เสมอ จึงปลอดภัย ไม่ถูกแปลงเป็น HTML)
function makeElement(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== "") element.textContent = text;
    if (className) element.className = className;
    return element;
}

// "HTML, CSS" → ["HTML", "CSS"]  (ตัดช่องว่าง และทิ้งค่าว่าง)
function splitText(text, separator) {
    const list = [];
    const parts = text.split(separator);
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (part !== "") {
            list.push(part);
        }
    }
    return list;
}

// แสดงข้อความ Error ในกล่องสีแดง (ส่ง [] มาเพื่อซ่อนกล่อง)
function showErrors(boxId, messages) {
    const box = document.getElementById(boxId);
    box.textContent = "";
    if (messages.length === 0) {
        box.classList.add("d-none");
        return;
    }
    const list = makeElement("ul", "", "mb-0 ps-3");
    for (let i = 0; i < messages.length; i++) {
        list.appendChild(makeElement("li", messages[i]));
    }
    box.appendChild(list);
    box.classList.remove("d-none");
}

// วันนี้ในรูปแบบ YYYY-MM-DD
function today() {
    return new Date().toLocaleDateString("en-CA");
}
// =============================================
// 4. ฟอร์ม Portfolio (สร้างใหม่) → ส่งไป Server
// =============================================
const portfolioForm = document.getElementById("portfolioForm");

portfolioForm.addEventListener("submit", async function (event) {
    event.preventDefault();     // ไม่ให้หน้ารีโหลด

    const errors = [];
    const displayName = document.getElementById("displayName").value.trim();
    const whatIEnjoy = document.getElementById("whatIEnjoy").value.trim();
    const whatIveTried = document.getElementById("whatIveTried").value.trim();
    const whatImCuriousAbout = document.getElementById("whatImCuriousAbout").value.trim();

    if (displayName === "") errors.push("กรุณากรอกชื่อที่ต้องการแสดง (Display Name)");
    if (whatIEnjoy === "") errors.push("กรุณากรอก What I Enjoy (ชอบทำอะไร)");
    if (whatIveTried === "") errors.push("กรุณากรอก What I've Tried (ลองทำอะไรมาแล้ว)");
    if (whatImCuriousAbout === "") errors.push("กรุณากรอก What I'm Curious About (อยากรู้อะไรเพิ่ม)");

    if (errors.length > 0) {
        showErrors("portfolioErrors", errors);
        return;
    }
    showErrors("portfolioErrors", []);

    // FormData เก็บทุกช่องที่มี name  แล้วส่งไป PHP
    const formData = new FormData(portfolioForm);
    const result = await sendToServer("api/portfolios.php", formData);
    if (!result.ok) {
        showErrors("portfolioErrors", result.data.errors);
        return;
    }

    currentPortfolioId = result.data.id;    // เลือก Portfolio ที่เพิ่งสร้าง
    await loadPortfolios();                 // โหลดข้อมูลจริงจาก Server มาแสดง
    portfolioForm.reset();
    alert("✓ บันทึก Portfolio สำเร็จ");
});

// ปุ่ม + Add: พาไปกรอกฟอร์ม Portfolio
document.getElementById("btnNew").addEventListener("click", function () {
    portfolioForm.reset();
    showErrors("portfolioErrors", []);
    portfolioForm.scrollIntoView({ behavior: "smooth" });
    document.getElementById("displayName").focus();
});

// ปุ่มถังขยะ: ลบ Portfolio ที่เลือกอยู่
document.getElementById("btnDelete").addEventListener("click", async function () {
    const current = getCurrentPortfolio();
    if (current === null) return;
    if (!confirm('ลบ Portfolio "' + current.displayName + '" ใช่ไหม?')) return;

    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", current.id);
    const result = await sendToServer("api/portfolios.php", formData);
    if (!result.ok) {
        alert(result.data.errors.join("\n"));
        return;
    }
    currentPortfolioId = null;
    await loadPortfolios();
});
// =============================================
// 6. Challenge Festival — Host (เจ้าของบูธ)
// =============================================

// แสดง Challenge ของกลุ่มเรา: ชื่อ, คำอธิบาย, ขั้นตอน, คำแนะนำหลักฐาน
function showChallenges() {
    const list = document.getElementById("challengeList");
    if (list === null) return;
    list.textContent = "";

    for (let i = 0; i < ourChallenges.length; i++) {
        const challenge = ourChallenges[i];
        const card = makeElement("div", "", "challenge-card");

        card.appendChild(makeElement("span", "⏱ " + challenge.estimatedMinutes + " นาที", "minutes"));
        card.appendChild(makeElement("h4", challenge.title));
        card.appendChild(makeElement("p", challenge.description, "small mb-2"));

        const steps = makeElement("ol", "");
        for (let j = 0; j < challenge.instructions.length; j++) {
            steps.appendChild(makeElement("li", challenge.instructions[j]));
        }
        card.appendChild(steps);

        const hint = makeElement("p", "", "small text-muted mb-2");
        hint.appendChild(makeElement("b", "Evidence: "));
        hint.appendChild(document.createTextNode(challenge.evidencePrompt));
        card.appendChild(hint);

        const button = makeElement("button", "✔ เพื่อนทำสำเร็จ → กรอกฟอร์ม Item", "btn btn-sm btn-primary");
        button.type = "button";
        button.addEventListener("click", function () {
            useChallenge(challenge);
        });
        card.appendChild(button);

        list.appendChild(card);
    }
}

// กรอกฟอร์มข้อ 3 ให้บางส่วน แล้วให้เพื่อนกรอก Reflection + Evidence ของตัวเอง
function useChallenge(challenge) {
    itemForm.reset();
    showErrors("itemErrors", []);
    document.getElementById("title").value = "Challenge: " + challenge.title + " (Group 12)";
    document.getElementById("type").value = "Challenge";
    document.getElementById("date").value = today();
    document.getElementById("role").value = "Challenger";
    document.getElementById("description").value = challenge.description;
    document.getElementById("skills").value = challenge.tags.join(", ");
    itemForm.scrollIntoView({ behavior: "smooth" });
    document.getElementById("whatIDid").focus();
}

// ปุ่ม "สร้าง JSON ให้เพื่อน": ตรวจข้อมูลเหมือนบันทึก แต่ไม่บันทึกลง Portfolio ของเรา
document.getElementById("btnMakeJson").addEventListener("click", function () {
    const item = readItemForm();
    const errors = checkItem(item);
    if (errors.length > 0) {
        showErrors("itemErrors", errors);
        return;
    }
    showErrors("itemErrors", []);

    // โครงสร้าง Portfolio Item เดิมจาก Checkpoint
    const itemJson = {
        id: "item" + Date.now(),
        title: item.title,
        type: item.type,
        date: item.date,
        role: item.role,
        description: item.description,
        skills: item.skills,
        reflection: item.reflection,
        evidence: item.evidence
    };

     let hostJson = document.getElementById("hostJson");
    if (hostJson === null) {
        hostJson = document.createElement("textarea");
        hostJson.id = "hostJson";
        hostJson.className = "form-control json-box mt-2";
        hostJson.rows = 9;
        hostJson.readOnly = true;
        itemForm.appendChild(hostJson);
    }

    itemForm.reset();       // ล้างฟอร์มก่อน (ถ้าใส่ JSON ก่อน reset กล่องนี้จะถูกล้างไปด้วย เพราะอยู่ในฟอร์ม)
    hostJson.value = JSON.stringify(itemJson, null, 2);
    hostJson.scrollIntoView({ behavior: "smooth" });
    hostJson.select();      // เลือกข้อความไว้ให้แล้ว กด Ctrl+C เพื่อคัดลอก
});



// =============================================
// 7. Challenge Festival — Tester (Import ด้วย Copy/Paste)
// =============================================
document.getElementById("btnImport").addEventListener("click", async function () {
    const current = getCurrentPortfolio();
    if (current === null) {
        showErrors("importErrors", ["กรุณาสร้างหรือเลือก Portfolio ของตัวเองก่อน Import"]);
        return;
    }

    const text = document.getElementById("importJson").value.trim();
    if (text === "") {
        showErrors("importErrors", ["กรุณาวาง JSON ก่อนกด Import"]);
        return;
    }

    // 1) แปลงข้อความเป็น JSON
    let data;
    try {
        data = JSON.parse(text);
    } catch (error) {
        showErrors("importErrors", ["ข้อความนี้ไม่ใช่ JSON ที่ถูกต้อง — ตรวจว่าคัดลอกมาครบตั้งแต่ { ถึง }"]);
        return;
    }

    // 2) รับได้ทั้ง Item เดียว หรือ array ของ Item
    let items = [];
    if (Array.isArray(data)) {
        items = data;
    } else {
        items.push(data);
    }

    // 3) ตรวจทุกรายการก่อน ถ้ามีรายการไหนผิด จะไม่บันทึกเลย
    const errors = [];
    for (let i = 0; i < items.length; i++) {
        const itemErrors = checkItem(items[i]);
        for (let j = 0; j < itemErrors.length; j++) {
            errors.push("รายการที่ " + (i + 1) + ": " + itemErrors[j]);
        }
    }
    if (errors.length > 0) {
        showErrors("importErrors", errors);
        return;
    }

    // 4) ส่งไปบันทึกที่ Server ทีละรายการ
    for (let i = 0; i < items.length; i++) {
        const result = await sendItem(items[i], current.id);
        if (!result.ok) {
            showErrors("importErrors", result.data.errors);
            await loadPortfolios();
            return;
        }
    }

    showErrors("importErrors", []);
    document.getElementById("importJson").value = "";
    await loadPortfolios();
    alert("✓ Import " + items.length + " รายการ เข้า Portfolio ของ " + current.displayName + " แล้ว");
});


// =============================================
// 8. Export my-portfolio.json
// =============================================

// อัปเดตชื่อ Portfolio ปลายทาง, สถานะ Challenge และลิงก์ดาวน์โหลด
function showFestivalInfo() {
    const current = getCurrentPortfolio();
    const status = document.getElementById("exportStatus");
    status.textContent = "";

    if (current === null) {
        document.getElementById("importTarget").textContent = "- (ยังไม่ได้เลือก)";
        status.appendChild(makeElement("span", "ยังไม่ได้เลือก Portfolio", "text-muted"));
        document.getElementById("downloadLink").href = "#";
        document.getElementById("exportJson").value = "";
        return;
    }

    document.getElementById("importTarget").textContent = current.displayName;

    // นับ Item ประเภท Challenge
    let count = 0;
    for (let i = 0; i < current.items.length; i++) {
        if (current.items[i].type === "Challenge") count++;
    }
    if (count > 0) {
        status.appendChild(makeElement("span", "✓ " + current.displayName + " มี Item ประเภท Challenge " + count + " รายการ — พร้อมส่ง", "text-success"));
    } else {
        status.appendChild(makeElement("span", "⚠ " + current.displayName + " ยังไม่มี Item ประเภท Challenge — ถ้าบูธเพื่อนใช้ Type อื่น ให้ตรวจเองว่ามี Item จาก Challenge ของเพื่อนอย่างน้อย 1 รายการ", "text-danger"));
    }

    // ลิงก์ดาวน์โหลด: PHP (api/export.php) ส่งไฟล์ my-portfolio.json กลับมา
    document.getElementById("downloadLink").href = "api/export.php?id=" + current.id;
    document.getElementById("exportJson").value = JSON.stringify(current, null, 2);
}

// ปุ่มแสดง/ซ่อน JSON
document.getElementById("btnShowExport").addEventListener("click", function () {
    document.getElementById("exportJson").classList.toggle("d-none");
});
// =============================================
// 9. เริ่มต้นเมื่อเปิดหน้าเว็บ
// =============================================
showChallenges();
loadPortfolios();