# ponytail: brute-force loop — Seedream can't count, we can. Retry edit until blob count == 13.
import json, time, base64, urllib.request, re
import numpy as np
from PIL import Image
from scipy import ndimage
import io

KEY = re.search(r'FAL_KEY=(.+)', open('.env').read()).group(1).strip()
H = {'Authorization': 'Key ' + KEY, 'Content-Type': 'application/json'}
base_url = json.load(open('film/batch1.json'))['03-first-flag']['url']
ref = 'data:image/png;base64,' + base64.b64encode(open('film/betsy_ref.png','rb').read()).decode()

PROMPT = ('Edit the first image only in the blue canton of the waving flag: replace the white stars so there are '
          'exactly 13 five-pointed white stars arranged in one even circle - count carefully, thirteen stars - '
          'exactly matching the star pattern of the second reference image (the 1777 Betsy Ross flag). Keep the flag '
          'realistically waving with the same lighting, fabric folds, and everything else in the scene completely unchanged.')

def req(url, data=None):
    r = urllib.request.Request(url, data=json.dumps(data).encode() if data else None, headers=H)
    return json.loads(urllib.request.urlopen(r).read())

def count_stars(png_bytes):
    img = np.array(Image.open(io.BytesIO(png_bytes)).convert('RGB')).astype(int)
    blue = (img[:,:,2] > 100) & (img[:,:,2] > img[:,:,0] + 30) & (img[:,:,1] < img[:,:,2])
    ys, xs = np.where(blue)
    region = img[ys.min():ys.max(), xs.min():xs.max()]
    white = (region[:,:,0] > 170) & (region[:,:,1] > 170) & (region[:,:,2] > 170)
    lab, n = ndimage.label(white)
    sizes = ndimage.sum(white, lab, range(1, n+1))
    return int((sizes > 300).sum())

for attempt in range(1, 5):
    j = req('https://queue.fal.run/fal-ai/bytedance/seedream/v4/edit',
            {'prompt': PROMPT, 'image_urls': [base_url, ref], 'image_size': 'landscape_16_9'})
    while True:
        time.sleep(5)
        st = req(j['status_url'])
        if st['status'] == 'COMPLETED':
            break
    res = req(j['response_url'])
    url = res.get('images', [{}])[0].get('url')
    if not url:
        print(f'attempt {attempt}: ERROR', str(res)[:150]); continue
    png = urllib.request.urlopen(url).read()
    n = count_stars(png)
    print(f'attempt {attempt}: {n} stars')
    if n == 13:
        open('film/stills/03-first-flag-edit.png','wb').write(png)
        s = json.load(open('film/batch1.json'))
        s['03-first-flag-edit'] = {'url': url, 'file': 'film/stills/03-first-flag-edit.png'}
        json.dump(s, open('film/batch1.json','w'), indent=2)
        print('SUCCESS - saved')
        break
else:
    print('no 13-star result in 4 attempts')
