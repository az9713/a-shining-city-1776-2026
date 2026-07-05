# USA 250 — 55-Second Anniversary Film

**Goal:** 55-second (10 AI shots + banner end card), 1080p, inspiring/uplifting/patriotic video for America's 250th (1776–2026).
**Vibe:** CCR "Have You Ever Seen the Rain" (warm, golden-hour, everyday-people Americana) × Lee Greenwood "God Bless the U.S.A." (flags, monuments, sweeping landscapes, pride).
**Pipeline:** reuse `fable-5-video-creation` — Seedream V4 keyframes → Kling 2.5 Turbo Pro image-to-video → ffmpeg assembly.

## Budget (fal.ai, $10 credit)

| Item | Qty | Est. cost |
|---|---|---|
| Style tests (Seedream stills) | ~4 | $0.12 |
| Final keyframes | 10 (+5 retries) | $0.45 |
| Kling 5s clips | 10 × $0.35 | $3.50 |
| Re-animation buffer | 2 × $0.35 | $0.70 |
| Music (fal audio model, 50s instrumental) | 1 | ~$0.10 |
| **Total ceiling** | | **~$4.90** |
| **Expected if clean (like last project)** | | **~$4.20** |

## Music — DECIDED

Generated 55s original instrumental on fal (~$0.10): acoustic guitar opening → strings build → drums + brass swell → orchestral peak. (CCR/Greenwood tracks are copyrighted; we match feel, not audio.)

## Visual style — DECIDED

Photoreal cinematic: golden-hour warm palette, 35mm film grain, warm Kodak tones, anamorphic 16:9, consistent across all shots.

## Storyboard — 11 shots × 5s = 55s (shot 11 is a free ffmpeg end card)

| # | Time | Shot | Motion (Kling) | Caption |
|---|---|---|---|---|
| 1 | 0:00–0:05 | Sunrise over Independence Hall, Philadelphia, 1776; warm dawn mist | Slow push-in toward the tower as sun crests | **1776** |
| 2 | 0:05–0:10 | Candlelit hands signing the Declaration, quill and parchment close-up | Gentle drift across parchment, candle flicker | "We hold these truths…" |
| 3 | 0:10–0:15 | 13-star flag raised over a colonial harbor town at golden hour | Flag unfurls in wind, camera tilts up | A nation is born |
| 4 | 0:15–0:20 | Statue of Liberty at dawn, sunlit Manhattan skyline glowing behind her, immigrant steamship gliding past | Camera rises alongside the torch | "…a shining city upon a hill" |
| 5 | 0:20–0:25 | Farmer's weathered hands + wheat field / steelworker sparks (split-tone Americana) | Wheat sways, sparks drift | Built by hand |
| 6 | 0:25–0:30 | Small-town Main Street, July 4th: kids on bikes with flags, diner, bunting (the CCR shot) | Kids ride toward camera, flags flutter | Home |
| 7 | 0:30–0:35 | Apollo 11: astronaut saluting the flag on the lunar surface, lunar module behind (per the iconic NASA photo) | Subtle salute hold, dust motionless, slow push-in | "That's one small step for [a] man, one giant leap for mankind." |
| 8 | 0:35–0:40 | Veteran saluting at memorial, folded flag, honor guard — reverent, backlit | Minimal, dignified slow push-in | "Freedom is never more than one generation away from extinction." — Reagan |
| 9 | 0:40–0:45 | Faces of America montage: teacher, nurse, farmer, firefighter — warm portraits | Subtle parallax between faces | 340 million strong |
| 10 | 0:45–0:50 | Fireworks over the National Mall seen from the Lincoln Memorial steps down the Reflecting Pool | Fireworks bloom, reflections shimmer | Happy 250th, America |
| 11 | 0:50–0:55 | America250 banner end card (real image from .ignore/US_250_flag.jpg, no AI) | ffmpeg Ken Burns slow zoom into the "250" ribbon logo | — |

*Cut from the 60s version: westward wagons (Liberty carries the journey theme) and the eagle/Grand Canyon sweep (fireworks finale carries the grandeur).*

**Music arc:** quiet acoustic (1–3) → building strings (4–6) → drums + brass swell (7–9) → full orchestral peak with fireworks (10), hard sting on the "250" card.

## Execution phases (when you say go)

1. **Setup** — clone/copy the three scripts from `fable-5-video-creation`, `.env` with `FAL_KEY`.
2. **Style lock** — generate shots #6 and #10 as photoreal test stills to confirm the look before batch-generating. (~$0.06)
3. **Keyframes** — all 10 stills, review grid before animating anything.
4. **Animate** — 10 Kling clips, checked one at a time.
5. **Music** — generate the 50s instrumental.
6. **Assemble** — ffmpeg: concat with 0.4s crossfades, captions (drawtext), audio, end card → `usa250_1080p.mp4`.

Cheapest failure point is stills — we only pay for Kling once a still is approved, same discipline as last project.
