import os
import re
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
INPUT_DIR = os.path.join(ROOT_DIR, 'kirshnacastimages')
OUTPUT_DIR = os.path.join(ROOT_DIR, 'assets', 'paper', 'cast_krishna')

def clean_name(raw_name, idx):
    base, _ = os.path.splitext(raw_name)
    clean = re.sub(r'(\.jpg)?_[a-f0-9]{8}$', '', base, flags=re.IGNORECASE)
    clean = re.sub(r'^(Lord_Krishna|Young_Krishna|Krishna)_', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'^(Character|Figure|Divine_figure|Deity|Young_figure|Young_craftsman|Young_character|Portrait|Watercolor_portrait|Charcoal_sketch|Slumped_character|Man)_', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'[^a-zA-Z0-9]+', '_', clean).strip('_').lower()
    return f"krishna_{idx+1:03d}_{clean}.png"

def remove_background(img):
    img = img.convert("RGBA")
    w, h = img.size
    pixels = img.load()

    # Sample corners for paper background color
    samples = []
    for x in range(15):
        for y in range(15):
            samples.append(pixels[x, y][:3])
            samples.append(pixels[w - 1 - x, y][:3])
            samples.append(pixels[x, h - 1 - y][:3])
            samples.append(pixels[w - 1 - x, h - 1 - y][:3])

    bg_r = sum(s[0] for s in samples) / len(samples)
    bg_g = sum(s[1] for s in samples) / len(samples)
    bg_b = sum(s[2] for s in samples) / len(samples)

    color_tol = 46.0
    feather = 24.0

    visited = bytearray(w * h)
    queue = []

    def is_paper(r, g, b):
        dr = r - bg_r
        dg = g - bg_g
        db = b - bg_b
        return (dr*dr + dg*dg + db*db)**0.5 < color_tol

    # Seed borders
    for x in range(w):
        if is_paper(*pixels[x, 0][:3]):
            visited[x] = 1
            queue.append((x, 0))
        if is_paper(*pixels[x, h - 1][:3]):
            visited[(h - 1) * w + x] = 1
            queue.append((x, h - 1))

    for y in range(h):
        if not visited[y * w] and is_paper(*pixels[0, y][:3]):
            visited[y * w] = 1
            queue.append((0, y))
        if not visited[y * w + (w - 1)] and is_paper(*pixels[w - 1, y][:3]):
            visited[y * w + (w - 1)] = 1
            queue.append((w - 1, y))

    head = 0
    while head < len(queue):
        cx, cy = queue[head]
        head += 1
        for nx, ny in ((cx-1, cy), (cx+1, cy), (cx, cy-1), (cx, cy+1)):
            if 0 <= nx < w and 0 <= ny < h:
                n_idx = ny * w + nx
                if not visited[n_idx] and is_paper(*pixels[nx, ny][:3]):
                    visited[n_idx] = 1
                    queue.append((nx, ny))

    for y in range(h):
        for x in range(w):
            idx = y * w + x
            r, g, b, _ = pixels[x, y]
            if visited[idx]:
                pixels[x, y] = (r, g, b, 0)
            else:
                dr = r - bg_r
                dg = g - bg_g
                db = b - bg_b
                dist = (dr*dr + dg*dg + db*db)**0.5
                if dist < color_tol + feather:
                    alpha = int(min(255, max(0, ((dist - color_tol) / feather) * 255)))
                    pixels[x, y] = (r, g, b, alpha)

    return img

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    files = sorted([f for f in os.listdir(INPUT_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    print(f"Processing {len(files)} Krishna images...")

    for i, f in enumerate(files):
        src_path = os.path.join(INPUT_DIR, f)
        out_name = clean_name(f, i)
        out_path = os.path.join(OUTPUT_DIR, out_name)

        with Image.open(src_path) as img:
            cutout = remove_background(img)
            cutout.save(out_path, format="PNG")

        print(f"[{i+1:03d}/{len(files)}] Done: {out_name}")

    print(f"\nAll images converted and saved to: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
