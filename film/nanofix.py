# ponytail: nano-banana edit + machine verification loop for flag accuracy
import json, time, base64, urllib.request, re, sys, io
import numpy as np
from PIL import Image
from scipy import ndimage

KEY = re.search(r'FAL_KEY=(.+)', open('.env').read()).group(1).strip()
H = {'Authorization': 'Key ' + KEY, 'Content-Type': 'application/json'}
MODEL = 'https://queue.fal.run/fal-ai/nano-banana/edit'

def req(url, data=None):
    r = urllib.request.Request(url, data=json.dumps(data).encode() if data else None, headers=H)
    return json.loads(urllib.request.urlopen(r).read())

def duri(path):
    return 'data:image/png;base64,' + base64.b64encode(open(path,'rb').read()).decode()

def count_stars(png_bytes):
    """Count star blobs in blue canton, excluding blobs touching the bbox margin."""
    img = np.array(Image.open(io.BytesIO(png_bytes)).convert('RGB')).astype(int)
    blue = (img[:,:,2] > 100) & (img[:,:,2] > img[:,:,0] + 30) & (img[:,:,1] < img[:,:,2])
    ys, xs = np.where(blue)
    y0,y1,x0,x1 = ys.min(), ys.max(), xs.min(), xs.max()
    region = img[y0:y1, x0:x1]
    h, w = region.shape[:2]
    white = (region[:,:,0] > 170) & (region[:,:,1] > 170) & (region[:,:,2] > 170)
    lab, n = ndimage.label(white)
    min_size = 0.004 * h * w  # scale-aware: stars are ~0.6-0.8% of canton area
    count = 0
    for i in range(1, n+1):
        m = lab == i
        if m.sum() < min_size: continue
        cy, cx = ndimage.center_of_mass(m)
        if cy < 0.04*h or cy > 0.94*h or cx < 0.04*w or cx > 0.96*w: continue  # edge bleed
        count += 1
    return count

def edit(shot, ref_path, prompt, verify=None, attempts=4):
    state = json.load(open('film/batch1.json'))
    base_url = state[shot]['url']
    refs = duri(ref_path)
    for a in range(1, attempts+1):
        j = req(MODEL, {'prompt': prompt, 'image_urls': [base_url, refs], 'num_images': 1})
        while True:
            time.sleep(5)
            if req(j['status_url'])['status'] == 'COMPLETED': break
        res = req(j['response_url'])
        url = res.get('images', [{}])[0].get('url')
        if not url:
            print(f'{shot} attempt {a}: ERROR', str(res)[:150]); continue
        png = urllib.request.urlopen(url).read()
        ok, note = (True, 'no auto-verify') if verify is None else verify(png)
        print(f'{shot} attempt {a}: {note}')
        if ok:
            out = f'film/stills/{shot}-nano.png'
            open(out,'wb').write(png)
            state = json.load(open('film/batch1.json'))
            state[shot + '-nano'] = {'url': url, 'file': out}
            json.dump(state, open('film/batch1.json','w'), indent=2)
            print(f'{shot}: SUCCESS saved {out}')
            return True
    print(f'{shot}: FAILED after {attempts} attempts')
    return False

if __name__ == '__main__':
    which = sys.argv[1]
    if which == '03':
        edit('03-first-flag', 'film/betsy_ref.png',
             'In the first image, the waving flag\'s blue canton currently has 12 white stars in a circle. '
             'Fix it to have EXACTLY 13 white five-pointed stars in one even circle, matching the star pattern '
             'of the second reference image (the 1777 Betsy Ross flag). Keep the fabric folds, backlit golden '
             'lighting, and the entire rest of the scene exactly unchanged.',
             verify=lambda png: (count_stars(png) == 13, f'{count_stars(png)} stars'), attempts=6)
    elif which == '09':
        edit('09-faces', 'film/usflag_ref.png',
             'In the first image, fix the large softly-out-of-focus American flag waving in the background so it '
             'matches the official United States flag shown in the second reference image: exactly 13 alternating '
             'horizontal stripes (7 red, 6 white, red at the top and bottom) and a blue canton with 50 small white '
             'stars. Keep it softly out of focus behind the people, same warm golden-hour lighting and gentle wave. '
             'Do not change the people, their faces, clothing, or anything else in the scene.')
