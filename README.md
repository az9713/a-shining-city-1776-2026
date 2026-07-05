# A Shining City: 1776–2026

A 74-second film for America's 250th birthday — made by one human and one AI in a single working session, for about $5.65 of generative-API credit.

<p align="center">
  <a href="https://github.com/user-attachments/assets/7cf615bf-2513-4a92-b99e-71a2c94d4aef">
    <img src="poster.png" width="480" alt="A Shining City: 1776–2026 — click to watch the film">
  </a>
</p>

**▶ Watch it right here** (1080p, The Star-Spangled Banner, 11 shots from the 1776 sunrise over Independence Hall to the America250 banner):

https://github.com/user-attachments/assets/7cf615bf-2513-4a92-b99e-71a2c94d4aef

Also: [player page](https://az9713.github.io/a-shining-city-1776-2026/) · direct download [`usa250_1080p.mp4`](usa250_1080p.mp4)

## The other star of the show

The film is half the story. The other half is **how it was made**: a turn-by-turn human–AI collaboration in which the human supplied direction, historical truth, and merciless zoom-level quality control, and the AI (Claude Fable 5 in Claude Code) supplied planning, generation, verification code, and pixel surgery.

Highlights of what that loop had to solve:
- Three different image models that could not draw **13 stars** no matter what — solved with OpenCV geometry instead of prompts
- A flag **furling on the Moon**, where there is no air — solved by stabilizing the video and compositing a frozen flag, frame by frame
- A Space Shuttle standing in for a Saturn V, gibberish signage, invented National Mall geography, impossible camera positions, AI tear-drops — every artifact, its catch, and its fix

**Read the full chronicle: [`DEVELOPMENT.md`](DEVELOPMENT.md)** — every turn, every decision fork, every artifact case file, and the budget ledger.

## Repo contents

| Path | What |
|---|---|
| `usa250_1080p.mp4` | The final film |
| `DEVELOPMENT.md` | The complete development chronicle |
| `PLAN.md` | The living production plan (as it ended) |
| `film/storyboard.mjs` | 10 keyframe prompts → Seedream V4 (fal.ai) |
| `film/animate.mjs` | Keyframes → Kling 2.5 Turbo Pro video clips (fal.ai) |
| `film/nanofix.py`, `film/fixflag.py` | Reference-guided flag repair + machine star-counting |
| `film/star_surgery.py` | The deterministic 13-star fix (inpaint + homography + luminance shading) |
| `film/make_betsy.ps1`, `film/make_usflag.ps1` | Exact flag references, rendered from spec |
| `film/stills/` | The 10 approved keyframes |
| `film/stills/archive/` | Every superseded version — the 11-star flags, the wrong rocket, the tears |

## Pipeline

Seedream V4 stills (~$0.03, iterate until approved) → Kling 2.5 Turbo Pro image-to-video ($0.35/clip, bought once per approved still) → OpenCV verification & repair (free) → ffmpeg assembly: captions, crossfades, Ken Burns end card, audio.

Music: The United States Air Force Band, *The Star-Spangled Banner* (US-government work, public domain, [archive.org](https://archive.org/details/TheStarSpangledBanner)).

*Not included in the repo: `film/clips/` (190 MB of intermediate video, all present in the final film), the audio files (re-downloadable), and `.env` (API key).*
