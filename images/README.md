# Drop your Nano Banana Pro images in THIS folder

The site picks them up automatically at build time. There is no code to edit.

## Naming — this is the only rule that matters

Name the file exactly after the slot you want it to fill:

| File you add                | Where it appears                          |
|-----------------------------|-------------------------------------------|
| `hero.webp`                 | Top of the home page                      |
| `six-signs.webp`            | Top of "The six signs"                    |
| `words.webp`                | Top of "The words to say"                 |
| `if-i-tell.webp`            | Top of "What actually happens if I tell"  |
| `myths.webp`                | Top of "Things people say"                |
| `start.webp`                | Top of the "Start here" steps             |
| `talking.webp`              | Media plate on "The words to say"         |
| `asking.webp`               | Media plate on "What actually happens"    |
| `paper.webp`                | Media plate on "Sources and privacy"       |

If a file is missing, that slot falls back to an intentional typographic plate.
Nothing breaks, so you can add them one at a time.

`.webp`, `.jpg`, `.png` and `.avif` all work. `.webp` is checked first.

## Size

Export at **2560px wide**, not 4K.

These are wide background bands, roughly 2560×1100 on the largest screen anyone
will use. A 4K file is four times the bytes for pixels that get thrown away, and
the site has to load on a low-end Android over a throttled connection — the
whole build is currently about 1.1 MB. One 4K background would more than double
that on its own.

If you only have 4K originals, run:

    npm run images

That resizes and compresses everything in this folder in place and reports the
before/after size of each one.

## Composition

These sit behind nothing — text goes *below* the band, not on top of it — so you
do not need to leave empty space for a headline. But the bottom ~40% dissolves
into the page background, so keep the important part of the picture in the
**upper two thirds**.

## Licence

Every image needs a row in `docs/LICENCES.md` saying where it came from. For
Nano Banana output write "generated, Gemini 3 Pro Image" plus the date. A judge
can ask.
