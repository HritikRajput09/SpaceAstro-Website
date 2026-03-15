// ============================================
//  SpaceAstro — DEEP SPACE EXPLORER — MAIN JS
// ============================================

// ── LIVE CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('live-time').textContent =
    now.toUTCString().replace('GMT', 'UTC');
}
setInterval(updateClock, 1000);
updateClock();

// ── STARFIELD ──
(function() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.005,
        speed: Math.random() * 0.04
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 220, 255, ${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  makeStars(280);
  drawStars();
  window.addEventListener('resize', () => { resize(); makeStars(280); });
})();

// ── REVEAL ON SCROLL ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

// ── RENDER PLANET CARDS ──
function getPlanetAccent(color) { return color; }

function renderPlanetCards(filter = 'all') {
  const grid = document.getElementById('planets-grid');
  grid.innerHTML = '';
  const filtered = filter === 'all' ? PLANETS : PLANETS.filter(p => p.type === filter);
  filtered.forEach((p, i) => {
    const hzClass = { yes: 'hz-yes', no: 'hz-no', partial: 'hz-partial' }[p.habitableZone];
    const hzLabel = { yes: '✓ HABITABLE ZONE', no: '✗ NOT HABITABLE', partial: '~ MARGINAL ZONE' }[p.habitableZone];

    const card = document.createElement('div');
    card.className = 'card reveal';
    card.style.setProperty('--card-accent', p.color);
    card.style.setProperty('--card-color', p.color);
    card.innerHTML = `
      <div class="card-hero">
        <div class="card-hero-bg"></div>
        <span>${p.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-tag">${p.tag}</div>
        <div class="card-name">${p.name}</div>
        <div class="hz-badge ${hzClass}">${hzLabel}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-stats">
          <div class="cstat">
            <span class="cstat-label">DISTANCE FROM EARTH</span>
            <span class="cstat-value">${p.lightYears}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">AVG TEMPERATURE</span>
            <span class="cstat-value">${p.temperature.avg}°C</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">ATMOS. PRESSURE</span>
            <span class="cstat-value">${p.atmosphericPressure}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">PLANET CORE</span>
            <span class="cstat-value" style="font-size:0.65rem">${p.core.split(',')[0]}</span>
          </div>
        </div>
        <button class="card-more-btn" onclick="openModal('planet','${p.id}')">VIEW FULL DATA →</button>
      </div>`;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}
renderPlanetCards();

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPlanetCards(btn.dataset.filter);
  });
});

// ── RENDER GALAXY CARDS ──
function renderGalaxyCards() {
  const grid = document.getElementById('galaxies-grid');
  grid.innerHTML = '';
  GALAXIES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'card reveal';
    card.style.setProperty('--card-accent', g.color);
    card.style.setProperty('--card-color', g.color);
    card.innerHTML = `
      <div class="card-hero">
        <div class="card-hero-bg"></div>
        <span>${g.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-tag">${g.tag}</div>
        <div class="card-name">${g.name}</div>
        <div class="card-desc">${g.desc}</div>
        <div class="card-stats">
          <div class="cstat">
            <span class="cstat-label">DISTANCE</span>
            <span class="cstat-value">${g.lightYears}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">DIAMETER</span>
            <span class="cstat-value">${g.diameter}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">STARS</span>
            <span class="cstat-value">${g.stars}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">TYPE</span>
            <span class="cstat-value">${g.type}</span>
          </div>
        </div>
        <button class="card-more-btn" onclick="openModal('galaxy','${g.id}')">VIEW FULL DATA →</button>
      </div>`;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}
renderGalaxyCards();

// ── RENDER NEBULA CARDS ──
function renderNebulaCards() {
  const grid = document.getElementById('nebulas-grid');
  grid.innerHTML = '';
  NEBULAS.forEach(n => {
    const card = document.createElement('div');
    card.className = 'card reveal';
    card.style.setProperty('--card-accent', n.color);
    card.style.setProperty('--card-color', n.color);
    card.innerHTML = `
      <div class="card-hero">
        <div class="card-hero-bg"></div>
        <span>${n.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-tag">${n.tag}</div>
        <div class="card-name">${n.name}</div>
        <div class="card-desc">${n.desc}</div>
        <div class="card-stats">
          <div class="cstat">
            <span class="cstat-label">DISTANCE</span>
            <span class="cstat-value">${n.lightYears}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">DIAMETER</span>
            <span class="cstat-value">${n.diameter}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">TEMPERATURE</span>
            <span class="cstat-value" style="font-size:0.65rem">${n.temperature}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">TYPE</span>
            <span class="cstat-value" style="font-size:0.65rem">${n.type}</span>
          </div>
        </div>
        <button class="card-more-btn" onclick="openModal('nebula','${n.id}')">VIEW FULL DATA →</button>
      </div>`;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}
renderNebulaCards();

// ── RENDER CONSTELLATION CARDS ──
function renderConstellationCards() {
  const grid = document.getElementById('constellations-grid');
  grid.innerHTML = '';
  CONSTELLATIONS.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card reveal';
    card.style.setProperty('--card-accent', c.color);
    card.style.setProperty('--card-color', c.color);
    card.innerHTML = `
      <div class="card-hero">
        <div class="card-hero-bg"></div>
        <span>${c.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-tag">${c.tag} · ${c.region}</div>
        <div class="card-name">${c.name}</div>
        <div class="card-desc">${c.desc}</div>
        <div class="card-stats">
          <div class="cstat">
            <span class="cstat-label">STAR DISTANCE RANGE</span>
            <span class="cstat-value">${c.distanceRange}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">BEST VIEWED</span>
            <span class="cstat-value">${c.bestViewed}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">BRIGHTEST STAR</span>
            <span class="cstat-value" style="font-size:0.65rem">${c.brightestStar.split('—')[0].trim()}</span>
          </div>
          <div class="cstat">
            <span class="cstat-label">SKY AREA</span>
            <span class="cstat-value">${c.area}</span>
          </div>
        </div>
        <button class="card-more-btn" onclick="openModal('constellation','${c.id}')">VIEW FULL DATA →</button>
      </div>`;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}
renderConstellationCards();

// ── ORBIT TABLE ──
(function() {
  const tbody = document.getElementById('orbit-tbody');
  ORBIT_DATA.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="planet-cell">
        <span class="planet-dot" style="background:${p.dotColor}"></span>
        <span>${p.name}</span>
      </div></td>
      <td>${p.period}</td>
      <td>${p.semiMajor}</td>
      <td>${p.eccentricity}</td>
      <td>${p.speed}</td>
      <td>${p.inclination}</td>`;
    tbody.appendChild(tr);
  });
})();

// ── ORBIT CANVAS ──
(function() {
  const canvas = document.getElementById('orbit-canvas');
  const ctx = canvas.getContext('2d');
  const panel = document.getElementById('oip-content');
  const label = document.querySelector('.oip-label');
  let width, height, cx, cy, scale;
  let time = 0;
  let hovered = null;
  const AU_radii = [0.387, 0.723, 1.0, 1.524, 5.203, 9.537, 19.19, 30.07];
  const speeds  = [4.74, 1.62, 1.0, 0.531, 0.0843, 0.0339, 0.012, 0.006];
  const emojis  = ["🪨","🌕","🌍","🔴","🪐","🪐","🔵","🌑"];
  const names   = ["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"];
  const colors  = ["#b0a090","#e8c56a","#4a9eff","#c1440e","#c88b3a","#e8d5a3","#7de8e8","#4169e1"];
  const sizes   = [3,5,5,4,9,8,7,6];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    width  = canvas.width;
    height = canvas.height;
    cx = width / 2;
    cy = height / 2;
    scale = Math.min(width, height) * 0.43;
  }

  function logScale(au) {
    return (Math.log(au + 0.5) / Math.log(31)) * scale;
  }

  let angles = AU_radii.map(() => Math.random() * Math.PI * 2);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Orbit rings
    AU_radii.forEach((au, i) => {
      const r = logScale(au);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = hovered === i
        ? `rgba(79,163,255,0.3)`
        : `rgba(80,120,180,0.12)`;
      ctx.lineWidth = hovered === i ? 1.5 : 0.8;
      ctx.stroke();
    });

    // Sun
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
    sunGrad.addColorStop(0, '#fff9c4');
    sunGrad.addColorStop(0.4, '#ffcc02');
    sunGrad.addColorStop(1, 'rgba(255,140,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // Planets
    AU_radii.forEach((au, i) => {
      angles[i] += speeds[i] * 0.001;
      const r = logScale(au);
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      const sz = sizes[i] * (devicePixelRatio || 1);

      // Glow
      if (hovered === i) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
        g.addColorStop(0, colors[i] + '80');
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, sz * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();

      if (hovered === i) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5 * devicePixelRatio;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#e8edf5';
        ctx.font = `${11 * devicePixelRatio}px 'Share Tech Mono', monospace`;
        ctx.fillText(names[i], x + sz + 5, y + 4);
      }
    });

    time++;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * devicePixelRatio;
    const my = (e.clientY - rect.top)  * devicePixelRatio;
    hovered = null;
    AU_radii.forEach((au, i) => {
      const r = logScale(au);
      const x = cx + r * Math.cos(angles[i]);
      const y = cy + r * Math.sin(angles[i]);
      const dist = Math.hypot(mx - x, my - y);
      if (dist < sizes[i] * 3 * devicePixelRatio) hovered = i;
    });

    if (hovered !== null) {
      const p = ORBIT_DATA[hovered];
      label.textContent = 'ORBITAL DATA: ' + p.name.toUpperCase();
      panel.innerHTML = `
        <div class="oip-planet-name" style="color:${colors[hovered]}">${names[hovered]}</div>
        <div class="oip-stat"><span class="oip-stat-label">ORBITAL PERIOD</span><span class="oip-stat-value">${p.period}</span></div>
        <div class="oip-stat"><span class="oip-stat-label">SEMI-MAJOR AXIS</span><span class="oip-stat-value">${p.semiMajor}</span></div>
        <div class="oip-stat"><span class="oip-stat-label">ECCENTRICITY</span><span class="oip-stat-value">${p.eccentricity}</span></div>
        <div class="oip-stat"><span class="oip-stat-label">ORBITAL SPEED</span><span class="oip-stat-value">${p.speed}</span></div>
        <div class="oip-stat"><span class="oip-stat-label">INCLINATION</span><span class="oip-stat-value">${p.inclination}</span></div>
      `;
    } else {
      label.textContent = 'HOVER A PLANET';
      panel.innerHTML = '<p style="color:var(--muted); font-size:0.85rem;">Select an orbital body to view its trajectory data.</p>';
    }
    canvas.style.cursor = hovered !== null ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    hovered = null;
    label.textContent = 'HOVER A PLANET';
    panel.innerHTML = '<p style="color:var(--muted); font-size:0.85rem;">Select an orbital body to view its trajectory data.</p>';
  });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ── MODAL ──
function openModal(type, id) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  let data, html;

  if (type === 'planet') {
    const p = PLANETS.find(x => x.id === id);
    const hzClass = { yes: 'hz-yes', no: 'hz-no', partial: 'hz-partial' }[p.habitableZone];
    const hzLabel = { yes: '✓ IN HABITABLE ZONE', no: '✗ OUTSIDE HABITABLE ZONE', partial: '~ MARGINAL HABITABLE ZONE' }[p.habitableZone];

    const barsHtml = p.bars.map(b => `
      <div class="modal-bar-item">
        <span class="modal-bar-label">${b.label}</span>
        <div class="modal-bar-track"><div class="modal-bar-fill" style="width:${b.value}%;background:${p.color}"></div></div>
        <span class="modal-bar-val">${b.display}</span>
      </div>`).join('');

    html = `
      <div class="modal-header">
        <div class="modal-icon">${p.emoji}</div>
        <div class="modal-title-block">
          <div class="modal-subtitle">${p.tag} · SOLAR SYSTEM</div>
          <div class="modal-title">${p.name}</div>
          <div class="hz-badge ${hzClass}" style="margin-top:0.5rem">${hzLabel}</div>
        </div>
      </div>
      <p class="modal-desc">${p.fullDesc}</p>
      <div class="modal-stats-grid">
        <div class="mstat"><span class="mstat-label">DISTANCE FROM EARTH</span><span class="mstat-value">${p.lightYears}</span></div>
        <div class="mstat"><span class="mstat-label">RADIUS</span><span class="mstat-value">${p.radius}</span></div>
        <div class="mstat"><span class="mstat-label">MASS</span><span class="mstat-value">${p.mass}</span></div>
        <div class="mstat"><span class="mstat-label">SURFACE GRAVITY</span><span class="mstat-value">${p.gravity}</span></div>
        <div class="mstat"><span class="mstat-label">AVG TEMPERATURE</span><span class="mstat-value">${p.temperature.avg}°C</span></div>
        <div class="mstat"><span class="mstat-label">TEMP RANGE</span><span class="mstat-value">${p.temperature.min}°C → ${p.temperature.max}°C</span></div>
        <div class="mstat"><span class="mstat-label">ATMOS. PRESSURE</span><span class="mstat-value">${p.atmosphericPressure}</span></div>
        <div class="mstat"><span class="mstat-label">MOONS</span><span class="mstat-value">${p.moons}</span></div>
        <div class="mstat"><span class="mstat-label">ORBITAL PERIOD</span><span class="mstat-value">${p.orbitalPeriod}</span></div>
        <div class="mstat"><span class="mstat-label">DIST. FROM SUN</span><span class="mstat-value">${p.distanceFromSun}</span></div>
      </div>
      <div class="modal-section-title">WATER DENSITY</div>
      <p class="modal-desc" style="margin-bottom:1.5rem;font-size:0.9rem">${p.waterDensity}</p>
      <div class="modal-section-title">PLANETARY CORE</div>
      <p class="modal-desc" style="margin-bottom:1.5rem;font-size:0.9rem">${p.core}</p>
      <div class="modal-section-title">HABITABLE ZONE ASSESSMENT</div>
      <p class="modal-desc" style="margin-bottom:1.5rem;font-size:0.9rem">${p.habitableNote}</p>
      <div class="modal-section-title">ATMOSPHERIC COMPOSITION</div>
      <p class="modal-desc" style="margin-bottom:1.5rem;font-size:0.9rem">${p.composition.join(' · ')}</p>
      <div class="modal-section-title">COMPARATIVE METRICS</div>
      ${barsHtml}`;

  } else if (type === 'galaxy') {
    const g = GALAXIES.find(x => x.id === id);
    html = `
      <div class="modal-header">
        <div class="modal-icon">${g.emoji}</div>
        <div class="modal-title-block">
          <div class="modal-subtitle">${g.tag} · ${g.type}</div>
          <div class="modal-title">${g.name}</div>
        </div>
      </div>
      <p class="modal-desc">${g.desc}</p>
      <div class="modal-stats-grid">
        <div class="mstat"><span class="mstat-label">DISTANCE FROM EARTH</span><span class="mstat-value">${g.lightYears}</span></div>
        <div class="mstat"><span class="mstat-label">DIAMETER</span><span class="mstat-value">${g.diameter}</span></div>
        <div class="mstat"><span class="mstat-label">ESTIMATED STARS</span><span class="mstat-value">${g.stars}</span></div>
        <div class="mstat"><span class="mstat-label">AGE</span><span class="mstat-value">${g.age}</span></div>
        <div class="mstat"><span class="mstat-label">GALAXY TYPE</span><span class="mstat-value">${g.type}</span></div>
      </div>
      <div class="modal-section-title">CENTRAL OBJECT</div>
      <p class="modal-desc" style="margin-bottom:1.5rem;font-size:0.9rem">${g.centralObject}</p>
      <div class="modal-section-title">NOTABLE FACT</div>
      <p class="modal-desc" style="font-size:0.9rem">${g.notableFact}</p>`;

  } else if (type === 'nebula') {
    const n = NEBULAS.find(x => x.id === id);
    html = `
      <div class="modal-header">
        <div class="modal-icon">${n.emoji}</div>
        <div class="modal-title-block">
          <div class="modal-subtitle">${n.tag} · ${n.type}</div>
          <div class="modal-title">${n.name}</div>
        </div>
      </div>
      <p class="modal-desc">${n.desc}</p>
      <div class="modal-stats-grid">
        <div class="mstat"><span class="mstat-label">DISTANCE FROM EARTH</span><span class="mstat-value">${n.lightYears}</span></div>
        <div class="mstat"><span class="mstat-label">DIAMETER</span><span class="mstat-value">${n.diameter}</span></div>
        <div class="mstat"><span class="mstat-label">TEMPERATURE</span><span class="mstat-value">${n.temperature}</span></div>
        <div class="mstat"><span class="mstat-label">MASS</span><span class="mstat-value">${n.mass}</span></div>
        <div class="mstat"><span class="mstat-label">VISIBILITY</span><span class="mstat-value">${n.visibility}</span></div>
        <div class="mstat"><span class="mstat-label">COMPOSITION</span><span class="mstat-value">${n.composition}</span></div>
      </div>
      <div class="modal-section-title">NOTABLE FACT</div>
      <p class="modal-desc" style="font-size:0.9rem">${n.notableFact}</p>`;

  } else if (type === 'constellation') {
    const c = CONSTELLATIONS.find(x => x.id === id);
    const starsHtml = c.notableStars.map(s => `
      <div class="modal-bar-item" style="align-items:flex-start">
        <span class="modal-bar-label">★</span>
        <span class="modal-bar-val" style="color:var(--muted2);min-width:0;text-align:left;flex:1">${s}</span>
      </div>`).join('');

    html = `
      <div class="modal-header">
        <div class="modal-icon">${c.emoji}</div>
        <div class="modal-title-block">
          <div class="modal-subtitle">${c.tag} · ${c.region} SKY</div>
          <div class="modal-title">${c.name}</div>
        </div>
      </div>
      <p class="modal-desc">${c.desc}</p>
      <div class="modal-stats-grid">
        <div class="mstat"><span class="mstat-label">DISTANCE RANGE</span><span class="mstat-value">${c.distanceRange}</span></div>
        <div class="mstat"><span class="mstat-label">BRIGHTEST STAR</span><span class="mstat-value">${c.brightestStar.split('—')[0].trim()}</span></div>
        <div class="mstat"><span class="mstat-label">BEST VIEWED</span><span class="mstat-value">${c.bestViewed}</span></div>
        <div class="mstat"><span class="mstat-label">SKY AREA</span><span class="mstat-value">${c.area}</span></div>
        <div class="mstat"><span class="mstat-label">REGION</span><span class="mstat-value">${c.region}</span></div>
      </div>
      <div class="modal-section-title">NOTABLE STARS</div>
      ${starsHtml}
      <div class="modal-section-title" style="margin-top:1.5rem">DEEP SKY OBJECTS</div>
      <p class="modal-desc" style="margin-bottom:1.5rem;font-size:0.9rem">${c.deepSkyObjects}</p>
      <div class="modal-section-title">MYTHOLOGY</div>
      <p class="modal-desc" style="font-size:0.9rem">${c.mythology}</p>`;
  }

  content.innerHTML = html;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.modal-bar-fill').forEach(el => {
      const w = el.style.width;
      el.style.width = '0';
      setTimeout(() => el.style.width = w, 50);
    });
  }, 100);
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target.id === 'modal-overlay') closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ── ACTIVE NAV ON SCROLL ──
const sections = document.querySelectorAll('.section, #hero');
const navLinks = document.querySelectorAll('.nav-link');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(l => {
        l.style.color = l.dataset.section === id ? 'var(--accent)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObs.observe(s));
