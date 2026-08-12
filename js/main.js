(() => {
  const body = document.body;
  const loader = document.getElementById("loader");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobMenu = document.getElementById("mob-menu");
  const year = document.getElementById("year");
  const marquee = document.getElementById("marquee");
  const form = document.getElementById("wa-form");
  const canvas = document.getElementById("hero-canvas");

  body.classList.add("loading");
  if (year) year.textContent = new Date().getFullYear();

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
      body.classList.remove("loading");
    }, 2100);
  });

  const setNavState = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 18);
  };

  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  hamburger?.addEventListener("click", () => {
    const isOpen = mobMenu?.classList.toggle("is-open");
    hamburger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  mobMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobMenu.classList.remove("is-open");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  if (marquee) {
    const items = [
      "software para restaurantes",
      "punto de venta",
      "comandas moviles",
      "impresoras y equipo POS",
      "gestion y control",
      "mas de 40 anos de experiencia"
    ];
    marquee.innerHTML = [...items, ...items, ...items, ...items]
      .map((item) => `<span>${item}</span>`)
      .join("");
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px" });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const animateNumber = (el) => {
    const target = Number(el.dataset.count || 0);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value.toLocaleString("es-MX")}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach(animateNumber);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  const stats = document.getElementById("stats");
  if (stats) statsObserver.observe(stats);

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("f-name");
    const interest = document.getElementById("f-interest");
    const msg = document.getElementById("f-msg");

    if (!name.value.trim() || !msg.value.trim()) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola, visite la pagina de Compured Company y quiero informacion.",
      `Nombre: ${name.value.trim()}`,
      `Interes: ${interest.value}`,
      `Detalle: ${msg.value.trim()}`
    ].join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(42, Math.min(110, Math.floor(width / 12)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + .6,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        hue: Math.random() > .55 ? "255,106,0" : "114,80,216"
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue}, .62)`;
        ctx.fill();

        for (let i = index + 1; i < particles.length; i += 1) {
          const next = particles[i];
          const dx = p.x - next.x;
          const dy = p.y - next.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 118) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = `rgba(255,255,255, ${.12 * (1 - distance / 118)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      if (!reduceMotion) requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
  }
})();
