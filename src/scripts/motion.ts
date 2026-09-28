// Scroll and reveal animations driven by data attributes.
//
//   data-reveal="up" | "fade" | "clip"   reveal when entering the viewport
//   data-delay="0.2"                      optional delay in seconds
//   data-lines                            stagger children `.line > span` upward
//   data-parallax="0.15"                  move vertically while scrolling (fraction of height)
//   data-count="1500"                     count up to the value (data-suffix optional);
//                                         keep the final value as text so it works without JS

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initSmoothScroll(): Lenis {
  const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href") ?? "");
      if (!(target instanceof HTMLElement)) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });

  document.addEventListener("scroll:lock", () => lenis.stop());
  document.addEventListener("scroll:unlock", () => lenis.start());

  return lenis;
}

function initReveals() {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    const type = el.dataset["reveal"] ?? "up";
    const delay = Number(el.dataset["delay"] ?? 0);
    const scrollTrigger = { trigger: el, start: "top 88%", once: true };

    if (type === "clip") {
      gsap.fromTo(
        el,
        { opacity: 1, clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", delay, scrollTrigger },
      );
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: type === "up" ? 48 : 0 },
      { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay, scrollTrigger },
    );
  });
}

function initLines() {
  gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
    const lines = el.querySelectorAll(".line > span");
    gsap.fromTo(lines, { y: 0, yPercent: 110 }, {
      y: 0,
      yPercent: 0,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.09,
      delay: Number(el.dataset["delay"] ?? 0),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

function initParallax() {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset["parallax"] ?? 0.15) * 100;
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}

function initCounters() {
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset["count"]);
    const suffix = el.dataset["suffix"] ?? "";
    const counter = { value: 0 };
    const formatter = new Intl.NumberFormat("es-AR");

    gsap.to(counter, {
      value: target,
      duration: 2,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = `${formatter.format(Math.round(counter.value))}${suffix}`;
      },
    });
  });
}

function initStackedCards() {
  const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
  cards.forEach((card, index) => {
    if (index === cards.length - 1) return;
    gsap.to(card, {
      scale: 0.92,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: cards[index + 1]!,
        start: "top bottom",
        end: "top 20%",
        scrub: true,
      },
    });
  });
}

if (!prefersReducedMotion) {
  initSmoothScroll();
  initReveals();
  initLines();
  initParallax();
  initCounters();
  if (window.matchMedia("(min-width: 768px)").matches) initStackedCards();
}
