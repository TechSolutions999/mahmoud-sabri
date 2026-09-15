(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.getElementById("loader");
  const count = document.getElementById("loaderCount");
  const bar = document.getElementById("loaderBar");
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function boot() {
    if (reduced) {
      loader.style.display = "none";
      document.body.classList.remove("loading");
      return;
    }
    const obj = { n: 0 };
    gsap.to(obj, {
      n: 100,
      duration: 1.35,
      ease: "power2.inOut",
      onUpdate() {
        const v = Math.round(obj.n);
        count.textContent = pad(v);
        bar.style.width = v + "%";
      },
      onComplete() {
        gsap.to(loader, {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
          onComplete() {
            loader.remove();
            document.body.classList.remove("loading");
          },
        });
        intro();
      },
    });
  }

  function intro() {
    if (!window.gsap) return;
    gsap.from(".reveal", {
      y: 48,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: "power4.out",
    });
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 86%" },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    });
  }

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    boot();
  } else {
    loader.style.display = "none";
    document.body.classList.remove("loading");
  }

  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  function setMenu(open) {
    links.classList.toggle("open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open);
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!links.classList.contains("open"));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => setMenu(false))
  );
  document.addEventListener("click", (e) => {
    if (!links.classList.contains("open")) return;
    if (!nav.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) setMenu(false);
  });

  if (!reduced && cursor && ring && window.matchMedia("(pointer:fine)").matches) {
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";
    });
    function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });
  }
})();
