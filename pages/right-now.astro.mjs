import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_AE1iOT-f.mjs';
import 'piccolore';
import { $ as $$Base, a as $$Stage, u as url, t } from '../chunks/Stage_Z6rpMDn0.mjs';
import { $ as $$Next } from '../chunks/Next_CB9o7_Ld.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$RightNow = createComponent(($$result, $$props, $$slots) => {
  const c = t();
  const n = c.now;
  return renderTemplate`<!-- The page for tonight. It moves like the others, but its reading passages
     scroll heavy and slow (data-dim), so nothing here hurries anybody. -->${renderComponent($$result, "Base", $$Base, { "title": c.nav.rightNow, "seo": "Right now, tonight: cutting down, one step at a time", "description": "Not ready to stop? Safer than last week is a real thing to aim at. Small steps for cutting down tonight, and a free number that answers at any hour in India: 14446.", "top": "ink", "data-astro-cid-walffhu2": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Stage", $$Stage, { "shots": ["bedroom", "stairs-2", "coffee"], "data-astro-cid-walffhu2": true })} ${maybeRenderHead()}<section class="scene s-hero-scene" data-theme="ink" data-shot="bedroom" aria-labelledby="rn-t" data-astro-cid-walffhu2> <div class="s-in" data-astro-cid-walffhu2> <p class="tc rv" data-astro-cid-walffhu2>${n.eyebrow}</p> <h1 id="rn-t" class="s-hero rv" style="--d:1" data-astro-cid-walffhu2>${n.title.replace(".", "")}<span class="dot" data-astro-cid-walffhu2>.</span></h1> <p class="s-lede rv" style="--d:2" data-astro-cid-walffhu2>${n.lede}</p> </div> </section> <section class="scene s-scene steps" data-theme="ink" data-shot="stairs-2" data-dim aria-labelledby="steps-t" data-astro-cid-walffhu2> <div class="s-in steps__grid" data-astro-cid-walffhu2> <header class="steps__head" data-astro-cid-walffhu2> <p class="tc rv" data-astro-cid-walffhu2>${n.notReadyLabel}</p> <h2 id="steps-t" class="s-title rv" style="--d:1" data-astro-cid-walffhu2>${n.notReadyTitle}</h2> <p class="steps__intro rv" style="--d:2" data-astro-cid-walffhu2>${n.notReadyBody}</p> </header> <div class="steps__pane glass" data-astro-cid-walffhu2> <ol class="steps__list" data-astro-cid-walffhu2> ${n.notReadyPoints.map((pt, i) => renderTemplate`<li class="rv" data-astro-cid-walffhu2> <span class="steps__n" aria-hidden="true" data-astro-cid-walffhu2>${String(i + 1).padStart(2, "0")}</span> <p data-astro-cid-walffhu2>${pt}</p> </li>`)} </ol> <p class="steps__src" data-astro-cid-walffhu2>${n.notReadySource}</p> </div> </div> </section> <section class="scene s-scene tonight" data-theme="ink" data-shot="coffee" data-heavy aria-labelledby="tn-t" data-astro-cid-walffhu2> <div class="s-in tonight__in" data-astro-cid-walffhu2> <p class="tc tc--c rv" data-astro-cid-walffhu2>${n.tonightLabel}</p> <h2 id="tn-t" class="s-title tonight__t rv" style="--d:1" data-astro-cid-walffhu2>${n.tonightTitle}</h2> <p class="s-lede tonight__body rv" style="--d:2" data-astro-cid-walffhu2>${n.tonightBody}</p> <a class="tonight__num glass rv" style="--d:3" href="tel:14446" data-astro-cid-walffhu2> <span class="label" data-astro-cid-walffhu2>Tomorrow, or whenever</span> <span class="tonight__n" data-astro-cid-walffhu2><span class="dg" data-astro-cid-walffhu2>1</span><span class="dg" data-astro-cid-walffhu2>4</span><span class="dg" data-astro-cid-walffhu2>4</span><span class="dg" data-astro-cid-walffhu2>4</span><span class="dg" data-astro-cid-walffhu2>6</span></span> <span class="tonight__small" data-astro-cid-walffhu2>Free · any hour · no name needed</span> </a> </div> </section> ${renderComponent($$result2, "Next", $$Next, { "href": url("what-happens"), "label": "Next", "title": c.nav.whatHappens, "img": "/img/papers-800.webp", "data-astro-cid-walffhu2": true })} ` })} `;
}, "E:/Claude Project/Websites/Site/src/pages/right-now.astro", void 0);

const $$file = "E:/Claude Project/Websites/Site/src/pages/right-now.astro";
const $$url = "/right-now.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RightNow,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
