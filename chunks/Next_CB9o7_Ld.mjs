import { c as createComponent, m as maybeRenderHead, b as addAttribute, a as renderTemplate, d as createAstro } from './astro/server_AE1iOT-f.mjs';
import 'piccolore';
import 'clsx';
/* empty css                             */

const $$Astro = createAstro();
const $$Next = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Next;
  const { href, label, title, img } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a class="next"${addAttribute(href, "href")} data-theme="paper" data-astro-cid-7dzv3gim> <span class="next__in wrap" data-astro-cid-7dzv3gim> <span class="label" data-astro-cid-7dzv3gim>${label}</span> <span class="next__t" data-astro-cid-7dzv3gim>${title} <span class="arr" aria-hidden="true" data-astro-cid-7dzv3gim>→</span></span> </span> <span class="next__img" aria-hidden="true" data-astro-cid-7dzv3gim><img${addAttribute(img, "src")} alt="" width="800" height="447" loading="lazy" data-astro-cid-7dzv3gim></span> </a> `;
}, "E:/Claude Project/Websites/Site/src/components/Next.astro", void 0);

export { $$Next as $ };
