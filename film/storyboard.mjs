// USA 250 storyboard: 10 shots, photoreal cinematic Americana.
// Run: node film/storyboard.mjs submit [ids...] | poll
// e.g. style test: node film/storyboard.mjs submit 06 10
import fs from 'fs';

const STYLE = 'Ultra-detailed photorealistic cinematic still, 35mm film grain, warm Kodak golden-hour tones, anamorphic 16:9 composition, volumetric light, epic yet intimate, no text or watermarks.';

export const SHOTS = [
  {
    id: '01-independence-hall',
    title: '1776',
    prompt: `Sunrise over Independence Hall in Philadelphia, 1776: the brick tower and white steeple catching the first golden light as sun crests the horizon, warm dawn mist drifting over empty cobblestone streets, colonial lanterns still glowing faintly, long soft shadows, a few horse-drawn carts in the distance. Hopeful, reverent morning stillness. ${STYLE}`,
  },
  {
    id: '02-signing',
    title: 'We hold these truths',
    prompt: `Candlelit close-up inside Independence Hall, 1776: weathered hands dipping a quill pen, signing a large parchment document, the handwritten script soft and out of focus so no words are readable, no heading text, warm candle flames flickering at frame edge, wax seal and ink well on the dark wooden table, other founders' silhouettes soft in the background bokeh, golden candlelight against deep shadows, Rembrandt lighting. ${STYLE}`,
  },
  {
    id: '03-first-flag',
    title: 'A nation is born',
    prompt: `The 1777 Betsy Ross American flag being raised on a wooden flagpole over a colonial harbor town at golden hour: the flag has a blue canton with exactly 13 five-pointed white stars arranged in a single even circle, and exactly 13 alternating horizontal stripes, 7 red and 6 white, with red stripes at the top and bottom edges. The flag catching wind and warm light, tall sailing ships with furled sails in the harbor behind, brick buildings and church steeples, townspeople in colonial dress gathered below looking up, gulls wheeling in an amber sky. Triumphant and hopeful. ${STYLE}`,
  },
  {
    id: '04-liberty',
    title: 'A shining city upon a hill',
    prompt: `View from the deck of a vintage immigrant steamship entering New York Harbor at dawn: passengers in early-1900s coats and caps crowding the ship railing in the foreground, seen from behind, looking up and pointing across the water, the Statue of Liberty standing in the distance on her tall stone pedestal on Liberty Island, the full statue small against the sky at a realistic distance, torch raised against a warm sunrise, the sunlit city skyline glowing gold in the background haze, light rays breaking through morning clouds. Awe and welcome. ${STYLE}`,
  },
  {
    id: '05-built-by-hand',
    title: 'Built by hand',
    prompt: `Close-up of a farmer's weathered, calloused hands cradling ripe golden wheat heads in a vast Kansas wheat field at sunset, wind rippling the amber field to the horizon, a red barn and windmill silhouetted in the warm distance, dust motes glowing in low golden backlight, denim sleeve and worn leather glove tucked in a back pocket. Dignity of work. ${STYLE}`,
  },
  {
    id: '06-main-street',
    title: 'Home',
    prompt: `A small-town Fourth of July children's bicycle parade on Main Street, late-afternoon golden hour: a loose line of kids all riding bicycles decorated with small American flags in the same direction toward the camera, families and townspeople lining both sidewalks facing the parade, cheering, clapping and waving at the passing children, red-white-and-blue bunting on the brick storefronts, striped canvas awnings over shop windows, string pennants across the street, a consistent row of early-1900s two-story brick buildings on both sides, no readable text or lettering on any sign or storefront, gentle lens flare, warm nostalgic 1970s Americana feeling. ${STYLE}`,
  },
  {
    id: '07-moon',
    title: 'One small step',
    prompt: `Apollo 11 moon landing, July 1969, recreating the iconic NASA photograph of Buzz Aldrin saluting the flag: a single astronaut in a white A7L spacesuit with gold-visored helmet seen from behind and slightly to his right side, standing on the gray powdery lunar surface FACING the American flag and saluting it, his gloved hand raised to his helmet toward the flag, the flag on its pole with horizontal top support rod planted in the regolith to the right of him, its rippled fabric facing him, the gold-foil and silver lunar module Eagle standing on its landing legs in the left background, crisp bootprints in the fine gray regolith, pitch-black sky with no stars, harsh direct sunlight casting long sharp shadows, the desolate magnificent lunar plain stretching to a close horizon. Ultra-detailed photorealistic still in the style of NASA Hasselblad 70mm film photography, subtle film grain, no text or watermarks.`,
  },
  {
    id: '08-veteran',
    title: 'The brave',
    prompt: `An elderly veteran in dress uniform saluting at a war memorial at golden hour, backlit by low warm sun, a young honor guard soldier beside him holding a crisply folded American flag, both with dry composed faces and quiet dignity, marble memorial wall softly out of focus behind, small flags planted in the grass, long reverent shadows, solemn stillness. ${STYLE}`,
  },
  {
    id: '09-faces',
    title: '340 million strong',
    prompt: `A warm group portrait of everyday Americans standing together at golden hour: a teacher holding books, a nurse in scrubs, a firefighter in turnout gear, a farmer in a worn cap, a young soldier, diverse ages and faces, all looking toward the camera with quiet pride, a large American flag waving softly out of focus behind them, warm backlight rim on their shoulders. ${STYLE}`,
  },
  {
    id: '10-fireworks',
    title: '250',
    prompt: `Fourth of July fireworks over the National Mall in Washington DC, seen from the steps of the Lincoln Memorial looking east straight down the long rectangular Reflecting Pool: the Washington Monument obelisk rising alone at the far end of the pool, dense rows of trees lining both sides of the pool, no other buildings visible, spectacular red white and blue firework bursts high above and behind the Monument, all of it mirrored in the still water, thousands of families silhouetted along both tree-lined edges watching, children on shoulders, smoke drifting through colored light in the night sky. Grand celebratory finale. ${STYLE}`,
  },
];

const KEY = fs.readFileSync('.env', 'utf8').match(/FAL_KEY=(.+)/)[1].trim();
const H = { 'Authorization': `Key ${KEY}`, 'Content-Type': 'application/json' };
const MODEL = 'https://queue.fal.run/fal-ai/bytedance/seedream/v4/text-to-image';
const STATE = 'film/batch1.json';

const loadState = () => (fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {});

if (process.argv[2] === 'submit') {
  const only = process.argv.slice(3); // e.g. ["06","10"]; empty = all
  const state = loadState();
  for (const s of SHOTS) {
    if (only.length && !only.some((o) => s.id.startsWith(o))) continue;
    if (state[s.id]?.file) { console.log(s.id, 'already done'); continue; }
    const r = await fetch(MODEL, { method: 'POST', headers: H, body: JSON.stringify({ prompt: s.prompt, image_size: 'landscape_16_9' }) }).then((x) => x.json());
    state[s.id] = { status_url: r.status_url, response_url: r.response_url };
    console.log(s.id, r.request_id ? 'submitted' : JSON.stringify(r).slice(0, 200));
  }
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
}

if (process.argv[2] === 'poll') {
  const state = loadState();
  let pending = Object.entries(state).filter(([, v]) => !v.file && v.status_url);
  while (pending.length) {
    await new Promise((r) => setTimeout(r, 5000));
    for (const [id, v] of pending) {
      const st = await fetch(v.status_url, { headers: H }).then((x) => x.json());
      if (st.status === 'COMPLETED') {
        const res = await fetch(v.response_url, { headers: H }).then((x) => x.json());
        const url = res.images?.[0]?.url;
        if (!url) { console.log(id, 'ERROR', JSON.stringify(res).slice(0, 150)); v.file = 'ERROR'; continue; }
        const file = `film/stills/${id}.png`;
        const buf = Buffer.from(await fetch(url).then((x) => x.arrayBuffer()));
        fs.writeFileSync(file, buf);
        v.file = file; v.url = url;
        console.log(id, 'saved', (buf.length / 1e6).toFixed(1) + 'MB');
      }
    }
    fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
    pending = Object.entries(state).filter(([, v]) => !v.file && v.status_url);
    console.log('pending:', pending.map(([id]) => id).join(',') || 'none');
  }
}
