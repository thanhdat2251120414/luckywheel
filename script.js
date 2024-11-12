function randomColor() {
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
  };
}

function toRad(deg) {
  return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
  return ((input - min) * 100) / (max - min) / 100;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = [
  "TÝ",
  "SỬU",
  "DẦN",
  "MẸO",
  "THÌN",
  "TỴ",
  "NGỌ",
  "MÙI",
  "THÂN",
  "DẬU",
  "TUẤT",
  "HỢI",
];
let results = [];
let currentDeg = 0;
let step = 360 / (items.length || 1);
let colors = [];
let itemDegs = {};
let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

function shuffleItems() {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  createWheel();
  showNotification("Items shuffled!");
}

function createWheel() {
  step = 360 / (items.length || 1);
  colors = items.map(() => randomColor());
  draw();
  updateItemList();
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
  ctx.fillStyle = `rgb(33, 33, 33)`;
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  let startDeg = currentDeg;
  items.forEach((item, i) => {
    let endDeg = startDeg + step;
    let color = colors[i];
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
    ctx.fillStyle = `rgb(${color.r - 30}, ${color.g - 30}, ${color.b - 30})`;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(toRad(startDeg + step / 2));
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(item, radius - 30, 0);
    ctx.restore();

    startDeg = endDeg;
  });
}

function spin() {
  if (speed !== 0 || items.length === 0) return;
  currentDeg = 0;
  maxRotation = randomRange(360 * 3, 360 * 6);
  pause = false;
  createWheel();
  window.requestAnimationFrame(animate);
}

function animate() {
  if (pause) return;
  speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
  if (speed < 0.01) {
    speed = 0;
    pause = true;
    handleSpinResult();
  }
  currentDeg += speed;
  draw();
  window.requestAnimationFrame(animate);
}

function handleSpinResult() {
  const winningDeg = (360 - (currentDeg % 360)) % 360;
  let winner = items[0];
  let startDeg = 0;

  for (let i = 0; i < items.length; i++) {
    let endDeg = startDeg + step;
    if (winningDeg >= startDeg && winningDeg < endDeg) {
      winner = items[i];
      break;
    }
    startDeg = endDeg;
  }

  showSpinResult(winner, winningDeg);
}

function showSpinResult(winner, winningDeg) {
  const notification = document.getElementById("notification");

  // Đặt nội dung thông báo và nút đóng
  notification.innerHTML = `
        <span id="closeNotification" class="close-button">&times;</span>
        Congratulations! You won: <strong>${winner}</strong>
      `;

  // Tạo các nút hành động bên dưới
  const confirmationButtons = document.createElement("div");
  confirmationButtons.classList.add("confirmation-buttons");
  confirmationButtons.innerHTML = `
        <button class="delete" onclick="deleteItem('${winner}')">Delete</button>
        <button class="continue" onclick="continueSpinning()">Continue Spinning</button>
      `;

  notification.appendChild(confirmationButtons);
  notification.classList.add("show");

  // Thêm sự kiện cho nút đóng để ẩn thông báo khi nhấn vào
  document
    .getElementById("closeNotification")
    .addEventListener("click", function () {
      notification.classList.remove("show");
    });
}

function continueSpinning() {
  const notification = document.getElementById("notification");
  notification.classList.remove("show");
  spin();
}

function deleteItem(winner) {
  items = items.filter((item) => item !== winner);
  results.push(`Deleted: ${winner}`);
  createWheel();
  showNotification("Item deleted!");
  const notification = document.getElementById("notification");
  notification.classList.remove("show");
}

function sortItems() {
  items.sort();
  createWheel();
  showNotification("Items sorted!");
}

function addNewItem() {
  const input = document.getElementById("newItemInput");
  if (!input.value.trim()) return;
  items.push(input.value.trim());
  input.value = "";
  createWheel();
  showNotification("Item added!");
}

function clearAllItems() {
  items = [];
  createWheel();
  showNotification("All items cleared!");
}

function updateItemList() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = items
    .map(
      (item, index) =>
        `<span>${item}</span> <button onclick="deleteItem('${item}')">Delete</button>`
    )
    .join("<br>");
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function hideNotification() {
  const notification = document.getElementById("notification");
  notification.classList.remove("show");
}

document.getElementById("newItemInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNewItem();
  }
});

document
  .getElementById("hideNotificationIcon")
  .addEventListener("click", hideNotification);

createWheel();
