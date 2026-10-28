#!/bin/sh
# Gera index.html (página completa, pronta para o GitHub Pages) a partir de catalogo.html.
# Tudo até o fim do primeiro </style> vai para o <head>, para o WhatsApp ler as tags de prévia do link.
cd "$(dirname "$0")"
python3 - <<'PY'
s = open("catalogo.html", encoding="utf-8").read()
i = s.index("</style>") + len("</style>")
head, body = s[:i], s[i:]
open("index.html", "w", encoding="utf-8").write(
    '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
    + head + "\n</head>\n<body>" + body + "\n</body>\n</html>\n")
PY
