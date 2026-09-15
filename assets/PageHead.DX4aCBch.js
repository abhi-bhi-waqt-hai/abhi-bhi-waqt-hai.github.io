import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server.DGswJgvN.js';
import 'piccolore';
import 'html-escaper';
import 'clsx';
import { existsSync } from 'node:fs';
import path from 'node:path';
/* empty css                            */

const $$Astro = createAstro("https://abhi-bhi-waqt-hai.github.io");
const $$PageHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageHead;
  const {
    eyebrow,
    title,
    lede,
    media,
    motionPause,
    motionPlay,
    motion = true,
    quiet = false,
    ground = "ink"
  } = Astro2.props;
  const VID = path.resolve("public/video");
  const IMG = path.resolve("public/images");
  const clipStem = (s) => ground === "paper" && existsSync(path.join(VID, `${s}-paper.mp4`)) ? `${s}-paper` : s;
  const cs = media ? clipStem(media) : media;
  const clip = cs && motion && existsSync(path.join(VID, `${cs}.mp4`)) ? `/video/${cs}.mp4` : null;
  const clipMobile = cs && motion && existsSync(path.join(VID, `${cs}-m.mp4`)) ? `/video/${cs}-m.mp4` : null;
  const pick = (s) => ground === "paper" && existsSync(path.join(IMG, `${s}-paper.webp`)) ? `${s}-paper` : s;
  const posterStem = media && existsSync(path.join(IMG, `${media}-poster.webp`)) ? `${media}-poster` : media;
  const stem = posterStem ? pick(posterStem) : posterStem;
  const still = stem && existsSync(path.join(IMG, `${stem}.webp`)) ? `/images/${stem}.webp` : null;
  const srcset = stem ? [640, 1024, 1600, 2400].filter((w) => existsSync(path.join(IMG, `${stem}-${w}w.webp`))).map((w) => `/images/${stem}-${w}w.webp ${w}w`).join(", ") : "";
  return renderTemplate`${maybeRenderHead()}<header${addAttribute(["ph", { "ph--media": still, "ph--quiet": quiet }], "class:list")} data-sc-act="flow"${addAttribute(ground === "paper" ? "#FAF7F2" : "#0f0d0a", "data-sc-drift")}${addAttribute(clip ? "" : void 0, "data-breath")} data-astro-cid-cjp6lpap> ${still && renderTemplate`<div class="ph__visual" aria-hidden="true" data-astro-cid-cjp6lpap> <div class="ph__shot" data-sc-parallax="-0.38" data-astro-cid-cjp6lpap> <img class="ph__image"${addAttribute(still, "src")}${addAttribute(srcset || void 0, "srcset")}${addAttribute(srcset ? "100vw" : void 0, "sizes")} alt="" width="1600" height="900" decoding="async" fetchpriority="high" data-astro-cid-cjp6lpap> ${clip && renderTemplate`<video class="ph__video"${addAttribute(clip, "data-src")}${addAttribute(clipMobile ?? void 0, "data-src-mobile")} muted playsinline disablePictureInPicture controlsList="nodownload noplaybackrate noremoteplayback" preload="none" aria-hidden="true" data-astro-cid-cjp6lpap></video>`} </div> <div class="ph__shade" data-astro-cid-cjp6lpap></div> </div>`} <div class="ph__in wrap-full" data-astro-cid-cjp6lpap> <div class="ph__copy"${addAttribute(quiet ? void 0 : "", "data-sc-focus")} data-astro-cid-cjp6lpap> <p class="ph__eyebrow" data-astro-cid-cjp6lpap>${eyebrow}</p> <h1 class="ph__title" data-astro-cid-cjp6lpap>${title}</h1> <p class="ph__lede" data-astro-cid-cjp6lpap>${lede}</p> </div> </div> ${clip && motionPause && motionPlay && renderTemplate`<button class="ph__motion no-print" type="button" hidden data-motion-toggle data-on="true"${addAttribute(motionPause, "aria-label")}${addAttribute(motionPause, "data-pause-label")}${addAttribute(motionPlay, "data-play-label")} data-astro-cid-cjp6lpap> <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false" data-astro-cid-cjp6lpap> <rect class="ph__motionPause" x="7" y="5" width="3.4" height="14" rx="1" data-astro-cid-cjp6lpap></rect> <rect class="ph__motionPause" x="13.6" y="5" width="3.4" height="14" rx="1" data-astro-cid-cjp6lpap></rect> <path class="ph__motionPlay" d="M8 5.2 19 12 8 18.8Z" data-astro-cid-cjp6lpap></path> </svg> <span class="ph__motionLabel" data-motion-label data-astro-cid-cjp6lpap> ${motionPause} </span> </button>`} <div class="ph__rule" aria-hidden="true" data-astro-cid-cjp6lpap></div> </header> `;
}, "E:/Claude Project/Websites/reboot/src/components/PageHead.astro", void 0);

export { $$PageHead as $ };
