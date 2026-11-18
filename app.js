
// ══════════════════════════════════════════════════════════════════════════
// LPU TRUE FLUID WAVE PRELOADER (MATHEMATICAL SINE WAVE FILL SYNCED TO BAR)
// ══════════════════════════════════════════════════════════════════════════
(function initTrueWavePreloader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  const waveClipPath = document.getElementById('wave-clip-path');
  const waveFront = document.getElementById('wave-crest-front');
  const waveBack = document.getElementById('wave-crest-back');
  const bar = document.getElementById('preloader-bar');
  const percentEl = document.getElementById('preloader-percent');

  let progress = 0;
  let wavePhase = 0;
  let isComplete = false;

  function buildWaveD(waterY, phase, amp, freq) {
    let d = 'M -20 ' + waterY.toFixed(2);
    for (let x = -20; x <= 160; x += 4) {
      const y = waterY + Math.sin((x * freq) + phase) * amp;
      d += ' L ' + x + ' ' + y.toFixed(2);
    }
    return d;
  }

  function renderWave() {
    wavePhase += 0.085;

    // waterY starts at 145 (0% fill) and rises to -10 (100% full)
    const waterY = 145 - (progress / 100) * 155;
    const amp = progress >= 100 ? 0 : 7.5; // active rolling crest while filling

    if (waveClipPath) {
      let clipD = buildWaveD(waterY, wavePhase, amp, 0.055);
      clipD += ' L 160 160 L -20 160 Z';
      waveClipPath.setAttribute('d', clipD);
    }

    if (waveFront) {
      const crestFrontD = buildWaveD(waterY, wavePhase, amp, 0.055);
      waveFront.setAttribute('d', crestFrontD);
    }

    if (waveBack) {
      const crestBackD = buildWaveD(waterY, wavePhase + 1.6, amp * 0.7, 0.065);
      waveBack.setAttribute('d', crestBackD);
    }

    if (!isComplete) {
      requestAnimationFrame(renderWave);
    }
  }

  requestAnimationFrame(renderWave);

  // Sync progress precisely: fills smoothly to 100% over ~2.4 seconds
  const startTime = Date.now();
  const totalDuration = 2400;

  const progressTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));

    if (bar) bar.style.width = progress + '%';
    if (percentEl) percentEl.textContent = progress + '%';

    if (progress >= 100) {
      clearInterval(progressTimer);
      isComplete = true;

      // Gracefully fade and scale out the preloader to reveal portfolio
      setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        setTimeout(() => {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 700);
      }, 250);
    }
  }, 25);
})();

/**
 * SHEKH IMAMUL HAUQ — PORTFOLIO CORE ENGINE
 * Features:
 * 1. Interactive 3D WebGL / Three.js Star Galaxy & Constellation Engine
 * 2. 3D Card Tilt with specular light reflection
 * 3. Text scramble / Typewriter cycle
 * 4. Staggered Scroll Reveals (IntersectionObserver)
 * 5. Project Filtering (All / Spatial / Commercial / Game)
 * 6. 5-Part Story Exhibition Modals (Claim + Evidence + Reflection)
 * 7. Lightbox image viewer
 * 8. Web Audio API synthesized micro-sounds
 * 9. Safe Clipboard copy & Contact messaging
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeConstellation();
  initTextScramble();
  initTiltCards();
  initMagneticButtons();
  initScrollReveal();
  initProjectFilters();
  initProofFilters();
  initStoryModals();
  initLightbox();
  initAudioFeedback();
  initContactAndCopy();
  initNavigation();
  initCustomCursor();
});

/* ==========================================================================
   1. 3D WEBGL GALAXY & CONSTELLATION ENGINE (THREE.JS / CANVAS FALLBACK)
   ========================================================================== */
function initThreeConstellation() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;

  // Verify Three.js loaded; if not, invoke lightweight canvas constellation
  if (typeof THREE === 'undefined') {
    initCanvasConstellationFallback(canvas);
    return;
  }

  try {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A0A, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 700;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Galaxy
    const particleCount = window.innerWidth < 768 ? 600 : 1300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    // Color definitions
    const colorCrimson = new THREE.Color(0xdc143c);
    const colorBlush = new THREE.Color(0xffb3b3);
    const colorWhite = new THREE.Color(0xe5e2e1);
    const colorDarkRed = new THREE.Color(0x8a0d24);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const radius = 950 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = (radius * Math.cos(phi)) * 0.5 + (Math.random() - 0.5) * 300;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      originalPositions[idx] = x;
      originalPositions[idx + 1] = y;
      originalPositions[idx + 2] = z;

      // Assign palette colors randomly
      const rnd = Math.random();
      let chosenColor;
      if (rnd < 0.45) chosenColor = colorCrimson;
      else if (rnd < 0.7) chosenColor = colorBlush;
      else if (rnd < 0.85) chosenColor = colorWhite;
      else chosenColor = colorDarkRed;

      colors[idx] = chosenColor.r;
      colors[idx + 1] = chosenColor.g;
      colors[idx + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Soft glowing star texture generated procedurally
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(255, 179, 179, 0.8)');
    grad.addColorStop(0.5, 'rgba(220, 20, 60, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(pCanvas);
    const material = new THREE.PointsMaterial({
      size: 6,
      map: texture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    // Constellation lines for a subset of nearby nodes
    const lineCount = 140;
    const lineIndices = [];
    for (let i = 0; i < lineCount; i++) {
      lineIndices.push(Math.floor(Math.random() * particleCount));
    }
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xdc143c,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const lineGeom = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * lineCount * 6);
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMesh = new THREE.LineSegments(lineGeom, lineMaterial);
    scene.add(lineMesh);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - windowHalfX) * 0.35;
      mouseY = (e.clientY - windowHalfY) * 0.35;
    });

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      starField.rotation.y = elapsedTime * 0.02 + targetX * 0.0004;
      starField.rotation.x = targetY * 0.0004;

      // Dynamic Constellation lines calculation
      let lineVertexIdx = 0;
      const posAttr = geometry.attributes.position.array;
      const maxDistance = 140;

      for (let i = 0; i < lineIndices.length; i++) {
        const p1 = lineIndices[i] * 3;
        for (let j = i + 1; j < lineIndices.length; j++) {
          const p2 = lineIndices[j] * 3;
          const dx = posAttr[p1] - posAttr[p2];
          const dy = posAttr[p1 + 1] - posAttr[p2 + 1];
          const dz = posAttr[p1 + 2] - posAttr[p2 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            linePositions[lineVertexIdx++] = posAttr[p1];
            linePositions[lineVertexIdx++] = posAttr[p1 + 1];
            linePositions[lineVertexIdx++] = posAttr[p1 + 2];
            linePositions[lineVertexIdx++] = posAttr[p2];
            linePositions[lineVertexIdx++] = posAttr[p2 + 1];
            linePositions[lineVertexIdx++] = posAttr[p2 + 2];
          }
        }
      }

      lineGeom.setDrawRange(0, lineVertexIdx / 3);
      lineGeom.attributes.position.needsUpdate = true;
      lineMesh.rotation.copy(starField.rotation);

      renderer.render(scene, camera);
    }

    animate();
  } catch (err) {
    console.warn('Three.js failed to initialize, using 2D Canvas fallback:', err);
    initCanvasConstellationFallback(canvas);
  }
}

// 2D Canvas Constellation Fallback
function initCanvasConstellationFallback(canvas) {
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = 80;
  const particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(220, 20, 60, 0.8)' : 'rgba(255, 179, 179, 0.7)'
    });
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(220, 20, 60, ${0.2 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   2. TEXT SCRAMBLE & TYPEWRITER ENGINE
   ========================================================================== */
function initTextScramble() {
  const element = document.getElementById('typewriter-text');
  if (!element) return;

  const phrases = JSON.parse(element.getAttribute('data-phrases') || '[]');
  if (!phrases.length) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 70;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 35;
    } else {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 70;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2200; // Pause at full phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before new phrase
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);
}

/* ==========================================================================
   3. 3D CARD TILT WITH RADIAL SPECULAR GLARE
   ========================================================================== */
function initTiltCards() {
  if (window.innerWidth < 992) return; // Disable heavy tilt on touch/small screens
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   4. MAGNETIC BUTTONS (MICRO-INTERACTION)
   ========================================================================== */
function initMagneticButtons() {
  if (window.innerWidth < 992) return;
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   5. STAGGERED SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   7. 5-PART STORY EXHIBITION MODALS (FROM PPT FRAMEWORK)
   ========================================================================== */
const projectStoryData = {
  navia: {
    title: "NAVIA — LPU's Spatial Intelligence & Digital Campus Platform",
    category: "SPATIAL 3D & GIS PLATFORM",
    meta: "Role: Team Leader | Lead Developer • Stack: Next.js 15, Three.js, React Three Fiber, MapLibre GL, PostgreSQL, Gemini SDK",
    steps: [
      {
        num: "1",
        title: "Title & Scope",
        body: "NAVIA (Navigation & Spatial Intelligence Assistant) — a centralized smart campus platform built during the CodeFlux 36-hour hackathon at Lovely Professional University."
      },
      {
        num: "2",
        title: "Purpose & Problem Statement",
        body: "Navigating a massive university campus like LPU is daunting for freshmen, guests, and visitors who struggle to locate academic blocks, food kiosks, and university services. NAVIA centralizes spatial discovery, integrates Uni Mall appointment bookings, and provides procedural 3D campus routing."
      },
      {
        num: "3",
        title: "My Exact Role & Leadership",
        body: "Served as Team Leader and Lead Developer. Spearheaded core application architecture, designed and implemented the frontend interface in Next.js 15 and Three.js, orchestrated Dijkstra pedestrian routing across geospatial datasets, and coordinated team execution under tight hackathon deadlines."
      },
      {
        num: "4",
        title: "Process, Tools & Evidence",
        body: "Followed a 4-phase GIS-first development pipeline: (1) Spatial database & PostGIS modeling; (2) OpenStreetMap and GeoJSON pipeline; (3) Three.js procedural 3D building visualization and third-person view; (4) Gemini SDK integration for natural-language campus queries.<br><br><strong>Evidence:</strong> GitHub Repo: <a href='https://github.com/id40/Project-101' target='_blank' class='text-crimson' style='text-decoration: underline;'>github.com/id40/Project-101</a>, complete PRD documentation, and functional prototype."
      },
      {
        num: "5",
        title: "Outcome & Reflection",
        body: "<strong>Outcome:</strong> NAVIA successfully progressed to Round 2 of CodeFlux.<br><br><strong>Reflection:</strong> Building a functional application is only half of engineering—communicating architecture decisions and justifying data structures is equally crucial. This project cemented my passion for spatial technology, 3D visualization, and systems design."
      }
    ]
  },
  saarsh: {
    title: "SAARSH Unisex Salon & Academy Commercial Platform",
    category: "COMMERCIAL FULL-STACK WEB",
    meta: "Role: Solo Developer | Independent Client Delivery • Stack: TypeScript, Next.js, React, Tailwind CSS, Firebase, Vercel",
    steps: [
      {
        num: "1",
        title: "Title & Scope",
        body: "SAARSH Unisex Salon & Academy — a modern, responsive commercial website and service showcase deployed in production."
      },
      {
        num: "2",
        title: "Purpose & Problem Statement",
        body: "The salon and beauty academy required a distinct digital identity to showcase curated grooming and styling services, communicate brand elegance, and enable customer discovery online."
      },
      {
        num: "3",
        title: "My Exact Role",
        body: "Executed independently from conception to deployment. Handled client requirements gathering, information architecture, Figma wireframing, frontend engineering in Next.js, styling in Tailwind CSS, and cloud deployment on Vercel."
      },
      {
        num: "4",
        title: "Process, Tools & Evidence",
        body: "Conducted brand study, established responsive design tokens, crafted modular UI components, integrated Firebase for asset and data handling, and optimized performance for mobile screens.<br><br><strong>Evidence:</strong> Live Production Site: <a href='https://saarshsalon.vercel.app' target='_blank' class='text-crimson' style='text-decoration: underline;'>saarshsalon.vercel.app</a>."
      },
      {
        num: "5",
        title: "Outcome & Reflection",
        body: "<strong>Outcome:</strong> Successfully shipped a clean, fast, and accessible digital platform serving real customers.<br><br><strong>Reflection:</strong> Working solo on a client project honed my real-world development workflow, self-discipline, and customer-first design mindset."
      }
    ]
  },
  cloudbound: {
    title: "Cloudbound — Semi-Open-World Cooperative Adventure Game",
    category: "GAME DESIGN & 3D SYSTEMS",
    meta: "Role: Game Creator | Lead Designer • Stack: Blender 3D, Unreal Engine / Godot, GDD v1.1 Specifications",
    steps: [
      {
        num: "1",
        title: "Title & Concept",
        body: "Cloudbound — a 2–4 player cooperative adventure set among floating sky islands, combining custom airship navigation, exploration, and ability mastery."
      },
      {
        num: "2",
        title: "Purpose & Problem Statement",
        body: "To design a balanced cooperative gameplay loop where exploration, aerial navigation, combat, and resource survival unite into one coherent multiplayer ecosystem without fragmented pacing."
      },
      {
        num: "3",
        title: "My Exact Role",
        body: "Creator and Lead Game Designer. Authored comprehensive Game Design Documents (GDD v1.1), modeled environmental concepts in Blender, designed airship mechanics, established four playable character races, and balanced difficulty tiers."
      },
      {
        num: "4",
        title: "Process, Tools & Evidence",
        body: "Structured pre-production with systemic game loops: modular airship construction (hybrid manual/automated flight), fruit-based ability trees, environmental hazards, and persistent multiplayer progression.<br><br><strong>Evidence:</strong> Cloudbound GDD v1.1, character specifications, world lore, and concept artwork featured in this portfolio."
      },
      {
        num: "5",
        title: "Outcome & Reflection",
        body: "<strong>Outcome:</strong> Completed structured pre-production milestones with a concrete systems architecture ready for engine prototyping in Unreal/Godot.<br><br><strong>Reflection:</strong> True game design requires systems thinking—every mechanic and UI element must complement the core loop. Cloudbound embodies my commitment to creating immersive interactive worlds."
      }
    ]
  }
};

function initStoryModals() {
  const modal = document.getElementById('story-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalMeta = document.getElementById('modal-meta');
  const modalContent = document.getElementById('modal-content');

  document.querySelectorAll('.open-story-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('open');
      const projectKey = btn.getAttribute('data-project');
      const data = projectStoryData[projectKey];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalMeta.textContent = data.meta;

      let html = '<div class="story-grid">';
      data.steps.forEach(step => {
        html += `
          <div class="story-step">
            <div class="story-step-head">
              <span class="step-number">${step.num}</span>
              <span>${step.title}</span>
            </div>
            <p>${step.body}</p>
          </div>
        `;
      });
      html += '</div>';

      modalContent.innerHTML = html;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    playUiSound('click');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   8. LIGHTBOX IMAGE & CREDENTIAL VIEWER
   ========================================================================== */
function initLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Handle Artwork & Proof Viewers
  document.querySelectorAll('.view-artwork-btn, .view-proof-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('open');
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title') || "Verified Document & Proof";
      const caption = btn.getAttribute('data-caption') || "";

      lightboxImg.src = imgSrc;
      lightboxCaption.innerHTML = `<strong>${title}</strong>${caption ? `<br><span>${caption}</span>` : ''}`;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    playUiSound('click');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

/* ==========================================================================
   8B. VERIFIED PROOF FILTERS
   ========================================================================== */
function initProofFilters() {
  const proofFilters = document.querySelectorAll('.proof-filter-btn');
  const proofCards = document.querySelectorAll('.proof-card');

  proofFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiSound('click');
      proofFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-proof-filter');

      proofCards.forEach(card => {
        const cat = card.getAttribute('data-proof-cat');
        if (filterVal === 'all' || cat === filterVal) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   9. WEB AUDIO API SYNTHESIZER (NO EXTERNAL SOUND FILES NEEDED)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioFeedback() {
  const soundToggle = document.getElementById('sound-toggle');
  if (!soundToggle) return;

  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(soundEnabled ? "UI sound effects enabled" : "UI sound effects muted");
    if (soundEnabled) playUiSound('click');
  });
}

function playUiSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'open') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (e) {
    // Audio context suppressed by browser policy until interaction
  }
}

/* ==========================================================================
   10. CONTACT FORM & CLIPBOARD COPY
   ========================================================================== */
function initContactAndCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'shekhimamul312@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playUiSound('success');
        showToast('Email copied to clipboard: ' + email);
        copyBtn.innerHTML = '<i class="fa-solid fa-check text-crimson"></i>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000);
      }).catch(() => {
        showToast('Direct email: ' + email);
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const msg = document.getElementById('form-message').value.trim();
      const accessKeyInput = document.getElementById('contact-access-key');
      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : 'YOUR_ACCESS_KEY_HERE';

      // If user hasn't replaced placeholder access key yet, notify and fallback to mailto
      if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
        playUiSound('ping');
        formStatus.className = 'form-status-msg';
        formStatus.style.color = '#38bdf8';
        formStatus.innerHTML = `<i class="fa-solid fa-circle-info"></i> Notice: Set your free Web3Forms Access Key to receive emails automatically. Opening your email client as fallback...`;

        const mailtoLink = `mailto:shekhimamul312@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nSender Email: ' + email)}`;
        window.location.href = mailtoLink;
        return;
      }

      // Live submission via Web3Forms API
      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>`;
        }
        formStatus.className = 'form-status-msg';
        formStatus.style.color = 'var(--text-secondary)';
        formStatus.innerHTML = `<i class="fa-solid fa-paper-plane fa-fade"></i> Transmitting your message...`;

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: accessKey,
            name: name,
            email: email,
            message: msg,
            subject: `Portfolio Message from ${name}`
          })
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          playUiSound('success');
          formStatus.className = 'form-status-msg success';
          formStatus.style.color = '#4ade80';
          formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you ${name}! Your message was sent directly to Shekh's inbox.`;
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.warn('Web3Forms submission failed, using mailto fallback:', err);
        playUiSound('error');
        formStatus.className = 'form-status-msg';
        formStatus.style.color = '#f87171';
        formStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Could not send directly. Opening your email client to send...`;
        const mailtoLink = `mailto:shekhimamul312@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nSender Email: ' + email)}`;
        window.location.href = mailtoLink;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
        setTimeout(() => {
          formStatus.textContent = '';
        }, 8000);
      }
    });
  }
}

/* ==========================================================================
   11. NAVIGATION & BACK-TO-TOP
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      playUiSound('click');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      playUiSound('click');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   12. CUSTOM CURSOR GLOW (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  const cursorGlow = document.getElementById('cursor-glow');
  if (!cursorGlow || window.innerWidth < 992) return;

  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = `<i class="fa-solid fa-circle-info text-crimson"></i> <span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
