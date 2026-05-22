"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic atmosphere — Canvas 2D backdrop for the EBOO machine hero.
 *
 * The machine (HTML img) sits at the viewport center. This canvas draws
 * around and behind it: ambient bloom, orbital rings that wrap around the
 * machine, the rouge stream flowing in from the left toward the machine's
 * bottom-left input tube, and the gold stream emerging from the right
 * tubing out to the upper-right.
 *
 * Layers:
 *   1. Deep navy base gradient
 *   2. Slow-drifting ambient blooms (volumetric fog)
 *   3. Cool/warm color grading washes
 *   4. Orbital rings centered on the machine
 *   5. Halo glow behind the machine
 *   6. Continuous flowing liquid streams (in + out)
 *   7. Luminous particles along the streams
 *   8. Embers rising from the machine
 *   9. Micro-dust motes
 *  10. Inner vignette + warm telecine flicker
 */
export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const C = {
      bg1: "#060912",
      bg2: "#0B0F1A",
      rouge: [107, 29, 46],
      rougeBright: [180, 80, 100],
      goldDeep: [142, 111, 42],
      gold: [201, 163, 71],
      goldSoft: [228, 201, 122],
      bone: [245, 241, 232],
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const lerpC = (c1: number[], c2: number[], t: number) =>
      [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)] as const;

    type Pt = { x: number; y: number };
    type Particle = {
      t: number;
      speed: number;
      radius: number;
      pathId: number;
      jitter: number;
      phase: number;
      brightness: number;
    };
    type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; radius: number };
    type Bloom = { x: number; y: number; r: number; phase: number; speed: number; hue: number[]; alpha: number };
    type Dust = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; phase: number };

    let particles: Particle[] = [];
    let embers: Ember[] = [];
    let blooms: Bloom[] = [];
    let dust: Dust[] = [];
    let openingT = 0;
    let animStart = performance.now();
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // The MACHINE sits at the upper-middle of the frame. The SVG machine
    // includes visible blood tubes that exit its viewBox at bottom-left
    // (rouge IN) and top-right (gold OUT). These canvas paths START / END
    // exactly where those tubes exit, so the stream visually continues
    // from off-frame through the tube into the machine, and out again.
    const machine = { cx: 0.5, cy: 0.42 };

    // All blood-stream visualisation now lives in the SVG layer
    // (<EbooMachine> + <PatientEndpoints>). The canvas only paints
    // atmosphere — ambient blooms, halo, orbits, dust, color grading.
    const paths: {
      p0: { x: number; y: number };
      c1: { x: number; y: number };
      c2: { x: number; y: number };
      p1: { x: number; y: number };
      color: number[];
    }[] = [];

    function bezier(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
      const u = 1 - t;
      return {
        x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
        y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
      };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const mobile = width < 768;
      const pCount = paths.length === 0 ? 0 : (reduce ? 24 : mobile ? 55 : 130);
      particles = Array.from({ length: pCount }, () => spawnParticle());

      const bCount = mobile ? 4 : 6;
      blooms = Array.from({ length: bCount }, (_, i) => {
        const isWarm = i % 2 === 0;
        return {
          x: Math.random(),
          y: 0.2 + Math.random() * 0.6,
          r: 0.25 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          speed: 0.00003 + Math.random() * 0.00004,
          hue: isWarm ? C.gold : C.rouge,
          alpha: 0.04 + Math.random() * 0.05,
        };
      });

      const dCount = reduce ? 0 : mobile ? 40 : 90;
      dust = Array.from({ length: dCount }, () => spawnDust());
      embers = [];
    }

    function spawnParticle(): Particle {
      return {
        t: Math.random(),
        speed: 0.00015 + Math.random() * 0.00022,
        radius: 0.5 + Math.random() * 1.8,
        pathId: 0,
        jitter: (Math.random() - 0.5) * 0.012,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.7 + Math.random() * 0.5,
      };
    }

    function spawnDust(): Dust {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.02,
        vy: -0.005 - Math.random() * 0.015,
        r: 0.3 + Math.random() * 0.6,
        alpha: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
      };
    }

    function emitEmber(now: number) {
      // Embers rise from the machine area
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;
      const speed = 0.12 + Math.random() * 0.45;
      const fx = machine.cx * width + (Math.random() - 0.5) * 80;
      const fy = machine.cy * height + (Math.random() - 0.5) * 40;
      embers.push({
        x: fx,
        y: fy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        max: 2200 + Math.random() * 1600,
        radius: 0.6 + Math.random() * 1.2,
      });
      if (embers.length > 70) embers.shift();
    }

    function drawBase() {
      const g = ctx!.createLinearGradient(0, 0, width * 0.7, height);
      g.addColorStop(0, C.bg1);
      g.addColorStop(1, C.bg2);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, width, height);
    }

    function drawAmbient(now: number) {
      ctx!.globalCompositeOperation = "lighter";
      for (const b of blooms) {
        const drift = now * b.speed;
        const x = (b.x + Math.sin(drift + b.phase) * 0.05) * width;
        const y = (b.y + Math.cos(drift * 1.3 + b.phase) * 0.04) * height;
        const r = b.r * Math.min(width, height);
        const breathe = 0.85 + 0.15 * Math.sin(now * 0.0006 + b.phase);
        const g = ctx!.createRadialGradient(x, y, 0, x, y, r * breathe);
        g.addColorStop(0, `rgba(${b.hue[0]},${b.hue[1]},${b.hue[2]},${b.alpha * openingT})`);
        g.addColorStop(0.5, `rgba(${b.hue[0]},${b.hue[1]},${b.hue[2]},${b.alpha * 0.3 * openingT})`);
        g.addColorStop(1, `rgba(${b.hue[0]},${b.hue[1]},${b.hue[2]},0)`);
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, width, height);
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function drawColorGrade() {
      // Cool deep shadow bottom-left
      const cool = ctx!.createRadialGradient(width * 0.1, height * 0.95, 0, width * 0.1, height * 0.95, width * 0.55);
      cool.addColorStop(0, "rgba(26, 38, 64, 0.4)");
      cool.addColorStop(1, "rgba(26, 38, 64, 0)");
      ctx!.fillStyle = cool;
      ctx!.fillRect(0, 0, width, height);

      // Cinematic letterbox darkening top
      const top = ctx!.createLinearGradient(0, 0, 0, height * 0.18);
      top.addColorStop(0, "rgba(0,0,0,0.45)");
      top.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = top;
      ctx!.fillRect(0, 0, width, height * 0.18);
    }

    /**
     * Big halo behind the machine — radial warm glow that makes the white
     * machine read against the dark canvas and gives the impression of
     * light emanating from within.
     */
    function drawMachineHalo(now: number) {
      const cx = machine.cx * width;
      const cy = machine.cy * height;
      const breathe = 0.85 + 0.15 * Math.sin(now * 0.0007);
      const r = Math.min(width, height) * 0.7 * breathe;

      ctx!.globalCompositeOperation = "lighter";
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
      halo.addColorStop(0, `rgba(245,241,232,${0.12 * openingT})`);
      halo.addColorStop(0.12, `rgba(228,201,122,${0.24 * openingT})`);
      halo.addColorStop(0.35, `rgba(201,163,71,${0.10 * openingT})`);
      halo.addColorStop(1, "rgba(201,163,71,0)");
      ctx!.fillStyle = halo;
      ctx!.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx!.globalCompositeOperation = "source-over";
    }

    /**
     * Orbital ring system centered on the machine — large enough to extend
     * beyond the machine's silhouette so it reads as orbiting around it.
     */
    function drawOrbits(now: number) {
      const cx = machine.cx * width;
      const cy = machine.cy * height;
      // Larger base so rings clearly wrap AROUND the machine silhouette,
      // not inside it.
      const baseR = Math.min(width, height) * 0.5;

      ctx!.globalCompositeOperation = "lighter";

      // Slow-rotating outer ring (long dash)
      const rot1 = now * 0.00009;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(rot1);
      ctx!.beginPath();
      ctx!.arc(0, 0, baseR * 1.45, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(201,163,71,${0.18 * openingT})`;
      ctx!.lineWidth = 0.5;
      ctx!.setLineDash([2, 14]);
      ctx!.stroke();
      // Highlighted arc segment on outer ring (creates a "rotor" feel)
      ctx!.setLineDash([]);
      ctx!.beginPath();
      ctx!.arc(0, 0, baseR * 1.45, -0.3, 0.4);
      ctx!.strokeStyle = `rgba(228,201,122,${0.7 * openingT})`;
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
      ctx!.restore();

      // Mid ring counter-rotating
      const rot2 = -now * 0.00012;
      ctx!.save();
      ctx!.translate(cx, cy);
      ctx!.rotate(rot2);
      ctx!.beginPath();
      ctx!.arc(0, 0, baseR * 1.1, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(201,163,71,${0.25 * openingT})`;
      ctx!.lineWidth = 0.6;
      ctx!.setLineDash([1, 8]);
      ctx!.stroke();
      ctx!.setLineDash([]);
      // Tick marks at 4 cardinal points
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const x1 = Math.cos(angle) * baseR * 1.08;
        const y1 = Math.sin(angle) * baseR * 1.08;
        const x2 = Math.cos(angle) * baseR * 1.14;
        const y2 = Math.sin(angle) * baseR * 1.14;
        ctx!.beginPath();
        ctx!.moveTo(x1, y1);
        ctx!.lineTo(x2, y2);
        ctx!.strokeStyle = `rgba(228,201,122,${0.6 * openingT})`;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
      }
      ctx!.restore();

      // Tightest inner ring (subtle, near machine edge)
      ctx!.beginPath();
      ctx!.arc(cx, cy, baseR * 0.85, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(201,163,71,${0.12 * openingT})`;
      ctx!.lineWidth = 0.5;
      ctx!.stroke();

      ctx!.globalCompositeOperation = "source-over";
    }

    function drawStream(now: number) {
      ctx!.globalCompositeOperation = "lighter";

      paths.forEach((path, i) => {
        const isIn = i === 0;
        const baseColor = isIn ? C.rouge : C.gold;
        const breathe = 0.75 + 0.25 * Math.sin(now * 0.0008 + i * 1.1);
        const p0 = { x: path.p0.x * width, y: path.p0.y * height };
        const c1 = { x: path.c1.x * width, y: path.c1.y * height };
        const c2 = { x: path.c2.x * width, y: path.c2.y * height };
        const p1 = { x: path.p1.x * width, y: path.p1.y * height };

        // Outer halo
        ctx!.save();
        ctx!.beginPath();
        ctx!.moveTo(p0.x, p0.y);
        ctx!.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y);
        ctx!.strokeStyle = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${0.16 * openingT * breathe})`;
        ctx!.lineWidth = 30;
        ctx!.lineCap = "round";
        ctx!.shadowColor = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},0.65)`;
        ctx!.shadowBlur = 42;
        ctx!.stroke();
        ctx!.restore();

        // Medium glow
        ctx!.save();
        ctx!.beginPath();
        ctx!.moveTo(p0.x, p0.y);
        ctx!.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y);
        ctx!.strokeStyle = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${0.32 * openingT * breathe})`;
        ctx!.lineWidth = 10;
        ctx!.lineCap = "round";
        ctx!.shadowColor = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},0.9)`;
        ctx!.shadowBlur = 20;
        ctx!.stroke();
        ctx!.restore();

        // Sharp core
        ctx!.save();
        ctx!.beginPath();
        ctx!.moveTo(p0.x, p0.y);
        ctx!.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y);
        const sharpColor = isIn ? C.rougeBright : C.goldSoft;
        ctx!.strokeStyle = `rgba(${sharpColor[0]},${sharpColor[1]},${sharpColor[2]},${0.6 * openingT})`;
        ctx!.lineWidth = 1.6;
        ctx!.lineCap = "round";
        ctx!.stroke();
        ctx!.restore();
      });

      ctx!.globalCompositeOperation = "source-over";
    }

    function drawParticles(now: number, dt: number) {
      if (paths.length === 0) return;
      ctx!.globalCompositeOperation = "lighter";

      for (const p of particles) {
        p.t += p.speed * dt;
        if (p.t > 1) {
          p.t = 0;
          p.jitter = (Math.random() - 0.5) * 0.012;
        }

        const path = paths[p.pathId];
        const pt = bezier(path.p0, path.c1, path.c2, path.p1, p.t);
        const wobble = Math.sin(now * 0.0022 + p.phase) * p.jitter;
        const x = (pt.x + wobble) * width;
        const y = (pt.y + wobble * 0.6) * height;

        // Color depends on path — rouge stream stays rouge-toned along its length,
        // gold stream stays gold. The transmutation happens INSIDE the machine,
        // which is hidden by the photo. So we don't need lerp here — clarity is better.
        const base = path.color;
        const flicker = 0.5 + 0.5 * Math.sin(now * 0.004 + p.phase * 1.6);
        const a = openingT * p.brightness * (0.5 + flicker * 0.3);

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${base[0]|0},${base[1]|0},${base[2]|0},${a * 0.16})`;
        ctx!.arc(x, y, p.radius * 7, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${base[0]|0},${base[1]|0},${base[2]|0},${a * 0.45})`;
        ctx!.arc(x, y, p.radius * 2.6, 0, Math.PI * 2);
        ctx!.fill();

        const coreR = Math.min(255, base[0] + 60);
        const coreG = Math.min(255, base[1] + 60);
        const coreB = Math.min(255, base[2] + 60);
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${coreR|0},${coreG|0},${coreB|0},${a})`;
        ctx!.arc(x, y, p.radius * 0.85, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalCompositeOperation = "source-over";
    }

    function drawEmbers(dt: number) {
      ctx!.globalCompositeOperation = "lighter";
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life += dt;
        if (e.life >= e.max) {
          embers.splice(i, 1);
          continue;
        }
        e.x += e.vx * dt * 0.04;
        e.y += e.vy * dt * 0.04;
        e.vy -= 0.00018 * dt;
        const lifeT = e.life / e.max;
        const alpha = openingT * (1 - lifeT) * 0.65;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(228,201,122,${alpha * 0.22})`;
        ctx!.arc(e.x, e.y, e.radius * 5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(245,241,232,${alpha})`;
        ctx!.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function drawDust(now: number, dt: number) {
      ctx!.globalCompositeOperation = "lighter";
      for (const d of dust) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y < -10) { d.y = height + 10; d.x = Math.random() * width; }
        if (d.x < -10) d.x = width + 10;
        if (d.x > width + 10) d.x = -10;
        const flicker = 0.5 + 0.5 * Math.sin(now * 0.003 + d.phase);
        const a = openingT * d.alpha * flicker;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(245,241,232,${a})`;
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function drawOverlay(now: number) {
      const v = ctx!.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.4, width / 2, height / 2, Math.max(width, height) * 0.78);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx!.fillStyle = v;
      ctx!.fillRect(0, 0, width, height);

      const warm = 0.025 + 0.015 * Math.sin(now * 0.0006);
      const warmG = ctx!.createLinearGradient(0, 0, 0, height * 0.4);
      warmG.addColorStop(0, `rgba(201,163,71,${warm})`);
      warmG.addColorStop(1, "rgba(201,163,71,0)");
      ctx!.fillStyle = warmG;
      ctx!.fillRect(0, 0, width, height * 0.4);
    }

    let last = performance.now();
    let lastEmberAt = 0;
    function frame(now: number) {
      const dt = Math.min(64, now - last);
      last = now;

      const opening = Math.min(1, (now - animStart) / 2200);
      openingT = reduce ? 1 : easeOutCubic(opening);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx!.save();
      ctx!.translate(mouseX * width * 0.014, mouseY * height * 0.009);

      drawBase();
      drawAmbient(now);
      drawColorGrade();
      drawMachineHalo(now);
      drawOrbits(now);
      drawStream(now);
      drawParticles(now, dt);

      if (!reduce && now - lastEmberAt > 200) {
        emitEmber(now);
        lastEmberAt = now;
      }
      drawEmbers(dt);
      drawDust(now, dt);
      drawOverlay(now);

      ctx!.restore();

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }
    function onResize() { resize(); }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
