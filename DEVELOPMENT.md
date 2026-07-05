# A Shining City: 1776–2026
## A Development Chronicle of Human–AI Filmmaking

*How a 74.5-second film for America's 250th birthday was made in one working session, for about $5.65 of API credit — and why the collaboration that made it is the other star of the show.*

---

## 1. The Production at a Glance

| | |
|---|---|
| **Title** | *A Shining City: 1776–2026* |
| **Deliverable** | `usa250_1080p.mp4` — 74.5 s, 1920×1080, 11 shots, The Star-Spangled Banner |
| **Crew** | One human (director / producer / quality control) + one AI (Claude **Fable 5**, high reasoning effort, running in Claude Code) |
| **Generative backend** | [fal.ai](https://fal.ai) — $10 credit budget, ~$5.65 spent |
| **Image model** | ByteDance **Seedream V4** text-to-image (~$0.03/still) and **Seedream V4 Edit** (reference-guided editing) |
| **Editing model** | **Nano Banana** (Google Gemini 2.5 Flash Image) edit endpoint (~$0.04/edit) |
| **Video model** | **Kling 2.5 Turbo Pro** image-to-video ($0.35 per 5-second 1080p clip) |
| **Music** | Stability **Stable Audio 2.5** (generated score, v1 cut) → **The United States Air Force Band**, *The Star-Spangled Banner* (choral; US-government work, public domain, via archive.org) for the final cut |
| **Non-AI tools** | ffmpeg (assembly, captions, Ken Burns, crossfades), Python + OpenCV/NumPy/SciPy (verification and surgical pixel repair), PowerShell System.Drawing (exact flag rendering) |
| **Model note** | Every step of this project ran on **Claude Fable 5**. Opus 4.8 was not used. The predecessor project whose pipeline was reused (`fable-5-video-creation`, a 45-second "hang-glider through time" film) was also a Fable 5 collaboration. |

The working method was inherited from that predecessor project and held throughout:

> **The still is the contract.** The image-to-video model largely preserves whatever the keyframe contains, so all creative iteration happens at $0.03 per attempt on stills. The $0.35 animation step is only bought once a still is approved. Nothing expensive is generated from an unapproved cheap asset.

---

## 2. Turn-by-Turn Timeline

The project was a strict alternation: the human set direction and judged results; the AI planned, generated, verified, and repaired. Every fork below is marked **⑂**.

### Act I — Planning (no money spent)

**Turn 1 — Human:** "I want a one-minute video celebrating the 250th birthday of the United States. Inspiring, uplifting, patriotic." References given: the Google *Fourth of July 2026* Doodle, Google Arts & Culture US250, and two music videos for the *vibe* — CCR's "Have You Ever Seen the Rain" (warm, golden-hour, everyday-people Americana) and Lee Greenwood's "God Bless the U.S.A." (flags, monuments, sweeping pride). Budget: $10 of fal.ai credit. Instruction: *plan first, run nothing.*

**AI:** Fetched the prior project's repo to ground the plan in a proven pipeline (Seedream stills → Kling animation → ffmpeg assembly). Produced `PLAN.md`: a 12-shot × 5 s storyboard (60 s), budget table (~$6.00 ceiling), and a music-rights analysis — the CCR/Greenwood recordings are copyrighted, so the film would *match their feel, not their audio*.

**Turn 2 — Human:** "Why would this cost ~$6 while the hang-glider one cost about $3+?"

**AI:** Same per-second price; the difference was 3 extra clips (60 s vs 45 s) plus padding: a re-animation buffer and retry allowances the previous project never needed. Offered the lever: a 50-second cut drops animation to $3.50.

**Turn 3 — Human ⑂:** "Make it closer to a 50-second cut." → The storyboard shrank to 10 shots: the *westward wagons* shot was cut (the Statue of Liberty carries the journey theme) and the *eagle over the Grand Canyon* was cut (the fireworks finale carries the grandeur).

**Turn 4 — Human ⑂ (three decisions at once, via structured questions):**
1. **Visual style:** photoreal cinematic (35 mm film grain, warm Kodak golden-hour tones) over painterly folk-art.
2. **Music:** generated original instrumental over public-domain Sousa.
3. **Storyboard:** approved — *with a twist*: insert Reagan's "shining city upon a hill" and "Freedom is never more than one generation away from extinction."

**AI:** Wove the Reagan lines in as captions rather than new shots (no cost, no length change). The Statue of Liberty shot gained a sunlit skyline behind her so the image literally becomes the shining city; the veteran shot carries the freedom quote.

### Act II — Keyframes (the $0.03 iteration loop)

**Turn 5 — Human:** "What is next step?" **AI:** Free setup — cloned the pipeline scripts, located the fal.ai API key in a previous project's `.env`, wrote a new `storyboard.mjs` with all ten prompts, and generated the two style-test stills (Main Street, fireworks) for ~$0.06.

**Turn 6 — Human (first artifact catch):** On zooming into the Main Street still: background cyclists appear to ride *backwards*, bystanders wave and clap *at nothing*, and the diner's neon sign reads gibberish ("COLINIS" instead of anything real). "A quick glance seems OK but a closer look reveals problems."

**AI (fix):** Re-staged the scene as a **children's bicycle parade** — one shared direction of travel gives every rider the same vector and gives the crowd something to cheer at — and banned readable signage outright ("no readable text or lettering on any sign or storefront"). $0.03.

**Turn 7 — Human ⑂:** "Much better, but the shiny diner seems out of place amid brick buildings." → **AI:** removed the diner; made the street a consistent corridor of early-1900s brick with striped awnings. $0.03. **Turn 8 — Human:** "Version 3 is good."

**AI (batch):** Generated the remaining 8 keyframes (~$0.24), then reviewed its own output *before* showing the human, and caught three defects itself:
- **Wrong rocket:** Seedream drew a **Space Shuttle** (orange tank, twin boosters) for a caption reading "We reached the Moon" — the Shuttle never went to the Moon. Re-prompted with an explicit Apollo/Saturn V description ("single tall cylindrical white rocket, black roll-pattern stripes, escape tower … no shuttle, no orange tank, no side boosters").
- **Parchment gibberish:** the signing shot had a large fake-cursive heading — same failure class as the diner sign. Re-prompted with "script soft and out of focus, no heading text."
- **Cap-chain artifact:** a stray beaded chain dangled from the honor guard's cap. Simple re-roll.
- A follow-on artifact appeared (the launch gantry *floating in mid-air* beside the rocket — caused by the phrase "launch tower falling away") and was fixed by removing the offending phrase.

### Act III — The Accuracy Campaign (where it gets interesting)

**Turn 9 — Human (the historical-accuracy pass):** Three rejections with references supplied:
1. The National Mall fireworks scene didn't match reality — a reference photo (`mall.jpg`, the true view down the Reflecting Pool from the Lincoln Memorial) showed the AI had invented a Capitol dome beside a phantom memorial.
2. The Betsy Ross flag must have **exactly 13 stars and the correct stripes** (Wikipedia reference given).
3. The Statue of Liberty scene put onlookers impossibly floating at crown height (reference photo given).

**AI:** Rewrote all three prompts from the references: the Mall shot restaged from the Lincoln Memorial steps (Washington Monument alone at the end of the pool, trees both sides, *no other buildings*); the Liberty shot restaged from the immigrant ship's deck looking across the water at a correctly distant statue on her pedestal. Both passed on the next roll. The third became the longest battle of the project — see **Case File #1** below.

**Turn 10 — Human:** "Archive unneeded stills so I know which ones are for inspection." → `film/stills/` reduced to exactly the 10 canonical frames; 13 superseded versions moved to `film/stills/archive/`.

**Turn 11 — Human (the counting rebellion):** "03-first-flag.png has only **12** stars. It should be 13." *(The AI's own automated counter had passed the image — wrongly; see Case File #1.)* "The flag in 09-faces.png is also wrong… **it seems the image model you are using is not very good. You may want to use a better one. It may end up saving some $$.**"

**AI:** Confirmed the human was right (the counter had been fooled by an edge fragment), switched editing models to Nano Banana, and — when *that* also proved unable to count — abandoned generation entirely for the star field and solved it with deterministic code. Case Files #1 and #2 tell both stories.

**Turn 12 — Human:** "Where are the fixed frames? 09-faces.png shows the wrong 5 stripes." → Uncovered a subtler problem than either party had seen: the *pattern* was now correct but the flag's overall proportions could only physically fit ~11 stripes before its visible bottom edge. Fix: enlarge the flag so its bottom/right edges are hidden behind the people — every visible stripe alternates correctly and there is no truncated edge left to miscount. (Also: a picture viewer caching an old file added confusion — worth remembering when human and AI are looking at "the same" image.)

**Turn 13 — Human ⑂ (creative upgrade):** Replace the Saturn V launch with **the actual Moon landing** — the iconic Buzz-Aldrin-saluting-the-flag photograph — captioned with Armstrong's "That's one small step for [a] man, one giant leap for mankind."

**Turn 14 — Human (staging correction):** First attempt had the astronaut saluting *the camera*. "No. The astronaut salutes **the flag**. Just like the reference." → Restaged: astronaut seen from behind on his right side, facing and saluting the flag with its horizontal support rod, lunar module in the left background. The AI then scrubbed 61 star-dots from the black sky (real lunar photographs show no stars — exposure too short) and inpainted a ghost watermark. Passed.

**Turn 15 — Human ⑂ (new ending):** Add an 11th, final shot: the official **America250 banner** (real product photo supplied), with a zoom. **AI:** refused to let AI touch it — a trademarked logo with text is exactly what generative models mangle — and built the clip deterministically with ffmpeg's Ken Burns zoom from the actual image. $0. Pixel-perfect.

### Act IV — Animation, Assembly, First Cut

**Turn 16 — Human:** "Go for it."

**AI:** Submitted all 10 Kling 2.5 Turbo Pro jobs ($3.50) with per-shot motion prompts (parade rolls toward camera; flag ripples *gently* while "keeping its exact 13-star circle"; fireworks bloom over still water; a moon-specific prompt demanding a rigid flag). While Kling rendered, generated a 55-second orchestral Americana score on Stable Audio 2.5 in parallel. Spot-checked the end frames of the four riskiest clips (flags and faces drift *late* in AI video), scrubbed Kling's re-added star-dots from the moon clip frame-by-frame (three attempts — the first pass ate the lander's bright details; a keep-out-box version protected them), then assembled: crossfades, Georgia-typeface captions with fade-in/out (written via text files to survive the curly quotes), music, end card. **First deliverable: 51 s, generated score.**

### Act V — The Anthem Cut and the Physics of Flags

**Turn 17 — Human (two notes) ⑂:** (a) The veteran's tear streaks "are too fake — we don't need tear drops"; (b) **"Can we have the US anthem? How can it fit? Please plan first."**

**AI (plan, no execution):** For the tears: re-prompt with "dry composed faces, quiet dignity." For the anthem: the *composition* is public domain but *recordings* are not — the safe, high-quality route is a US military band performance (US-government work = public domain). Found The United States Air Force Band's choral recording on archive.org (78 s; ~73.5 s of music). Presented three fit options: **(A)** stretch the film to anthem length; (B) trim the anthem to the existing 51 s; (C) keep the generated score. **Human chose A.**

**Turn 18–19 — Execution:** New veteran still (tears gone; the honor guard's uniform actually improved to coherent Marine dress blues), human accepted, re-animated ($0.35). All ten story clips retimed to 0.82× (5 s → 6.1 s — Kling's gentle motion reads as *grace*, not slow motion), banner zoom extended to 17.5 s, anthem trimmed and mapped so "home of the brave" lands on the America250 banner. **Second deliverable: 74.5 s anthem cut.**

**Turn 20 — Human:** The video must **end on the complete banner** — the first version's zoom-in pushed the banner's ends out of frame. → Inverted to a zoom-*out* (starts on the "250" ribbon, pulls back to the full banner). A second refinement followed: the pull-back originally completed only as the fade-to-black finished, so the full-banner moment was swallowed — fixed by completing the zoom at the 13-second mark and *holding* the full banner for the final ~4.5 s.

**Turn 21 — Human (the physics catch):** **"The flag on the moon should not be furling. It should not be moving at all."** Correct — no air on the Moon; the real flag only looks rippled because of its horizontal support rod. The fix became Case File #3.

**Turn 22 — Human:** "Suggest a wonderful title." → From the shortlist (anchored to the film's own imagery: "O'er the Land of the Free," "The Dawn's Early Light," "One Small Town, One Giant Leap"), the human chose **_A Shining City: 1776–2026_** — completing the arc of the Reagan line they had inserted back in Turn 4.

---

## 3. Artifact Case Files

The heart of the collaboration: what broke, who caught it, and how it actually got fixed. The recurring shape: **prompting fixes staging; only code fixes counting and physics.**

### Case File #1 — The Betsy Ross flag that would not count to 13

*The single most stubborn artifact of the production.*

| Attempt | Method | Result |
|---|---|---|
| 1 | Seedream V4, prompt: "13 stars" | 11 stars |
| 2 | Prompt hardened: "exactly 13 five-pointed white stars … 7 red and 6 white stripes" | 11 stars |
| 3 | Re-roll | 12 stars, two overlapping |
| 4 | Re-roll | 12 evenly spaced stars |
| 5 | **Seedream V4 Edit**, fed a geometrically exact reference flag (Wikimedia blocked scripted downloads, so the AI *drew* the reference itself in PowerShell System.Drawing: 13 stars on a true circle, 13 stripes) | 13 blobs by machine count — **but wrongly**: 12 real stars + one stripe-bleed fragment at the canton edge that fooled the verifier. **The human counted 12 by eye and overruled the machine.** |
| 6–11 | **Nano Banana edit** (per the human's "use a better model" directive), same exact reference attached, fixed verifier | 12, 12, 12, 12 — every single time (one attempt drew a six-pointed star for variety) |
| 12 | **Star surgery (deterministic code)** | **Exactly 13. By construction.** |

**The star surgery** (Python/OpenCV): detect the canton via HSV color masking plus a convex hull (the sunlit side of the backlit canton fails naive "blue" tests — the first mask found only a corner and the surgery misfired spectacularly before this was fixed); erase the AI's stars by inpainting so the fabric folds survive; draw 13 geometrically perfect stars on a circle in flat "flag space"; warp them through the canton's perspective homography; and modulate each star's brightness by the local fabric luminance so the folds show *through* the new stars. A leftover dark-navy ghost star, painted by the edit model and invisible to a white-pixel eraser, needed a targeted median-color fill — feathered, and clamped inside the canton after one attempt smeared blue into the stripe below.

**Verification also had to be debugged like software:** the blob counter's fixed 300-pixel threshold silently returned zero on Nano Banana's half-resolution output (stars were ~250 px); it became scale-aware (threshold as a fraction of canton area) with an edge-margin rule to reject boundary fragments — the exact failure that had produced the false "13."

**Lesson:** Diffusion models — three different ones, including one fed an exact picture of the answer — could not reliably count to 13. A hundred lines of Python cannot get it wrong. *Generative models for scenery, light, and faces; deterministic code for anything with a spec.*

### Case File #2 — The 50-star flag that was too short for its own stripes

The modern flag behind the "faces of America" group portrait had wrong stripes (human catch, official DDD-F-416E spec cited). Nano Banana, fed a spec-exact reference the AI rendered from the official proportions (1.9:1, union of 0.76 height, 50 stars in 9 offset rows), fixed the *pattern* in one attempt — red top stripe, 7-stripe canton depth, white-first below the canton, faces untouched.

Then the human counted again: still wrong below the canton. Diagnosis: the flag's inherited *shape* was too squat — 13 correct stripes physically cannot fit into it before its visible bottom edge. You cannot prompt your way out of geometry. **Fix:** a second edit enlarging the flag so its bottom and right edges fall behind the people and out of frame; every visible stripe alternates correctly and no countable edge remains. Accuracy by *composition* where accuracy by *construction* wasn't available.

### Case File #3 — The flag that furled on the Moon

The human's catch, late and decisive: the animated lunar flag rippled. There is no air on the Moon; the Apollo flag only looks wavy because a horizontal rod holds it (and it moves only when an astronaut touches the pole).

1. **Attempt 1 — prompt physics:** re-animate ($0.35) as a locked-off tripod shot: "the fabric cannot move at all, not even a slight ripple." Result: the *camera* locked beautifully (total drift dropped from a full push-in to 6 px) — but the fabric still billowed. Two Kling generations, two failures: video diffusion wants fabric to move.
2. **Attempt 2 — physics by force (code):** with a nearly-static camera the deterministic fix became possible. Per frame: estimate residual drift by phase correlation against frame 0 (using the ground/lander region as reference), warp each frame into alignment, then composite frame 0's flag, rod, and pole over all 121 frames with a feathered mask. First-to-last-frame difference in the flag region fell to pure film grain. The only remaining motion in the shot is the astronaut's salute slowly lowering — exactly what a Hasselblad would have seen.
3. The same pass re-scrubbed sky star-dots and a ghost watermark this Kling render had added. Getting the cleanup masks right took three iterations — one version chewed black holes into the lunar module's bright details, another (painting the whole sky constant black) left visible rectangular seams around the protected regions. The shipped version scrubs only small bright blobs ringed by darkness, with tight cutouts for lander, helmet, and flag.

### Case File #4 — Gibberish text, three times

AI image models cannot spell. Three separate incidents: the diner sign ("COLINIS"), the Declaration's large fake-cursive heading, and ghost watermarks in two Kling renders of the moon shot. Fixes, in order of preference: **don't have text** (ban readable signage; brick storefronts), **defocus it** (parchment script soft and illegible — real signatures are illegible scrawls anyway), **inpaint it** (watermarks), and for the one *required* piece of typography — the America250 banner — **never generate it at all**: use the real asset with a deterministic ffmpeg zoom.

### Case File #5 — Staging and motivation errors

Not pixel defects — *directing* defects, each caught by the human, each fixed by re-staging the scene in the prompt rather than by pixel repair:
- Background cyclists riding the "wrong way" and a crowd applauding nothing → make it a parade (shared motion vector + object of attention).
- Onlookers floating at the Statue of Liberty's crown → move the camera to the immigrant ship's deck; put the statue at honest distance.
- The astronaut saluting the camera like a portrait subject → shoot him from behind, facing the flag he is saluting, per the reference photograph.
- Tear streaks rendered as glossy paint → delete the emotion cue from the prompt; "dry composed faces, quiet dignity."
- An invented National Mall geography → restage from a real photograph's vantage point.

### Case File #6 — Miscellaneous production hazards

- **Wikimedia blocks scripted downloads** (even with a browser user-agent) and fal's servers couldn't fetch it either → render exact references locally (PowerShell System.Drawing); pass images to fal as base64 data URIs; archive.org proved script-friendly for the anthem.
- **A locked output file** (the human was watching the previous cut in a media player) failed the final render → write to a new name, swap after.
- **Image-viewer caching** made a fixed file look unfixed → close and reopen before judging.
- **Kling adds its own artifacts** even from a clean still: star-dots in black skies, watermark ghosts, and late-clip drift — always inspect *end* frames, not first frames.

---

## 4. The Music Thread

1. **Rights first:** the reference tracks (CCR, Greenwood) were vibe, never audio — both copyrighted. Match feel, not waveform.
2. **v1:** an original 55-second orchestral Americana instrumental generated on Stable Audio 2.5 (~$0.20): quiet acoustic open → strings → brass swell → fireworks peak. Structured to the shot arc.
3. **v2 ⑂:** the human asked for the actual national anthem. The reasoning chain: composition PD (1814) ≠ recording PD; AI models mangle real melodies, so don't generate it; US military band recordings are US-government works and therefore public domain; The United States Air Force Band's choral recording (archive.org) delivered modern quality at $0.
4. **The fit problem:** one verse runs ~73.5 s of music against a 51 s film. Three options were laid out; the human chose to **stretch the film to the anthem** — clips retimed to 0.82×, banner hold extended — so that "the land of the free and the home of the brave" resolves exactly on the America250 banner.

---

## 5. Budget Ledger

| Item | Spend |
|---|---|
| Seedream V4 stills — 10 finals + ~12 retries/tests | ~$0.66 |
| Seedream V4 Edit + Nano Banana edits (flag campaigns) | ~$0.45 |
| Kling 2.5 Turbo Pro — 10 clips + 2 re-animations (veteran, moon) | $4.20 |
| Stable Audio 2.5 score (v1 cut) | ~$0.20 |
| USAF Band anthem (public domain) | $0.00 |
| Banner end card (ffmpeg, real asset) | $0.00 |
| All verification & pixel surgery (local Python/ffmpeg) | $0.00 |
| **Total** | **≈ $5.65 of $10.00** |

The buffer philosophy paid for itself: every expensive Kling clip was gated behind a human-approved still, so the two re-animations were the only paid video retakes in a project with roughly twenty rounds of image iteration.

---

## 6. What the Collaboration Actually Was

**The human's contributions were irreplaceable and specifically human:**
- **Standards.** "A quick glance seems OK but a closer look reveals problems" became the project's quality bar. Every flag got counted. Every shadow got questioned.
- **Domain knowledge.** The Betsy Ross specification, the DDD-F-416E stripe spec, the vacuum of the Moon, the real geometry of the National Mall, how a salute is directed — every historical correction came from the human side, usually with a reference document attached.
- **Taste and restraint.** Cutting 60 s to 50 s for cost; killing the fake tears; choosing the sung anthem; insisting the film end on the *whole* banner; choosing a title that tied back to the Reagan line they had planted in the storyboard on day one.
- **Skepticism of automation.** The decisive moment of the project was the human overruling the AI's own automated verifier — "it has only 12 stars" — which turned out to be a bug in the verifier, not in the human.

**The AI's contributions were the machinery:**
- Planning, budgeting, and cost transparency at every gate.
- Prompt engineering and re-staging; catching a class of its own errors before showing them (the wrong rocket, the parchment gibberish, the cap-chain).
- **Escalation discipline:** prompt → better model → reference-guided edit → *deterministic code*. Knowing when to stop asking a diffusion model to count and start writing OpenCV.
- Building its own verifiers (blob-counting star checkers, stripe-band scanners, drift meters) — and debugging *those* when they lied.
- All the invisible glue: stabilization math, feathered composites, caption typography, crossfade timing, public-domain sourcing, file hygiene with an archive trail of all 20+ superseded versions.

**The pattern that emerged**, in one sentence: *the human supplied intent, truth, and judgment; the AI supplied throughput, tooling, and repair — and the quality of the film came from the loop between them, not from either alone.*

Every artifact in Section 3 followed the same arc: **generate → inspect (human zoom or machine count) → diagnose → choose the cheapest sufficient tool → verify again.** When that loop ran, a $0.03 still became a museum-grade frame. When it was skipped — as with the "13-star" flag the machine passed — the human caught it, and the loop got a better verifier.

---

## 7. Final Shot List (as shipped)

| # | Shot | Caption | Provenance |
|---|---|---|---|
| 1 | Independence Hall, dawn, 1776 | **1776** | Seedream V4, first roll |
| 2 | Signing the Declaration by candlelight | "We hold these truths…" | retry ×1 (gibberish heading) |
| 3 | Betsy Ross flag over a colonial harbor | A nation is born | 5 generations + 7 edits + star surgery (Case #1) |
| 4 | Statue of Liberty from the immigrant ship's deck | "…a shining city upon a hill" | retry ×1 (impossible vantage) |
| 5 | Farmer's hands cradling wheat | Built by hand | first roll |
| 6 | Small-town July 4th bicycle parade (the CCR shot) | Home | retry ×2 (sign, diner) |
| 7 | Aldrin salutes the flag, Sea of Tranquility | "That's one small step for [a] man, one giant leap for mankind." | restaged ×2, re-animated ×1, flag frozen in code (Case #3) |
| 8 | Veteran and honor guard at the memorial wall | "Freedom is never more than one generation away from extinction." — Ronald Reagan | retry ×2 (cap chain; fake tears), re-animated ×1 |
| 9 | Faces of America — teacher, nurse, soldier, firefighter | 340 million strong | edit ×2 (stripe spec; flag proportions, Case #2) |
| 10 | Fireworks down the Reflecting Pool from the Lincoln Memorial steps | Happy 250th, America | retry ×1 (invented geography) |
| 11 | America250 banner — zoom out to full banner, hold, fade | — | real asset + ffmpeg; no AI |

*Soundtrack: The Star-Spangled Banner, The United States Air Force Band (public domain). Final chord lands on the full banner.*

---

*Written by Claude Fable 5 at the human director's request, from the complete session transcripts. The film and this document were produced in the same collaboration they describe.*
