// Animate approved stills via Kling 2.5 Turbo Pro i2v ($0.35/5s each).
// Run: node film/animate.mjs submit|poll
import fs from 'fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/FAL_KEY=(.+)/)[1].trim();
const H = { 'Authorization': `Key ${KEY}`, 'Content-Type': 'application/json' };
const MODEL = 'https://queue.fal.run/fal-ai/kling-video/v2.5-turbo/pro/image-to-video';
const STATE = 'film/anim.json';

const CAM = 'Cinematic, realistic natural motion, consistent speed, no camera shake, no morphing, no warping, no new objects appearing, people and structures keep their exact appearance, flags keep their exact star and stripe pattern.';

const state0 = JSON.parse(fs.readFileSync('film/batch1.json', 'utf8'));
const imgOf = (id) => state0[id].url || ('data:image/png;base64,' + fs.readFileSync(`film/stills/${id}.png`).toString('base64'));

const CLIPS = [
  { id: '01-independence-hall',
    motion: 'Very slow push-in toward the Independence Hall tower as the rising sun brightens, dawn mist drifting slowly across the cobblestones, the horse-drawn cart rolling gently forward in the distance, lantern flames flickering softly, long shadows gradually shortening.' },
  { id: '02-signing',
    motion: 'The hand slowly and steadily writes with the quill across the parchment, candle flames flicker warmly casting moving shadows, gentle slow camera drift across the document, the blurred figures in the background shift subtly, wax seal glints in candlelight.' },
  { id: '03-first-flag',
    motion: 'The flag ripples gently in a light breeze while keeping its exact 13-star circle and stripe pattern, camera slowly tilts upward toward the flag, seagulls glide across the golden sky, the townspeople below stand still gazing up, ship sails sway almost imperceptibly.' },
  { id: '04-liberty',
    motion: 'The steamship glides slowly forward leaving a gentle wake, passengers at the railing point and look up in awe with small movements, light rays shimmer through the morning clouds, water sparkles, the camera rises very slowly, the Statue of Liberty stands perfectly still.' },
  { id: '05-built-by-hand',
    motion: 'The golden wheat field ripples in waves under the breeze, glowing dust motes drift through the backlight, the weathered hands gently cradle the wheat heads with tiny natural movements, the windmill blades turn slowly in the far distance, warm light shimmers.' },
  { id: '06-main-street',
    motion: 'The children pedal their bicycles steadily toward the camera in the parade, small flags fluttering on the handlebars, the crowds on both sidewalks clap and cheer and wave, bunting and string pennants sway gently overhead, warm lens flare shimmers.' },
  { id: '07-moon',
    motion: 'Completely locked-off static camera on a tripod, absolutely no camera movement. The astronaut holds his salute steadily, then slowly lowers his arm. The American flag, its fabric and its pole remain absolutely frozen, rigid and perfectly motionless for the entire shot: there is no air on the Moon so the fabric cannot move at all, not even a slight ripple. The lunar module, the ground, the footprints and all shadows stay perfectly still. Documentary stillness, serene and majestic.' },
  { id: '08-veteran',
    motion: 'Minimal dignified motion: the elderly veteran holds his salute with a slight tremble, the young honor guard stands perfectly still holding the folded flag, golden backlight flares softly through the trees, the small flags and grass sway very gently, extremely slow push-in.' },
  { id: '09-faces',
    motion: 'Subtle parallax drift across the group portrait, the large American flag behind them waves softly keeping its exact pattern, hair and clothing move gently in the warm breeze, the people breathe and blink naturally with quiet pride, golden rim light shimmers.' },
  { id: '10-fireworks',
    motion: 'Fireworks burst and bloom continuously over the Washington Monument in red white and blue, their reflections shimmering and rippling down the long Reflecting Pool, smoke drifts slowly through the colored light, the silhouetted families watch in stillness, children point upward.' },
];

if (process.argv[2] === 'submit') {
  const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
  for (const c of CLIPS) {
    if (state[c.id]?.status_url) { console.log(c.id, 'already submitted'); continue; }
    const r = await fetch(MODEL, { method: 'POST', headers: H, body: JSON.stringify({
      prompt: `${CAM} ${c.motion}`,
      image_url: imgOf(c.id),
      duration: '5',
    }) }).then((x) => x.json());
    state[c.id] = { status_url: r.status_url, response_url: r.response_url };
    console.log(c.id, r.request_id ? 'submitted' : JSON.stringify(r).slice(0, 200));
    fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
  }
}

if (process.argv[2] === 'poll') {
  const state = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  let pending = Object.entries(state).filter(([, v]) => !v.file);
  while (pending.length) {
    await new Promise((r) => setTimeout(r, 20000));
    for (const [id, v] of pending) {
      try {
        const st = await fetch(v.status_url, { headers: H }).then((x) => x.json());
        if (st.status === 'COMPLETED') {
          const res = await fetch(v.response_url, { headers: H }).then((x) => x.json());
          const url = res.video?.url;
          if (!url) { console.log(id, 'ERROR', JSON.stringify(res).slice(0, 150)); v.file = 'ERROR'; continue; }
          const buf = Buffer.from(await fetch(url).then((x) => x.arrayBuffer()));
          fs.writeFileSync(`film/clips/${id}.mp4`, buf);
          v.file = `film/clips/${id}.mp4`; v.url = url;
          console.log(id, 'saved', (buf.length / 1e6).toFixed(1) + 'MB');
        }
      } catch (e) { console.log(id, 'poll error', e.message); }
    }
    fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
    pending = Object.entries(state).filter(([, v]) => !v.file);
    console.log(new Date().toISOString().slice(11, 19), 'pending:', pending.map(([id]) => id).join(',') || 'none');
  }
  console.log('all clips done');
}
