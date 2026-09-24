(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const loader = document.getElementById("loader");
  const count = document.getElementById("loaderCount");
  const bar = document.getElementById("loaderBar");
  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  const CV_URL = "cv/Mahmoud_Sabri_CV.pdf";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function maskWords(el) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.innerHTML = text
      .split(" ")
      .map((word) => `<span class="word"><span>${word}</span></span>`)
      .join("");
    return el.querySelectorAll(".word > span");
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
    const heroSpans = [];
    document.querySelectorAll(".hero-line").forEach((line) => {
      maskWords(line).forEach((span) => heroSpans.push(span));
    });

    const tl = gsap.timeline();
    if (heroSpans.length) {
      tl.from(heroSpans, {
        yPercent: 120,
        duration: 1.05,
        stagger: 0.07,
        ease: "power4.out",
      });
    }
    tl.from(
      ".hero .reveal",
      {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      },
      heroSpans.length ? "-=0.55" : 0
    );

    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 88%" },
        y: 48,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });
    });

    gsap.utils.toArray(".section-head h2, #contact h2").forEach((heading) => {
      const spans = maskWords(heading);
      gsap.from(spans, {
        scrollTrigger: { trigger: heading, start: "top 88%" },
        yPercent: 120,
        duration: 0.9,
        stagger: 0.05,
        ease: "power4.out",
      });
    });

    document.querySelectorAll("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const counter = { n: 0 };
      gsap.to(counter, {
        n: end,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate() {
          el.textContent = Math.round(counter.n) + suffix;
        },
      });
    });

    gsap.utils.toArray(".work-visual img.shot").forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8, scale: 1.14 },
        {
          yPercent: 8,
          scale: 1.14,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".work-card"),
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    });

    gsap.utils.toArray(".stack-card .ico").forEach((ico) => {
      gsap.from(ico, {
        scrollTrigger: { trigger: ico, start: "top 90%" },
        scale: 0.5,
        rotation: -14,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    });

    const progress = document.getElementById("scrollProgress");
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    }

    const track = document.querySelector(".marquee-track");
    if (track) {
      track.style.animation = "none";
      const loop = gsap.to(track, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
      ScrollTrigger.create({
        onUpdate(self) {
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 700, 3.5);
          gsap.to(loop, { timeScale: boost, duration: 0.4, overwrite: true });
        },
      });
    }

    ["work", "stack", "experience", "contact"].forEach((id) => {
      const link = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (!link) return;
      ScrollTrigger.create({
        trigger: "#" + id,
        start: "top 42%",
        end: "bottom 42%",
        onToggle(self) {
          link.classList.toggle("is-on", self.isActive);
        },
      });
    });

    const glow = document.querySelector(".hero-glow");
    const hero = document.querySelector(".hero");
    if (glow && hero && fine) {
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(glow, {
          left: x + "%",
          top: y + "%",
          duration: 1.1,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    }
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
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) setMenu(false);
  });

  const cvModal = document.getElementById("cvModal");
  const cvFrame = document.getElementById("cvFrame");
  const cvPanel = cvModal ? cvModal.querySelector(".cv-panel") : null;
  const cvBackdrop = cvModal ? cvModal.querySelector(".cv-backdrop") : null;

  function openCv() {
    if (!cvModal) return;
    setMenu(false);
    if (cvFrame && !cvFrame.getAttribute("src")) cvFrame.src = CV_URL;
    cvModal.hidden = false;
    document.body.classList.add("cv-open");
    if (window.gsap && !reduced && cvPanel && cvBackdrop) {
      gsap.fromTo(cvBackdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(cvPanel, { y: 36, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power4.out" });
    }
    const closeBtn = cvModal.querySelector(".cv-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeCv() {
    if (!cvModal || cvModal.hidden) return;
    const finish = () => {
      cvModal.hidden = true;
      document.body.classList.remove("cv-open");
    };
    if (window.gsap && !reduced && cvPanel && cvBackdrop) {
      gsap.to(cvBackdrop, { opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(cvPanel, { y: 20, opacity: 0, duration: 0.28, ease: "power3.in", onComplete: finish });
    } else {
      finish();
    }
  }

  document.querySelectorAll("[data-cv-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openCv();
    });
  });
  document.querySelectorAll("[data-cv-close]").forEach((btn) => {
    btn.addEventListener("click", closeCv);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (cvModal && !cvModal.hidden) closeCv();
    else setMenu(false);
  });

  if (!reduced && cursor && ring && fine) {
    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
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

    if (window.gsap) {
      document.querySelectorAll(".magnetic").forEach((btn) => {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * 0.28);
          yTo((e.clientY - (rect.top + rect.height / 2)) * 0.28);
        });
        btn.addEventListener("mouseleave", () => {
          xTo(0);
          yTo(0);
        });
      });
    }
  }
})();
