let names = [];

function firstpage(){
  document.getElementById("condainer").style.display = "none";
  document.getElementById("spinningpage").style.display = "block";
  drawWheel();
}

function goBack() {
  document.getElementById("spinningpage").style.display = "none";
  document.getElementById("condainer").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("spinBtn").disabled = false;
  document.getElementById("spinBtn").textContent = 'Spin!';
  const canvas = document.getElementById('wheel');
  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  setTimeout(() => {
    canvas.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }, 50);
}

function addItem() {
  const input = document.getElementById("userInput");
  const value = input.value.trim();

  if (value !== "") {
    names.push(value);
    showList();
    input.value = "";
    console.log(names);
  }
  input.focus();
}

function showList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  names.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = item;

    let iconEdit = document.createElement("i");
    iconEdit.className = "bi bi-pencil";
    iconEdit.style.marginRight = "2px";
    iconEdit.style.fontSize = "20px";
    iconEdit.onclick = function(e) {
      e.stopPropagation();
      const newName = prompt("Edit name:", item);
      if (newName !== null && newName.trim() !== "") {
        names[index] = newName.trim();
        showList();
        drawWheel();
      }
    };

    let iconDelete = document.createElement("i");
    iconDelete.className = "bi bi-x";
    iconDelete.onclick = function(e) {
      e.stopPropagation();
      names.splice(index, 1);
      showList();
      drawWheel();
    };

    li.appendChild(iconEdit);
    li.appendChild(iconDelete);
    list.appendChild(li);
  });
}

function drawWheel() {
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 15;
  const numSegments = names.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (numSegments === 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Add names first!', centerX, centerY);
    return;
  }

  canvas.style.transform = 'rotate(0deg)';

  for (let i = 0; i < numSegments; i++) {
    const angle = (2 * Math.PI) / numSegments;
    const startAngle = (i * angle) - Math.PI / 2;
    const endAngle = ((i + 1) * angle) - Math.PI / 2;

    ctx.fillStyle = i % 2 === 0 ? '#4CAF50' : '#2196F3';

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + angle / 2);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;
    
    let fontSize = 18;
    ctx.font = `bold ${fontSize}px Arial`;
    let text = names[i];
    const maxWidth = radius / 2;
    
    while (ctx.measureText(text).width > maxWidth && fontSize > 8) {
      fontSize -= 1;
      ctx.font = `bold ${fontSize}px Arial`;
    }
    
    ctx.fillText(text, radius / 3, 0);
    ctx.restore();
  }

  // Center circle
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Spin!', centerX, centerY);
}

let isSpinning = false;

function spinWheel() {
  if (names.length === 0 || isSpinning) return;

  isSpinning = true;
  const spinBtn = document.getElementById('spinBtn');
  spinBtn.disabled = true;
  spinBtn.textContent = 'Spinning...';

  const canvas = document.getElementById('wheel');
  const numSegments = names.length;
  const anglePerSegment = 360 / numSegments;
  const spins = 5 + Math.random() * 3;
  const extraRotation = Math.random() * 360;
  const randomRotation = (spins * 360) + extraRotation;
  const finalAngle = randomRotation % 360;
  let normalizedAngle = (360 - finalAngle) % 360;
  const selectedIndex = Math.floor(normalizedAngle / anglePerSegment) % numSegments;

  canvas.style.transition = 'none';
  canvas.style.transform = 'rotate(0deg)';
  setTimeout(() => {
    canvas.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    canvas.style.transform = `rotate(${randomRotation}deg)`;
  }, 50);

  setTimeout(() => {
    const result = document.getElementById('result');
    result.textContent = `Winner: ${names[selectedIndex]}! 🎉`;
    result.style.display = 'block';

    setTimeout(() => {
      canvas.style.transition = 'none';
      canvas.style.transform = 'rotate(0deg)';
      setTimeout(() => {
        canvas.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      }, 50);
    }, 2000);

    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = 'Spin Again!';
  }, 4000);
}

document.getElementById("userInput").addEventListener("keypress", function(e) {
  if (e.key == "Enter") {
    addItem();
  }
});

window.onload = () => {
  document.getElementById("userInput").focus();
  drawWheel();
};

function resetbtn(){
  names.splice(0, names.length);
  showList();
  drawWheel();
}