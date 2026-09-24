import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_AE1iOT-f.mjs';
import 'piccolore';
import { $ as $$Base, t, a as $$Stage, u as url } from '../chunks/Stage_Z6rpMDn0.mjs';
import { $ as $$Next } from '../chunks/Next_CB9o7_Ld.mjs';
import { readdirSync } from 'node:fs';
import path from 'node:path';
/* empty css                                   */
export { renderers } from '../renderers.mjs';

const $$Credits = createComponent(($$result, $$props, $$slots) => {
  const c = t();
  const C = c.credits;
  const P = C.person;
  const pages = readdirSync(path.resolve("src/pages")).filter((f) => f.endsWith(".astro")).length;
  const sources = c.sources.groups.reduce((n, g) => n + g.rows.length, 0) + 1;
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  const role = P.role.map((r) => r.replace(/\bnine pages\b/, `${words[pages] ?? pages} pages`));
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": c.nav.credits, "description": "Who made \u0905\u092D\u0940 \u092D\u0940 \u0935\u0915\u093C\u094D\u0924 \u0939\u0948: a school project by Badriprasath K.V, Grade 8, Erode, Tamil Nadu, for STOGO Fest 2026-27.", "top": "ink", "data-astro-cid-cak72j2b": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Stage", $$Stage, { "shots": ["projector", "projector-2", "hall"], "data-astro-cid-cak72j2b": true })} ${maybeRenderHead()}<section class="scene s-hero-scene" data-theme="ink" data-shot="projector" aria-labelledby="cr-t" data-astro-cid-cak72j2b> <div class="s-in" data-astro-cid-cak72j2b> <p class="tc rv" data-astro-cid-cak72j2b>${C.eyebrow}</p> <h1 id="cr-t" class="s-hero cr-hero rv" style="--d:1" data-astro-cid-cak72j2b>${C.title.replace(".", "")}<span class="dot" data-astro-cid-cak72j2b>.</span></h1> <p class="s-lede rv" style="--d:2" data-astro-cid-cak72j2b>${C.lede}</p> </div> </section> <section id="made-by" class="scene s-scene person" data-theme="ink" data-shot="projector-2" data-dim aria-labelledby="person-t" data-astro-cid-cak72j2b> <div class="s-in person__grid" data-astro-cid-cak72j2b> <!-- The portrait is being redone; until then the frame says so. --> <figure class="portrait rv" aria-label="Portrait in progress" data-astro-cid-cak72j2b> <div class="portrait__wip" data-astro-cid-cak72j2b> <span class="portrait__dot" aria-hidden="true" data-astro-cid-cak72j2b></span> <span class="portrait__t" data-astro-cid-cak72j2b>In Progress</span> </div> </figure> <div class="person__body" data-astro-cid-cak72j2b> <p class="tc rv" data-astro-cid-cak72j2b>${C.peopleLabel}</p> <h2 id="person-t" class="person__name rv" style="--d:1" data-astro-cid-cak72j2b>${P.name}</h2> <p class="person__what rv" style="--d:2" data-astro-cid-cak72j2b>${P.what} · ${C.peopleTitle}</p> <div class="s-read person__role" data-astro-cid-cak72j2b>${role.map((r, i) => renderTemplate`<p class="rv"${addAttribute(`--d:${i + 2}`, "style")} data-astro-cid-cak72j2b>${r}</p>`)}</div> <dl class="facts rv" data-astro-cid-cak72j2b> ${P.facts.map((f) => renderTemplate`<div data-astro-cid-cak72j2b><dt class="label" data-astro-cid-cak72j2b>${f.k}</dt><dd data-astro-cid-cak72j2b>${f.v}</dd></div>`)} </dl> <p class="stats rv" data-astro-cid-cak72j2b> <span data-astro-cid-cak72j2b><b data-astro-cid-cak72j2b>${pages}</b> ${C.stats.pages}</span> <span data-astro-cid-cak72j2b><b data-astro-cid-cak72j2b>${sources}</b> ${C.stats.sources}</span> </p> </div> </div> </section>  <section id="fest" class="scene s-scene fest" data-theme="ink" data-shot="hall" data-dim aria-labelledby="fest-t" data-astro-cid-cak72j2b> <div class="s-in fest__in" data-astro-cid-cak72j2b> <p class="tc tc--c rv" data-astro-cid-cak72j2b>${C.festLabel}</p> <h2 id="fest-t" class="s-title fest__t rv" style="--d:1" data-astro-cid-cak72j2b>${C.festTitle}</h2> <div class="fest__body" data-astro-cid-cak72j2b>${C.festBody.map((p) => renderTemplate`<p class="rv" data-astro-cid-cak72j2b>${p}</p>`)}</div> <dl class="roll" data-astro-cid-cak72j2b> ${C.fest.map((f, i) => renderTemplate`<div class="rv"${addAttribute(`--d:${i}`, "style")} data-astro-cid-cak72j2b><dt data-astro-cid-cak72j2b>${f.k}</dt><dd data-astro-cid-cak72j2b>${f.v}</dd></div>`)} </dl> <a class="fest__link rv"${addAttribute(`https://${C.festLink}`, "href")} rel="noopener noreferrer" data-astro-cid-cak72j2b>${C.festLink} <span aria-hidden="true" data-astro-cid-cak72j2b>↗</span></a> </div> </section> ${renderComponent($$result2, "Next", $$Next, { "href": url(""), "label": "Back to the start", "title": c.nav.home, "img": "/img/courtyard-800.webp", "data-astro-cid-cak72j2b": true })} ` })} `;
}, "E:/Claude Project/Websites/Site/src/pages/credits.astro", void 0);

const $$file = "E:/Claude Project/Websites/Site/src/pages/credits.astro";
const $$url = "/credits.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Credits,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
