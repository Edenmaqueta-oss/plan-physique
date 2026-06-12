#!/usr/bin/env python3
"""Génère des icônes PNG (fond sombre + carré arrondi jaune) sans dépendance externe."""
import struct
import zlib
import os

BG = (15, 17, 23)      # #0f1117
ACCENT = (232, 255, 47)  # #e8ff47

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')


def rounded_square(x, y, cx, cy, half, rad):
    dx = abs(x - cx)
    dy = abs(y - cy)
    if dx > half or dy > half:
        return False
    if dx > half - rad and dy > half - rad:
        return (dx - (half - rad)) ** 2 + (dy - (half - rad)) ** 2 <= rad * rad
    return True


def make_png(path, size, full_bleed=False):
    cx = cy = size / 2
    half = size * (0.5 if full_bleed else 0.34)
    rad = size * (0.0 if full_bleed else 0.16)
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filtre 0
        for x in range(size):
            inside = rounded_square(x, y, cx, cy, half, rad)
            r, g, b = ACCENT if inside else BG
            raw += bytes((r, g, b))
    comp = zlib.compress(bytes(raw), 9)

    def chunk(typ, data):
        return (
            struct.pack('>I', len(data))
            + typ
            + data
            + struct.pack('>I', zlib.crc32(typ + data) & 0xFFFFFFFF)
        )

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)  # RGB 8 bits
    with open(path, 'wb') as f:
        f.write(sig + chunk(b'IHDR', ihdr) + chunk(b'IDAT', comp) + chunk(b'IEND', b''))
    print('wrote', path)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    make_png(os.path.join(OUT, 'icon-192.png'), 192)
    make_png(os.path.join(OUT, 'icon-512.png'), 512)
    make_png(os.path.join(OUT, 'apple-touch-icon.png'), 180, full_bleed=True)
