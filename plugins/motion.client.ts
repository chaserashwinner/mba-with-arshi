/**
 * Motion directives — one small, dependency-free animation system for the site.
 *
 *  v-reveal       Scroll-triggered entrance (fade-up / fade / left / right / scale / mask).
 *                 `v-reveal="{ stagger: true }"` staggers the element's direct children.
 *  v-split-words  Word-by-word mask reveal for headings. Text stays real, selectable DOM text.
 *  v-magnetic     Subtle magnetic pull for primary CTAs (fine pointers only).
 *
 * Everything is driven by ONE shared IntersectionObserver and CSS transitions on
 * transform/opacity, so no animation runs while an element is off-screen and the
 * main thread stays free. With `prefers-reduced-motion`, nothing is hidden or moved.
 */
import type { Directive, DirectiveBinding } from 'vue';
import { hasFinePointer, prefersReducedMotion } from '~/composables/useScrollAnimation';

type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'scale' | 'mask';

interface RevealOptions {
  variant?: RevealVariant;
  /** Base delay in ms. */
  delay?: number;
  /** Stagger direct children. `true` uses the default step, a number sets it (ms). */
  stagger?: boolean | number;
}

interface SplitOptions {
  delay?: number;
  /** ms between words */
  step?: number;
  /** Reveal on mount instead of on scroll (used by the hero). */
  immediate?: boolean;
}

interface MagneticOptions {
  /** Max travel in px. */
  strength?: number;
}

const isSmallScreen = () => window.matchMedia('(max-width: 640px)').matches;

/* ───────── Shared IntersectionObserver ───────── */

let observer: IntersectionObserver | null = null;

const REVEAL_CLASSES = /^(reveal|reveal-group|reveal-item|is-revealed)(--.+)?$/;

/** After the entrance has played, hand the element back to its component styles. */
function cleanup(el: HTMLElement) {
  const strip = (node: HTMLElement) => {
    Array.from(node.classList)
      .filter((c) => REVEAL_CLASSES.test(c))
      .forEach((c) => node.classList.remove(c));
    node.style.removeProperty('--reveal-delay');
  };
  if (el.classList.contains('reveal-group')) {
    Array.from(el.children).forEach((c) => strip(c as HTMLElement));
  }
  strip(el);
  delete el.dataset.revealMax;
}

function reveal(el: Element) {
  const target = el as HTMLElement;
  observer?.unobserve(el);
  target.classList.add('is-revealed');

  // Split-word headings keep their classes (they have no competing transitions).
  if (target.classList.contains('split-words')) return;

  const maxDelay = Number(target.dataset.revealMax || 0);
  const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-slow')) || 720;
  window.setTimeout(() => cleanup(target), maxDelay + duration * 1.4 + 100);
}

function observe(el: Element) {
  if (!('IntersectionObserver' in window)) {
    reveal(el);
    return;
  }
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target);
        }
      },
      // Trigger a little before the element is fully in view; play once.
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );
  }
  observer.observe(el);
}

/* ───────── v-reveal ───────── */

function normaliseReveal(binding: DirectiveBinding<RevealOptions | RevealVariant | undefined>): RevealOptions {
  if (typeof binding.value === 'string') return { variant: binding.value };
  return binding.value || {};
}

const revealDirective: Directive<HTMLElement, RevealOptions | RevealVariant | undefined> = {
  mounted(el, binding) {
    if (prefersReducedMotion()) return;

    const { variant = 'up', delay = 0, stagger } = normaliseReveal(binding);

    if (stagger) {
      const step = typeof stagger === 'number' ? stagger : isSmallScreen() ? 60 : 80;
      el.classList.add('reveal-group', `reveal-group--${variant}`);
      const children = Array.from(el.children) as HTMLElement[];
      children.forEach((item, i) => {
        item.classList.add('reveal-item');
        item.style.setProperty('--reveal-delay', `${delay + i * step}ms`);
      });
      el.dataset.revealMax = String(delay + Math.max(0, children.length - 1) * step);
    } else {
      el.classList.add('reveal', `reveal--${variant}`);
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.dataset.revealMax = String(delay);
    }

    observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};

/* ───────── v-split-words ───────── */

function splitTextNodes(root: HTMLElement, baseDelay: number, step: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  let index = 0;
  for (const node of textNodes) {
    const parts = (node.textContent || '').split(/(\s+)/);
    if (!parts.some((p) => p.trim())) continue;

    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (!part.trim()) {
        frag.appendChild(document.createTextNode(part));
        continue;
      }
      const outer = document.createElement('span');
      outer.className = 'split-word';
      const inner = document.createElement('span');
      inner.className = 'split-word__inner';
      inner.style.setProperty('--word-delay', `${baseDelay + index * step}ms`);
      inner.textContent = part;
      outer.appendChild(inner);
      frag.appendChild(outer);
      index += 1;
    }
    node.replaceWith(frag);
  }
}

const splitWordsDirective: Directive<HTMLElement, SplitOptions | undefined> = {
  mounted(el, binding) {
    if (prefersReducedMotion()) return;
    const { delay = 0, step = isSmallScreen() ? 40 : 55, immediate = false } = binding.value || {};

    splitTextNodes(el, delay, step);
    el.classList.add('split-words');

    if (immediate) {
      // Two frames so the hidden state is painted before transitioning.
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-revealed')));
    } else {
      observe(el);
    }
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};

/* ───────── v-magnetic ───────── */

type MagneticEl = HTMLElement & { __magneticCleanup?: () => void };

const magneticDirective: Directive<MagneticEl, MagneticOptions | undefined> = {
  mounted(el, binding) {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    const strength = binding.value?.strength ?? 8;
    let rect: DOMRect | null = null;
    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    el.setAttribute('data-magnetic', '');

    const apply = () => {
      frame = 0;
      if (!pending || !rect) return;
      const dx = (pending.x - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (pending.y - (rect.top + rect.height / 2)) / (rect.height / 2);
      el.style.setProperty('--mx', `${(Math.max(-1, Math.min(1, dx)) * strength).toFixed(2)}px`);
      el.style.setProperty('--my', `${(Math.max(-1, Math.min(1, dy)) * strength * 0.6).toFixed(2)}px`);
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pending = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    el.__magneticCleanup = () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  },
  unmounted(el) {
    el.__magneticCleanup?.();
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', revealDirective);
  nuxtApp.vueApp.directive('split-words', splitWordsDirective);
  nuxtApp.vueApp.directive('magnetic', magneticDirective);
});
