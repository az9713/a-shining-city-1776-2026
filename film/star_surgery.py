# Deterministic 13-star fix: inpaint existing stars, redraw exact Betsy Ross circle
# warped through the canton's perspective, shaded by local fabric luminance.
import numpy as np, cv2

SRC = 'film/stills/03-first-flag.png'
OUT = 'film/stills/03-first-flag.png'  # in-place; archive copy made by caller

img = cv2.imread(SRC)
h, w = img.shape[:2]

# --- locate canton: HSV blue (tolerant of warm backlight), hull over all fragments ---
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
blue = cv2.inRange(hsv, (95, 50, 40), (150, 255, 255))
blue = cv2.morphologyEx(blue, cv2.MORPH_CLOSE, np.ones((25,25), np.uint8))
cnts, _ = cv2.findContours(blue, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
big = [c for c in cnts if cv2.contourArea(c) > 500]
allpts = np.vstack([c.reshape(-1,2) for c in big])
canton = cv2.convexHull(allpts.reshape(-1,1,2))

# 4-corner quad from hull extremes (canton edge is wavy; approx quad is fine)
pts = canton.reshape(-1, 2).astype(np.float32)
s = pts.sum(1); d = pts[:,0] - pts[:,1]
quad = np.array([pts[s.argmin()], pts[d.argmax()], pts[s.argmax()], pts[d.argmin()]], np.float32)

# --- erase existing stars (inpaint keeps fold shading) ---
canton_mask = np.zeros((h, w), np.uint8)
cv2.drawContours(canton_mask, [canton], -1, 255, -1)
b, g, r = img[:,:,0].astype(int), img[:,:,1].astype(int), img[:,:,2].astype(int)
white = ((r > 110) & (g > 110) & (b > 110)).astype(np.uint8) * 255
stars_mask = cv2.bitwise_and(white, canton_mask)
stars_mask = cv2.dilate(stars_mask, np.ones((11,11), np.uint8))
clean = cv2.inpaint(img, stars_mask, 5, cv2.INPAINT_TELEA)
# dark navy ghost star near canton edge: flat median-blue fill, feathered
ghost = np.zeros((h, w), np.uint8); cv2.circle(ghost, (922, 276), 42, 255, -1)
ghost = cv2.bitwise_and(ghost, canton_mask)
ann = np.zeros((h, w), np.uint8); cv2.circle(ann, (922, 276), 80, 255, -1); cv2.circle(ann, (922, 276), 46, 0, -1)
ann = cv2.bitwise_and(ann, canton_mask)
sel = (ann > 0) & (clean[:,:,2] < 150)  # exclude white star pixels from sample
med = np.median(clean[sel], axis=0)
alpha = cv2.GaussianBlur(ghost.astype(np.float32)/255, (31,31), 0)[..., None]
clean = (clean.astype(np.float32)*(1-alpha) + med[None,None,:]*alpha).astype(np.uint8)

# --- luminance field of the clean canton (fold shading) ---
lum = cv2.cvtColor(clean, cv2.COLOR_BGR2GRAY).astype(np.float32)
lum_blur = cv2.GaussianBlur(lum, (31,31), 0)
canton_vals = lum_blur[canton_mask > 0]
lum_ref = np.percentile(canton_vals, 85)  # bright areas of fabric

# --- draw 13 stars in unit space, warp through homography ---
U = 1000
unit = np.zeros((U, U), np.float32)
cx, cy, R, r1 = 0.5*U, 0.5*U, 0.32*U, 0.062*U
r2 = r1 * 0.382
for k in range(13):
    ang = -90 + k * 360.0/13
    sx, sy = cx + R*np.cos(np.radians(ang)), cy + R*np.sin(np.radians(ang))
    pts = []
    for p in range(10):
        rr = r1 if p % 2 == 0 else r2
        pa = np.radians(ang + p*36)
        pts.append([sx + rr*np.cos(pa), sy + rr*np.sin(pa)])
    cv2.fillPoly(unit, [np.array(pts, np.int32)], 1.0)
unit = cv2.GaussianBlur(unit, (5,5), 0)  # soft edge like stitched fabric

Hm = cv2.getPerspectiveTransform(
    np.array([[0,0],[U,0],[U,U],[0,U]], np.float32), quad)
star_field = cv2.warpPerspective(unit, Hm, (w, h))
star_field = np.clip(star_field, 0, 1) * (canton_mask > 0)

# --- composite: white stars modulated by fabric luminance ---
shade = np.clip(lum_blur / lum_ref, 0.82, 1.05)
star_rgb = np.zeros_like(img, np.float32)
for c, base in enumerate((248, 250, 252)):  # slightly warm white
    star_rgb[:,:,c] = base * shade
out = clean.astype(np.float32) * (1 - star_field[...,None]) + star_rgb * star_field[...,None]
cv2.imwrite(OUT, out.astype(np.uint8))
print('star surgery done')
