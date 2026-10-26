#!/usr/bin/env python3
"""Gera os ícones PWA do RawrKô: dino fofo desenhado com PIL."""
from PIL import Image, ImageDraw

MINT       = (127, 200, 169, 255)   # corpo
MINT_DARK  = (91, 169, 138, 255)    # contorno
MINT_PALE  = (228, 246, 238, 255)   # barriga
PINK       = (245, 143, 176, 255)   # espinhos
PINK_SOFT  = (245, 143, 176, 130)   # bochechas
CREAM      = (253, 248, 240, 255)   # fundo
COCOA      = (107, 79, 79, 255)     # olhos/boca
WHITE      = (255, 255, 255, 255)


def rounded_bg(size, radius_ratio=0.22):
    """Fundo quadrado com cantos arredondados."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = int(size * radius_ratio)
    d.rounded_rectangle([0, 0, size, size], radius=r, fill=CREAM)
    return img, d


def draw_dino(img, d, s):
    """Desenha o dino fofo. s = escala (tamanho da imagem em px)."""
    def S(v):  # coordenada relativa 0..100
        return int(v * s / 100)

    # corpo (elipse grande)
    d.ellipse([S(18), S(28), S(82), S(88)], fill=MINT, outline=MINT_DARK, width=max(2, S(2)))

    # barriga
    d.ellipse([S(30), S(52), S(70), S(84)], fill=MINT_PALE)

    # espinhos nas costas
    for cx, cy in [(38, 30), (50, 24), (62, 30)]:
        d.polygon([(S(cx - 5), S(cy + 6)), (S(cx), S(cy - 6)), (S(cx + 5), S(cy + 6))], fill=PINK)

    # olhos
    for ex in (40, 60):
        d.ellipse([S(ex - 7), S(38), S(ex + 7), S(52)], fill=WHITE)
        d.ellipse([S(ex - 4), S(41), S(ex + 4), S(49)], fill=COCOA)
        d.ellipse([S(ex - 2.5), S(42.5), S(ex - 0.5), S(44.5)], fill=WHITE)

    # bochechas
    for bx in (28, 68):
        d.ellipse([S(bx - 6), S(54), S(bx + 6), S(63)], fill=PINK_SOFT)

    # boquinha
    d.arc([S(42), S(50), S(58), S(62)], start=15, end=165, fill=COCOA, width=max(2, S(1.6)))

    # pezinhos
    for fx in (36, 64):
        d.rounded_rectangle([S(fx - 8), S(84), S(fx + 8), S(92)], radius=S(4), fill=MINT_DARK)

    return img


def make_icon(size, maskable=False):
    img, d = rounded_bg(size)
    if maskable:
        # zona segura: conteúdo em ~66% central
        pad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        pd = ImageDraw.Draw(pad)
        pd.rounded_rectangle([0, 0, size, size], radius=size // 2, fill=CREAM)
        icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        inner = img.copy()
        draw_dino(inner, ImageDraw.Draw(inner), int(size * 0.72))
        icon.paste(inner, (int(size * 0.14), int(size * 0.14)), inner)
        return icon
    return draw_dino(img, d, size)


import os
os.makedirs("icons", exist_ok=True)
make_icon(192).save("icons/icon-192.png")
make_icon(512).save("icons/icon-512.png")
make_icon(512, maskable=True).save("icons/maskable-512.png")
make_icon(64).save("icons/icon-64.png")
print("Ícones gerados:", os.listdir("icons"))
