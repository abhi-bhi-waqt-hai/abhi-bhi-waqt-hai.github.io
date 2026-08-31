import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server.DGswJgvN.js';
import 'piccolore';
import 'html-escaper';
import 'clsx';
import { existsSync } from 'node:fs';
import path from 'node:path';
/* empty css                            */

const $$Astro = createAstro("https://astrokvb.github.io");
const $$Plate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Plate;
  const {
    media,
    alt,
    caption,
    motionPause,
    motionPlay,
    motion = true,
    nested = false,
    ground = "ink"
  } = Astro2.props;
  const VID = path.resolve("public/video");
  const IMG = path.resolve("public/images");
  const clipS = ground === "paper" && existsSync(path.join(VID, `${media}-paper.mp4`)) ? `${media}-paper` : media;
  const clip = motion && existsSync(path.join(VID, `${clipS}.mp4`)) ? `/video/${clipS}.mp4` : null;
  const clipMobile = motion && existsSync(path.join(VID, `${clipS}-m.mp4`)) ? `/video/${clipS}-m.mp4` : null;
  const pick = (s) => ground === "paper" && existsSync(path.join(IMG, `${s}-paper.webp`)) ? `${s}-paper` : s;
  const posterStem = existsSync(path.join(IMG, `${media}-poster.webp`)) ? `${media}-poster` : media;
  const stem = pick(posterStem);
  const still = existsSync(path.join(IMG, `${stem}.webp`)) ? `/images/${stem}.webp` : null;
  const srcset = [640, 1024, 1600, 2400].filter((w) => existsSync(path.join(IMG, `${stem}-${w}w.webp`))).map((w) => `/images/${stem}-${w}w.webp ${w}w`).join(", ");
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(["plate", { "plate--type": !still, "plate--still": !motion, "plate--nested": nested }], "class:list")}${addAttribute(clip ? "" : void 0, "data-breath")}${addAttribute(motionPause, "data-motion-pause")}${addAttribute(motionPlay, "data-motion-play")} data-sc-act="flow" data-astro-cid-vz3ba7ul> ${still ? renderTemplate`<div class="plate__in" data-astro-cid-vz3ba7ul> <figure class="plate__fig" data-astro-cid-vz3ba7ul> <div class="plate__frame" data-sc-reveal="up" data-sc-reveal-at="0.04 0.28" data-astro-cid-vz3ba7ul> <div class="plate__mask" data-astro-cid-vz3ba7ul> <div class="plate__shot" data-astro-cid-vz3ba7ul> <img class="plate__img"${addAttribute(still, "src")}${addAttribute(srcset || void 0, "srcset")}${addAttribute(srcset ? "100vw" : void 0, "sizes")}${addAttribute(alt, "alt")} loading="lazy" decoding="async" width="1600" height="900" data-astro-cid-vz3ba7ul> ${clip && renderTemplate`<video class="plate__vid"${addAttribute(clip, "data-src")}${addAttribute(clipMobile ?? void 0, "data-src-mobile")} muted playsinline disablePictureInPicture controlsList="nodownload noplaybackrate noremoteplayback" preload="none" aria-hidden="true" data-astro-cid-vz3ba7ul></video>`} </div> </div>  ${clip && motionPause && motionPlay && renderTemplate`<button class="plate__motion" type="button" hidden data-motion-toggle data-on="true"${addAttribute(motionPause, "aria-label")}${addAttribute(motionPause, "data-pause-label")}${addAttribute(motionPlay, "data-play-label")} data-astro-cid-vz3ba7ul> <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false" data-astro-cid-vz3ba7ul> <rect class="plate__motionPause" x="7" y="5" width="3.4" height="14" rx="1" data-astro-cid-vz3ba7ul></rect> <rect class="plate__motionPause" x="13.6" y="5" width="3.4" height="14" rx="1" data-astro-cid-vz3ba7ul></rect> <path class="plate__motionPlay" d="M8 5.2 19 12 8 18.8Z" data-astro-cid-vz3ba7ul></path> </svg> <span class="plate__motionLabel" data-motion-label data-astro-cid-vz3ba7ul> ${motionPause} </span> </button>`} </div> </figure>  <p class="plate__cap"${addAttribute(motion ? "" : void 0, "data-sc-focus")} data-astro-cid-vz3ba7ul> ${caption} </p> </div>` : (
    /* ── THE TYPOGRAPHIC PLATE ──────────────────────────────────────────
           No photograph yet. The caption is a real sentence from this page, so
           setting it at display size between two rules is not a placeholder
           pretending to be content — it is content, in the slot a photograph
           will eventually take. Nothing here says "image missing", because
           nothing here is missing from the reader's point of view.
    
           data-sc-in, never data-sc-cue: this renders text, and text on this
           site rises into place once and never fades. An element measured
           mid-fade fails contrast, which this project learned the expensive
           way. */
    renderTemplate`<div class="plate__type" data-astro-cid-vz3ba7ul> <p class="plate__typeLine" data-sc-in${addAttribute(motion ? "" : void 0, "data-sc-focus")} data-astro-cid-vz3ba7ul> ${caption} </p> </div>`
  )} </section> `;
}, "E:/Claude Project/reboot/src/components/Plate.astro", void 0);

export { $$Plate as $ };
