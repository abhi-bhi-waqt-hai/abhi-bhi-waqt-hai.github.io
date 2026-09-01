import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server.DGswJgvN.js';
import 'piccolore';
import 'html-escaper';
import 'clsx';
import { existsSync } from 'node:fs';
import path from 'node:path';
/* empty css                            */

const $$Astro = createAstro("https://abhi-bhi-waqt-hai.github.io");
const $$Onward = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Onward;
  const { kicker, title, href, media, ground = "ink" } = Astro2.props;
  const IMG = path.resolve("public/images");
  const pick = (s) => ground === "paper" && existsSync(path.join(IMG, `${s}-paper.webp`)) ? `${s}-paper` : s;
  const thumb = media ? pick(media) : media;
  return renderTemplate`${maybeRenderHead()}<nav class="onward wrap-full"${addAttribute(kicker, "aria-label")} data-sc-act="flow" data-astro-cid-ku42eia4> <a${addAttribute(["onward__link", { "onward__link--media": media }], "class:list")}${addAttribute(href, "href")} data-astro-cid-ku42eia4> ${/* aria-hidden, empty alt. The link text below already names the
  destination; a screen reader does not need it twice. */
  media && renderTemplate`<span class="onward__thumb" aria-hidden="true" data-astro-cid-ku42eia4> <img${addAttribute(`/images/${thumb}-640w.webp`, "src")} alt="" width="640" height="360" loading="lazy" decoding="async" data-astro-cid-ku42eia4> </span>`} <span class="onward__copy" data-astro-cid-ku42eia4> <span class="onward__k" data-astro-cid-ku42eia4>${kicker}</span> <span class="onward__t" data-sc-focus data-astro-cid-ku42eia4>${title}</span> </span> <svg class="onward__arrow" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false" data-astro-cid-ku42eia4> <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ku42eia4></path> </svg> </a> </nav> `;
}, "E:/Claude Project/reboot/src/components/Onward.astro", void 0);

export { $$Onward as $ };
