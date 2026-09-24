import { c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate, d as createAstro } from './astro/server_AE1iOT-f.mjs';
import 'piccolore';
import 'clsx';
/* empty css                             */

const $$Astro = createAstro();
const $$Exhibit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Exhibit;
  const { photo, wide = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<figure${addAttribute(["exhibit rv", { "exhibit--wide": wide }], "class:list")} data-astro-cid-4ybxgzm3> <div class="exhibit__print" data-astro-cid-4ybxgzm3> <img${addAttribute(`${photo.src}${wide ? "" : "-800"}.webp`, "src")}${addAttribute(`${photo.src}-800.webp 800w, ${photo.src}.webp 1600w`, "srcset")}${addAttribute(wide ? "(max-width: 52rem) 100vw, 60rem" : "(max-width: 52rem) 100vw, 36rem", "sizes")}${addAttribute(photo.alt, "alt")}${addAttribute(photo.w, "width")}${addAttribute(photo.h, "height")} loading="lazy" decoding="async" data-astro-cid-4ybxgzm3> <span class="exhibit__tag" data-astro-cid-4ybxgzm3>Real photograph</span> </div> <figcaption data-astro-cid-4ybxgzm3> <p class="exhibit__cap" data-astro-cid-4ybxgzm3>${photo.caption}</p> <p class="exhibit__credit" data-astro-cid-4ybxgzm3>${photo.who} · ${photo.licence} · <a${addAttribute(photo.url, "href")} rel="noopener noreferrer" data-astro-cid-4ybxgzm3>original <span aria-hidden="true" data-astro-cid-4ybxgzm3>↗</span></a></p> </figcaption> </figure> `;
}, "E:/Claude Project/Websites/Site/src/components/Exhibit.astro", void 0);

export { $$Exhibit as $ };
