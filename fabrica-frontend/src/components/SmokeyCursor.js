import React, { useEffect, useRef } from 'react';

const SmokeyCursor = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class for smoke effect
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 5;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 100;
      }
      
      // Update particle position and properties
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size = Math.max(0, this.size - 0.1);
        this.life -= 1;
        this.opacity -= 0.003;
      }
      
      // Draw particle on canvas
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Gold colors for smoke
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        gradient.addColorStop(0, `rgba(199, 165, 101, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(217, 184, 124, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity * 0.1})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }
    
    // Array to store particles
    let particles = [];
    
    // Mouse position variables
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    // Track mouse movement across the entire document
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;
      
      // Create particles when mouse moves
      const moveDistance = Math.sqrt(
        Math.pow(mouseX - lastMouseX, 2) + 
        Math.pow(mouseY - lastMouseY, 2)
      );
      
      // Generate more particles for faster movements
      const particlesToCreate = Math.min(Math.floor(moveDistance / 5), 5);
      
      for (let i = 0; i < particlesToCreate; i++) {
        // Randomize position slightly around cursor
        const offsetX = Math.random() * 10 - 5;
        const offsetY = Math.random() * 10 - 5;
        particles.push(new Particle(mouseX + offsetX, mouseY + offsetY));
      }
      
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    // Touch support for mobile devices
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        mouseX = touch.clientX;
        mouseY = touch.clientY;
        isMouseMoving = true;
        
        // Similar logic as mousemove but with fewer particles for performance
        const moveDistance = Math.sqrt(
          Math.pow(mouseX - lastMouseX, 2) + 
          Math.pow(mouseY - lastMouseY, 2)
        );
        
        const particlesToCreate = Math.min(Math.floor(moveDistance / 10), 3);
        
        for (let i = 0; i < particlesToCreate; i++) {
          const offsetX = Math.random() * 10 - 5;
          const offsetY = Math.random() * 10 - 5;
          particles.push(new Particle(mouseX + offsetX, mouseY + offsetY));
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Animation loop
    let animationFrameId;
    
    const animate = () => {
      // Apply semi-transparent fade effect instead of clearing completely
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove particles when they're too small or expired
        if (particles[i].life <= 0 || particles[i].size <= 0.5 || particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      // Automatically add particles at mouse position when not moving
      if (!isMouseMoving && Math.random() < 0.2 && particles.length < 200 && mouseX !== 0) {
        particles.push(new Particle(mouseX, mouseY));
      }
      
      isMouseMoving = false;
      
      // Limit particles for performance
      if (particles.length > 300) {
        particles = particles.slice(particles.length - 300);
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none'
      }}
    />
  );
};

export default SmokeyCursor;