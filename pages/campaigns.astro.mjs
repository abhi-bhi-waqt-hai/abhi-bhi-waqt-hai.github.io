import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_AE1iOT-f.mjs';
import 'piccolore';
import { $ as $$Base, a as $$Stage, u as url, t } from '../chunks/Stage_Z6rpMDn0.mjs';
import { $ as $$Next } from '../chunks/Next_CB9o7_Ld.mjs';
import { $ as $$Exhibit } from '../chunks/Exhibit_Bivlznld.mjs';
import { P as PHOTOS } from '../chunks/photos_15vzgesM.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Campaigns = createComponent(($$result, $$props, $$slots) => {
  const c = t();
  const C = c.campaigns;
  const FILLED = 38;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": c.nav.campaigns, "seo": "Nasha Mukt Bharat Abhiyaan and the government campaigns", "description": C.lede, "top": "ink", "data-astro-cid-zlik6llr": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Stage", $$Stage, { "shots": ["ground", "hall", "hall-2", "ground-2"], "data-astro-cid-zlik6llr": true })} ${maybeRenderHead()}<section class="scene s-hero-scene" data-theme="ink" data-shot="ground" aria-labelledby="cp-t" data-astro-cid-zlik6llr> <div class="s-in" data-astro-cid-zlik6llr> <p class="tc rv" data-astro-cid-zlik6llr>${C.eyebrow}</p> <h1 id="cp-t" class="s-hero rv" style="--d:1" data-astro-cid-zlik6llr>${C.title.replace(".", "")}<span class="dot" data-astro-cid-zlik6llr>.</span></h1> <p class="s-lede rv" style="--d:2" data-astro-cid-zlik6llr>${C.lede}</p> </div> </section> ${C.items.map((p) => renderTemplate`<section${addAttribute(p.id, "id")} class="scene s-scene prog" data-theme="ink" data-shot="hall" data-dim${addAttribute(`${p.id}-t`, "aria-labelledby")} data-astro-cid-zlik6llr> <div class="s-in prog__grid" data-astro-cid-zlik6llr> <div class="prog__main" data-astro-cid-zlik6llr> <p class="tc rv" data-astro-cid-zlik6llr>The programme</p> <h2${addAttribute(`${p.id}-t`, "id")} class="s-title prog__name rv" style="--d:1" data-astro-cid-zlik6llr>${p.name}</h2> <p class="prog__search rv" style="--d:2" data-astro-cid-zlik6llr><span class="label" data-astro-cid-zlik6llr>${C.searchLabel}</span><span class="prog__q" data-astro-cid-zlik6llr>“${p.search}”</span></p> <p class="prog__what rv" style="--d:3" data-astro-cid-zlik6llr>${p.what}</p> </div> <aside class="prog__card glass rv" style="--d:2" data-astro-cid-zlik6llr> <p class="prog__fig" data-astro-cid-zlik6llr>${p.figure}</p> <p class="prog__figl" data-astro-cid-zlik6llr>${p.figureLabel}</p> <dl class="prog__meta" data-astro-cid-zlik6llr> <div data-astro-cid-zlik6llr><dt class="label" data-astro-cid-zlik6llr>${C.sinceLabel}</dt><dd data-astro-cid-zlik6llr>${p.since}</dd></div> <div data-astro-cid-zlik6llr><dt class="label" data-astro-cid-zlik6llr>${C.runLabel}</dt><dd data-astro-cid-zlik6llr>${p.run}</dd></div> </dl> <p class="prog__note" data-astro-cid-zlik6llr>${C.note}</p> </aside> </div> </section>`)} <section id="record" class="scene s-scene record" data-theme="ink" data-shot="hall" data-dim aria-labelledby="record-t" data-astro-cid-zlik6llr> <div class="s-in" data-astro-cid-zlik6llr> <p class="tc rv" data-astro-cid-zlik6llr>In the public record</p> <h2 id="record-t" class="sr" data-astro-cid-zlik6llr>In the public record</h2> <div class="exhibits" data-astro-cid-zlik6llr> ${renderComponent($$result2, "Exhibit", $$Exhibit, { "photo": PHOTOS.run2018, "data-astro-cid-zlik6llr": true })} ${renderComponent($$result2, "Exhibit", $$Exhibit, { "photo": PHOTOS.runGate, "data-astro-cid-zlik6llr": true })} </div> </div> </section>  <section id="reach" class="scene s-scene reach" data-theme="ink" data-shot="hall-2" data-dim aria-labelledby="reach-t" data-astro-cid-zlik6llr> <div class="s-in reach__grid" data-astro-cid-zlik6llr> <div data-astro-cid-zlik6llr> <p class="tc rv" data-astro-cid-zlik6llr>${C.reachLabel}</p> <h2 id="reach-t" class="s-title reach__t rv" style="--d:1" data-astro-cid-zlik6llr>${C.reachStatement}</h2> <p class="reach__fig rv" style="--d:2" data-astro-cid-zlik6llr>${C.reachFigure}</p> <p class="reach__cap rv" style="--d:3" data-astro-cid-zlik6llr>${C.reachCaption}</p> </div> <figure class="waffle glass rv" data-dial${addAttribute(`${FILLED} of 100 squares filled`, "aria-label")} data-astro-cid-zlik6llr> <div class="waffle__grid" aria-hidden="true" data-astro-cid-zlik6llr> ${Array.from({ length: 100 }, (_, i) => renderTemplate`<span${addAttribute(i < FILLED ? "on" : "", "class")}${addAttribute(`--i:${i}`, "style")} data-astro-cid-zlik6llr></span>`)} </div> <figcaption class="waffle__cap" data-astro-cid-zlik6llr><b data-astro-cid-zlik6llr>${FILLED}</b> in every 100</figcaption> </figure> </div> </section> <section class="scene s-scene gap" data-theme="ink" data-shot="ground-2" data-dim aria-labelledby="gap-t" data-astro-cid-zlik6llr> <div class="s-in gap__in" data-astro-cid-zlik6llr> <p class="tc tc--c rv" data-astro-cid-zlik6llr>What is not published</p> <h2 id="gap-t" class="sr" data-astro-cid-zlik6llr>What is not published</h2> <p class="gap__t rv" style="--d:1" data-astro-cid-zlik6llr>${C.reachGap}</p> </div> </section> ${renderComponent($$result2, "Next", $$Next, { "href": url("sources"), "label": "Next", "title": c.nav.sources, "img": "/img/archive-800.webp", "data-astro-cid-zlik6llr": true })} ` })} `;
}, "E:/Claude Project/Websites/Site/src/pages/campaigns.astro", void 0);

const $$file = "E:/Claude Project/Websites/Site/src/pages/campaigns.astro";
const $$url = "/campaigns.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Campaigns,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
