# Seed image credits

Product images used by `npm run seed`. The files are in `scripts/seed-assets/`, resized to 1200 px wide WebP, and uploaded to the `tillwright` bucket as `products/seed-<slug>.webp`.

## Photos from Unsplash

Free to use under the [Unsplash License](https://unsplash.com/license). Credit isn't required, but it's appreciated.

| Product | Photographer | Photo |
| --- | --- | --- |
| PBT keycap set, 75% layout | [Gavin Phillips](https://unsplash.com/@gavinspavin) | [Close-up of a white keyboard with an orange space bar](https://unsplash.com/photos/close-up-of-a-white-keyboard-with-an-orange-space-bar-aL5Xqy3crXY) |
| Desk mat, 900 × 400 mm | [Oakywood](https://unsplash.com/@oakywood) | [A person's hand on a mouse pad next to a keyboard](https://unsplash.com/photos/a-persons-hand-on-a-mouse-pad-next-to-a-keyboard-Zah7GC6mNKg) (cropped to remove the maker's logo) |
| Ceramic mug, 350 ml | [Ryland Dean](https://unsplash.com/@ryland_dean) | [White ceramic mug beside black computer keyboard](https://unsplash.com/photos/white-ceramic-mug-beside-black-computer-keyboard-6k6N8HTrXyE) |

## Illustrations

No suitable free photo was found for these, so they are drawn in the brand tokens (ink `#22201B`, field `#1F4D36`, rye `#E9B949`, surface `#F3F5EE`). The SVG sources are in `scripts/seed-assets/fallback/`.

| Product | Why |
| --- | --- |
| Ship-it hoodie, 400 gsm cotton | Free hoodie photos show people in scenes or visible third-party brands, not a plain product. |
| Sticker pack, 12 die-cut vinyl | The closest photos showed another company's logo. |
| Dot-grid notebook, A5 | No free photo showed a dot-grid page; the closest were ruled. |

To regenerate an illustration after editing its SVG:

```bash
node -e "require('sharp')('scripts/seed-assets/fallback/seed-hoodie.svg').resize({width:1200}).webp({quality:90}).toFile('scripts/seed-assets/seed-hoodie.webp')"
```
