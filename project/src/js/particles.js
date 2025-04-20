// Particles animation
class Particle {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.x = options.x || Math.random() * canvas.width;
    this.y = options.y || Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = options.color || this.getRandomEmberColor();
    this.opacity = Math.random() * 0.5 + 0.3;
    this.shape = this.getRandomShape();
  }

  getRandomEmberColor() {
    const colors = [
      'rgba(139, 0, 0, 0.7)',    // Dark Red
      'rgba(205, 92, 92, 0.7)',  // Indian Red
      'rgba(255, 69, 0, 0.7)',   // Orange Red
      'rgba(255, 107, 107, 0.7)', // Light Coral
      'rgba(44, 44, 44, 0.7)',    // Dark Ash
      'rgba(74, 74, 74, 0.7)',    // Medium Ash
      'rgba(128, 128, 128, 0.7)'  // Light Ash
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomShape() {
    const shapes = ['ember', 'spark', 'ash'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Boundary bounce
    if (this.x < 0 || this.x > this.canvas.width) {
      this.speedX = -this.speedX;
    }
    
    if (this.y < 0 || this.y > this.canvas.height) {
      this.speedY = -this.speedY;
    }
  }

  draw(ctx) {
    ctx.globalAlpha = this.opacity;
    
    if (this.shape === 'ember') {
      this.drawEmber(ctx);
    } else if (this.shape === 'spark') {
      this.drawSpark(ctx);
    } else if (this.shape === 'ash') {
      this.drawAsh(ctx);
    }
    
    ctx.globalAlpha = 1;
  }

  drawEmber(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 4);
    
    // Draw ember shape
    ctx.moveTo(0, -this.size * 2);
    ctx.bezierCurveTo(
      this.size, -this.size, 
      this.size, this.size, 
      0, this.size * 2
    );
    ctx.bezierCurveTo(
      -this.size, this.size, 
      -this.size, -this.size, 
      0, -this.size * 2
    );
    
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  drawSpark(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.random() * Math.PI * 2);
    
    // Draw spark shape
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  drawAsh(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.random() * Math.PI * 2);
    
    // Draw ash shape
    ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const particlesContainer = document.getElementById('particles');
  const canvas = document.createElement('canvas');
  particlesContainer.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 50;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();

  // Add particles on click
  canvas.addEventListener('click', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(canvas, {
        x: mouseX,
        y: mouseY
      }));
    }
    
    // Keep particle count reasonable by removing old ones
    if (particles.length > 100) {
      particles = particles.slice(-100);
    }
  });
});