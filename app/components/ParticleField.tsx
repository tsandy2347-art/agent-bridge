"use client";

import { useEffect, useRef } from "react";

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: P[] = [];
    let mouseX = -9999;
    let mouseY = -9999;

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.scale(DPR, DPR);

      const targetCount = Math.min(
        140,
        Math.floor((width * height) / 14000),
      );
      particles = [];
      for (let i = 0; i < targetCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.4,
        });
      }
    }

    function onMouse(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Drift particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // Connecting lines
      const linkDist = 130;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = 1 - Math.sqrt(d2) / linkDist;
            ctx.strokeStyle = `rgba(55, 138, 221, ${alpha * 0.18})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Mouse-attracted glow
      for (const p of particles) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const d2 = dx * dx + dy * dy;
        const radius = 180;
        let glow = 0;
        if (d2 < radius * radius) {
          glow = 1 - Math.sqrt(d2) / radius;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(181, 212, 244, ${0.35 + glow * 0.55})`;
        ctx.arc(p.x, p.y, p.r + glow * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}
