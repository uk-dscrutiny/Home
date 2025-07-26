// --- Particles.js Initialization for the banner ---
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#8892b0" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#8892b0",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: false },
      resize: true,
    },
    modes: { grab: { distance: 140, line_linked: { opacity: 1 } } },
  },
  retina_detect: true,
});

// --- REAL Form Submission Logic ---
const form = document.getElementById("contact-form");
const submitBtn = form.querySelector(".submit-btn");

// !!! IMPORTANT: Paste the Web App URL you copied in Part 1 here !!!
const googleScriptURL = "https://script.google.com/macros/s/AKfycbxB-2QYHGg-w19jmjYnShdk6BiaIIaQG0p_4M-m53su2NSMlDjNDnnSkYo6VaTXMONp/exec";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitBtn.innerText = "Transmitting...";
  submitBtn.disabled = true;

  const userEmail = document.getElementById("email").value;

  fetch(googleScriptURL, {
    method: "POST",
    mode: "no-cors", // Important for sending data to Apps Script from a different origin
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    // The body needs to be a stringified version of the data
    body: JSON.stringify({ email: userEmail }),
  })
    .then(() => {
      // Because of no-cors, we can't read the response. We assume success if the request doesn't fail.
      submitBtn.innerText = "Signal Received ✓";
    })
    .catch((error) => {
      console.error("Error:", error);
      submitBtn.innerText = "Error! Try Again.";
    })
    .finally(() => {
      setTimeout(() => {
        form.reset();
        // Ensure the label goes back down
        document.getElementById("email").blur();
        submitBtn.disabled = false;
        submitBtn.innerText = "Request Notification";
      }, 3000);
    });
});

// --- The Synaptic Web Canvas Animation ---
const canvas = document.getElementById("synaptic-web");
// ... (The rest of the canvas animation code remains exactly the same as the previous version) ...
const ctx = canvas.getContext("2d");
let width,
  height,
  particles,
  rotation = 0;
let mouseX = 0;
function setup() {
  if (!canvas) return;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  particles = [];
  const particleCount = 200;
  const sliceAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < particleCount; i++) {
    const z = (i / (particleCount - 1)) * 2 - 1;
    const radius = Math.sqrt(1 - z * z);
    const angle = sliceAngle * i;
    particles.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z: z,
    });
  }
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  });
}
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  rotation += 0.002 + mouseX * 0.005;
  const focalLength = 2.5;
  particles.forEach((p) => {
    const r_x = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
    const r_z = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
    const scale = focalLength / (focalLength + r_z);
    p.projected = {
      x: r_x * scale * (width / 4),
      y: p.y * scale * (width / 4),
      scale: scale,
    };
  });
  ctx.strokeStyle = "rgba(100, 255, 218, 0.2)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dz = p1.z - p2.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.projected.x, p1.projected.y);
        ctx.lineTo(p2.projected.x, p2.projected.y);
        ctx.stroke();
      }
    }
  }
  particles.forEach((p) => {
    ctx.beginPath();
    const radius = p.projected.scale * 2;
    if (radius > 0) {
      ctx.arc(p.projected.x, p.projected.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${p.projected.scale * 0.8})`;
      ctx.fill();
    }
  });
  ctx.restore();
  requestAnimationFrame(draw);
}
setup();
if (canvas) {
  draw();
}
window.addEventListener("resize", setup);
// --- End of Synaptic Web Canvas Animation ---
// --- End of Particles.js Initialization ---
