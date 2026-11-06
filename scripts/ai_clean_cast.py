"""
Studio-Grade AI Background Remover using rembg (U2-Net)
Automatically removes deckle edges, borders, textures, and specks.
"""
import os
import re
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("\n❌ 'rembg' or 'pillow' is not installed.")
    print("👉 Please install it by running: pip install rembg pillow\n")
    exit(1)

ROOT_DIR = Path(__file__).resolve().parent.parent

def clean_name(raw_name, prefix, idx):
    stem = Path(raw_name).stem
    clean = re.sub(r'(\.jpg)?_[a-f0-9]{8}$', '', stem, flags=re.IGNORECASE)
    clean = re.sub(r'^(Lord_Krishna|Young_Krishna|Krishna|Character|Figure|Woman|Kneeling_woman|Seated_woman|Standing_figure|Young_person|Youthful_girl|Divine_figure|Deity|Young_craftsman|Young_character|Portrait|Watercolor_portrait|Charcoal_sketch|Slumped_character|Man)_', '', clean, flags=re.IGNORECASE)
    clean = re.sub(r'^young_chan_d88a4776_2K$', 'art_portrait', clean, flags=re.IGNORECASE)
    clean = re.sub(r'[^a-zA-Z0-9]+', '_', clean).strip('_').lower()
    return f"{prefix}_{idx+1:03d}_{clean}.png"

def process_dir(input_dir, output_dir, prefix):
    if not input_dir.exists():
        return
    output_dir.mkdir(parents=True, exist_ok=True)
    files = sorted([f for f in input_dir.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']])
    print(f"\n✨ Processing {len(files)} {prefix.upper()} images using AI (rembg)...")

    for i, file_path in enumerate(files):
        out_name = clean_name(file_path.name, prefix, i)
        out_path = output_dir / out_name

        with Image.open(file_path) as img:
            # Crop 2% outer border to eliminate paper frame
            w, h = img.size
            crop_margin = 25
            cropped = img.crop((crop_margin, crop_margin, w - crop_margin, h - crop_margin))

            # Run AI segmentation
            result = remove(cropped)
            result.save(out_path, format="PNG")

        print(f"[{i+1:03d}/{len(files)}] ✓ {out_name}")

if __name__ == '__main__':
    process_dir(ROOT_DIR / 'Radha Cast Images', ROOT_DIR / 'assets' / 'paper' / 'cast_radha', 'radha')
    process_dir(ROOT_DIR / 'kirshnacastimages', ROOT_DIR / 'assets' / 'paper' / 'cast_krishna', 'krishna')
    print("\n🎉 All cast images processed with AI precision!")
