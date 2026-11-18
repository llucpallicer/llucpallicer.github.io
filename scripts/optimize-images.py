#!/usr/bin/env python3
"""
Optimizes images in public/images/ to reduce footprint while maintaining high visual quality.
- Desktop images: max 1920px
- Phone images: max 1080px
- Quality: 83 JPEG progressive, optimize=True
"""

import os
import sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(ROOT_DIR, 'public', 'images')

def get_target_settings(path):
    is_phone = '/phone/' in path
    max_dim = 1080 if is_phone else 1920
    return max_dim, 83

def optimize_image(path):
    try:
        max_dim, quality = get_target_settings(path)
        with Image.open(path) as im:
            if im.mode != 'RGB':
                im = im.convert('RGB')
            
            w, h = im.size
            if max(w, h) > max_dim:
                im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            
            tmp_path = path + '.opt.tmp'
            im.save(tmp_path, format='JPEG', quality=quality, optimize=True, progressive=True)
            
            orig_sz = os.path.getsize(path)
            new_sz = os.path.getsize(tmp_path)
            
            # Atomic replace
            os.replace(tmp_path, path)
            return True, path, orig_sz, new_sz
    except Exception as e:
        if os.path.exists(path + '.opt.tmp'):
            try:
                os.remove(path + '.opt.tmp')
            except Exception:
                pass
        return False, path, str(e), 0

def main():
    all_files = []
    for root, dirs, files in os.walk(IMAGES_DIR):
        for f in files:
            if f.startswith('.'):
                continue
            all_files.append(os.path.join(root, f))
    
    print(f"Found {len(all_files)} images in {IMAGES_DIR}")
    print("Optimizing images...")
    
    orig_total = 0
    new_total = 0
    failed = 0
    
    # 8 threads for I/O and libjpeg processing
    with ThreadPoolExecutor(max_workers=8) as executor:
        for success, path, orig_sz, new_sz in executor.map(optimize_image, all_files):
            if success:
                orig_total += orig_sz
                new_total += new_sz
            else:
                failed += 1
                print(f"Failed {path}: {orig_sz}", file=sys.stderr)
    
    print("\n================== SUMMARY ==================")
    print(f"Processed:     {len(all_files) - failed}/{len(all_files)} images")
    print(f"Original size: {orig_total / (1024 * 1024):.2f} MB")
    print(f"New size:      {new_total / (1024 * 1024):.2f} MB")
    if orig_total > 0:
        print(f"Savings:       {(1 - new_total / orig_total) * 100:.1f}%")
    print("=============================================")

if __name__ == '__main__':
    main()
