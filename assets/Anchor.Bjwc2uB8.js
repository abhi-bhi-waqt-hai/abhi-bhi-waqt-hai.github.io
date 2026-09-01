import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server.DGswJgvN.js';
import 'piccolore';
import 'html-escaper';
import 'clsx';
import { existsSync } from 'node:fs';
import path from 'node:path';
/* empty css                            */

const $$Astro = createAstro("https://abhi-bhi-waqt-hai.github.io");
const $$Anchor = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Anchor;
  const {
    media,
    alt,
    caption,
    motion = true,
    motionPause,
    motionPlay,
    flip = false,
    ground = "ink"
  } = Astro2.props;
  const IMG = path.resolve("public/images");
  const VID = path.resolve("public/video");
  const clipStem = (s) => ground === "paper" && existsSync(path.join(VID, `${s}-paper.mp4`)) ? `${s}-paper` : s;
  const cs = clipStem(media);
  const clip = motion && existsSync(path.join(VID, `${cs}.mp4`)) ? `/video/${cs}.mp4` : null;
  const clipMobile = motion && existsSync(path.join(VID, `${cs}-m.mp4`)) ? `/video/${cs}-m.mp4` : null;
  const pick = (s) => ground === "paper" && existsSync(path.join(IMG, `${s}-paper.webp`)) ? `${s}-paper` : s;
  const shown = pick(media);
  const still = existsSync(path.join(IMG, `${shown}.webp`)) ? `/images/${shown}.webp` : null;
  const srcset = [640, 1024, 1600].filter((w) => existsSync(path.join(IMG, `${shown}-${w}w.webp`))).map((w) => `/images/${shown}-${w}w.webp ${w}w`).join(", ");
  return renderTemplate`${still && renderTemplate`${maybeRenderHead()}<figure${addAttribute(["anc", { "anc--flip": flip }], "class:list")} data-astro-cid-xjstmfzs><div class="anc__glow" aria-hidden="true" data-astro-cid-xjstmfzs></div><div class="anc__frame"${addAttribute(clip ? "" : void 0, "data-breath")} data-astro-cid-xjstmfzs><img class="anc__img"${addAttribute(still, "src")}${addAttribute(srcset || void 0, "srcset")} sizes="(min-width: 62rem) 34vw, 100vw"${addAttribute(alt, "alt")} width="1600" height="900" loading="lazy" decoding="async" data-astro-cid-xjstmfzs>${clip && renderTemplate`<video class="anc__video"${addAttribute(clip, "data-src")}${addAttribute(clipMobile ?? void 0, "data-src-mobile")} muted playsinline disablePictureInPicture controlsList="nodownload noplaybackrate noremoteplayback" preload="none" aria-hidden="true" data-astro-cid-xjstmfzs></video>`}${clip && motionPause && motionPlay && renderTemplate`<button class="anc__motion no-print" type="button" hidden data-motion-toggle data-on="true"${addAttribute(motionPause, "aria-label")}${addAttribute(motionPause, "data-pause-label")}${addAttribute(motionPlay, "data-play-label")} data-astro-cid-xjstmfzs><svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" focusable="false" data-astro-cid-xjstmfzs><rect class="anc__motionPause" x="7" y="5" width="3.4" height="14" rx="1" data-astro-cid-xjstmfzs></rect><rect class="anc__motionPause" x="13.6" y="5" width="3.4" height="14" rx="1" data-astro-cid-xjstmfzs></rect><path class="anc__motionPlay" d="M8 5.2 19 12 8 18.8Z" data-astro-cid-xjstmfzs></path></svg><span class="anc__motionLabel" data-motion-label data-astro-cid-xjstmfzs>${motionPause}</span></button>`}</div>${caption && renderTemplate`<figcaption class="anc__cap" data-astro-cid-xjstmfzs>${caption}</figcaption>`}</figure>`}`;
}, "E:/Claude Project/reboot/src/components/Anchor.astro", void 0);

export { $$Anchor as $ };
