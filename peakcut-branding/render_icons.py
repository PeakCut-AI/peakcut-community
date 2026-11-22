"""Rasterize the existing Peakcut waveform geometry for PWA icon sizes."""
from pathlib import Path
from PIL import Image, ImageDraw

target = Path("packages/client/scripts/assets_fallback/web")
for size in (192, 512):
    image = Image.new("RGBA", (size, size), "#09090b")
    draw = ImageDraw.Draw(image)
    scale = size / 64

    def box(x, y, w, h):
        return tuple(v * scale for v in (x, y, x + w, y + h))

    for x, height in ((2, 10), (8, 17), (14, 26), (20, 13), (26, 8)):
        draw.rounded_rectangle(
            box(8 + x * 1.5, 8 + (19 - height / 2) * 1.5, 6, height * 1.5),
            radius=3 * scale,
            fill="#c8f24e" if x == 14 else "#737377",
        )
    for coords in ((12, 3.5, 9.5, 3.5, 9.5, 6.5), (20, 3.5, 22.5, 3.5, 22.5, 6.5)):
        draw.line([(int((8 + coords[i] * 1.5) * scale), int((8 + coords[i+1] * 1.5) * scale)) for i in (0, 2, 4)], fill="#c8f24e", width=max(1, round(2.4 * scale)))
    image.save(target / f"android-chrome-{size}x{size}.png")
    if size == 512:
        image.save(target / "masking-512x512.png")
        image.save(target / "icon.ico", sizes=[(32, 32), (64, 64)])
