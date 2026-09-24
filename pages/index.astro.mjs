import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_AE1iOT-f.mjs';
import 'piccolore';
import { $ as $$Base, a as $$Stage, u as url, t } from '../chunks/Stage_Z6rpMDn0.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const c = t();
  const frames = [
    { shot: "terrace", time: "05:58" },
    { shot: "verandah", time: "06:20" },
    { shot: "jaali", time: "07:05" },
    { shot: "window", time: "07:40" }
  ];
  const shots = ["courtyard", "terrace", "verandah", "jaali", "window", "phone", "coffee"];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "top": "ink", "seo": "Free, confidential help to stop using in India \xB7 14446", "description": "Using, and scared of what happens if you tell someone? In India, Section 64A of the NDPS Act protects a person who volunteers for de-addiction treatment. Free helpline 14446, any hour, no name needed. Nothing here is saved.", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Stage", $$Stage, { "shots": shots, "film": true, "data-astro-cid-j7pv25f6": true })}  ${maybeRenderHead()}<section class="scene open" data-theme="ink" data-shot="courtyard" data-time="23:47" data-label="Scene 00 · Tonight" aria-labelledby="site-title" data-astro-cid-j7pv25f6> <div class="open__in" data-astro-cid-j7pv25f6> <p class="label open__eyebrow" data-astro-cid-j7pv25f6>${c.title.eyebrow}</p> <h1 id="site-title" class="open__title" data-astro-cid-j7pv25f6> <span lang="hi" class="open__hi" data-astro-cid-j7pv25f6>${c.meta.title}</span> <span class="open__en" data-astro-cid-j7pv25f6>${c.meta.tagline.split(" ").map((w, i) => renderTemplate`<span class="w"${addAttribute(`--i:${i}`, "style")} data-astro-cid-j7pv25f6>${w} </span>`)}</span> </h1> <p class="open__lede" data-astro-cid-j7pv25f6>${c.title.lede}</p> <div class="open__acts" data-astro-cid-j7pv25f6> <a class="btn"${addAttribute(`#${c.chapters[0].id}`, "href")} data-astro-cid-j7pv25f6>${c.title.enter} <span class="arr" data-astro-cid-j7pv25f6>↓</span></a> <a class="btn btn--ghost" href="#the-number" data-astro-cid-j7pv25f6>${c.title.enterQuiet}</a> </div> </div> <p class="open__cue label" aria-hidden="true" data-astro-cid-j7pv25f6>Scroll</p> </section>  ${c.chapters.map((ch, i) => renderTemplate`<article${addAttribute(ch.id, "id")} class="scene chap" data-theme="ink" data-heavy${addAttribute(frames[i].shot, "data-shot")}${addAttribute(frames[i].time, "data-time")}${addAttribute(`Scene 0${i + 1} \xB7 ${ch.kicker}`, "data-label")}${addAttribute(`${ch.id}-t`, "aria-labelledby")} data-astro-cid-j7pv25f6> <div class="chap__in" data-astro-cid-j7pv25f6> <p class="tc rv" data-astro-cid-j7pv25f6>${frames[i].time} · ${ch.folio} — ${ch.kicker}</p> <h2${addAttribute(`${ch.id}-t`, "id")} class="chap__t rv" style="--d:1" data-astro-cid-j7pv25f6>${ch.title}</h2> <div class="chap__body" data-astro-cid-j7pv25f6> ${ch.body.map((p, j) => renderTemplate`<p class="rv"${addAttribute(`--d:${j}`, "style")} data-astro-cid-j7pv25f6>${p}</p>`)} ${ch.pull && renderTemplate`<blockquote class="pull rv" data-astro-cid-j7pv25f6><p data-astro-cid-j7pv25f6>${ch.pull}</p></blockquote>`} ${ch.id === "the-fear" && renderTemplate`<p class="rv" data-astro-cid-j7pv25f6><a class="btn btn--ghost"${addAttribute(url("what-happens"), "href")} data-astro-cid-j7pv25f6>What the Act actually says <span class="arr" data-astro-cid-j7pv25f6>→</span></a></p>`} </div> <p class="chap__cap label" data-astro-cid-j7pv25f6>${ch.caption}</p> </div> </article>`)} <section id="the-number" class="scene num" data-theme="ink" data-shot="phone" data-time="07:52" data-label="Scene 05 · The number" aria-labelledby="num-t" data-astro-cid-j7pv25f6> <div class="num__in" data-astro-cid-j7pv25f6> <p class="tc tc--c rv" data-astro-cid-j7pv25f6>Any hour · ${c.close.eyebrow}</p> <h2 id="num-t" class="num__t rv" style="--d:1" data-astro-cid-j7pv25f6>${c.close.title}</h2> <a class="dial" href="tel:14446" data-dial aria-label="Call 14446" data-astro-cid-j7pv25f6> ${"14446".split("").map((d, i) => renderTemplate`<span class="dial__d dg"${addAttribute(`--n:${d};--i:${i}`, "style")} aria-hidden="true" data-astro-cid-j7pv25f6><span data-astro-cid-j7pv25f6>${"0123456789".split("").map((x) => renderTemplate`<i data-astro-cid-j7pv25f6>${x}</i>`)}</span></span>`)} </a> <p class="label num__label rv" data-astro-cid-j7pv25f6>${c.close.numberLabel}</p> <p class="num__body rv" style="--d:1" data-astro-cid-j7pv25f6>${c.close.body}</p> <p class="num__note rv" style="--d:2" data-astro-cid-j7pv25f6>${c.close.note}</p> </div> </section>  <section class="scene dawn" data-theme="paper" data-shot="coffee" data-time="08:10" data-label="Scene 06 · Morning" aria-labelledby="dawn-t" data-astro-cid-j7pv25f6> <div class="dawn__in" data-astro-cid-j7pv25f6> <p class="tc rv" data-astro-cid-j7pv25f6>08:10 · Morning</p> <h2 id="dawn-t" class="dawn__t rv" style="--d:1" data-astro-cid-j7pv25f6>${c.title.line}</h2> <div class="dawn__acts rv" style="--d:2" data-astro-cid-j7pv25f6> <a class="btn"${addAttribute(url("right-now"), "href")} data-astro-cid-j7pv25f6>${c.nav.rightNow} <span class="arr" data-astro-cid-j7pv25f6>→</span></a> <a class="btn btn--ghost"${addAttribute(url("what-happens"), "href")} data-astro-cid-j7pv25f6>${c.nav.whatHappens} <span class="arr" data-astro-cid-j7pv25f6>→</span></a> </div> </div> </section> ` })} `;
}, "E:/Claude Project/Websites/Site/src/pages/index.astro", void 0);

const $$file = "E:/Claude Project/Websites/Site/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
