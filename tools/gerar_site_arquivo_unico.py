"""Gera out/site-arquivo-unico/index.html: o mini-site com imagens e fontes embutidas
(um arquivo só, para soltar no Netlify). Uso: python3 tools/gerar_site_arquivo_unico.py"""
import base64, os, re

RAIZ = os.path.join(os.path.dirname(__file__), "..")
SITE = os.path.join(RAIZ, "site")
SAIDA = os.path.join(RAIZ, "out", "site-arquivo-unico", "index.html")
b64 = lambda p, m: f"data:{m};base64," + base64.b64encode(open(os.path.join(SITE, p), "rb").read()).decode()

src = open(os.path.join(SITE, "index.html"), encoding="utf-8").read()
imgs = {os.path.splitext(f)[0]: b64("assets/" + f, "image/webp") for f in os.listdir(os.path.join(SITE, "assets")) if f.endswith(".webp")}
for f in os.listdir(os.path.join(SITE, "assets", "fonts")):
    src = src.replace("assets/fonts/" + f, b64("assets/fonts/" + f, "font/woff2"))
src = re.sub(r'src="assets/([a-z0-9-]+)\.webp"', r'data-img="\1"', src)
src = src.replace("url(assets/logo-nome.webp)", "var(--mask-nome)")
src = src.replace('<link rel="icon" href="assets/logo-mini.webp">', "")
src = src.replace('content="assets/ronalds.webp"', 'content=""')
src = src.replace('src="assets/${d.img}.webp"', 'src="${IMG[d.img]}"')
boot = ("<script>const IMG=" + repr(imgs).replace("'", '"') + ";\n"
        'document.documentElement.style.setProperty("--mask-nome",`url(${IMG["logo-nome"]})`);\n'
        'const _fill=()=>document.querySelectorAll("img[data-img]").forEach(i=>{i.src=IMG[i.dataset.img];i.removeAttribute("data-img")});\n'
        'document.addEventListener("DOMContentLoaded",_fill);</script>\n')
src = src.replace("<body>", "<body>\n" + boot, 1)
src = src.replace('document.getElementById("horario")', '_fill();\ndocument.getElementById("horario")', 1)
assert "assets/" not in src, re.findall(r"assets/[^\"'`) ]+", src)[:5]
os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
open(SAIDA, "w", encoding="utf-8").write(src)
print(SAIDA, round(len(src) / 1e6, 2), "MB")
