#!/bin/sh
# Copia o catálogo para o repositório do site (catalogobomgosto.github.io), trocando o endereço da prévia do link.
# Uso: ./publicar.sh /caminho/para/catalogobomgosto.github.io
set -e
cd "$(dirname "$0")"
./build.sh
DEST="$1"
cp -r img "$DEST/"
sed 's#https://wallanataide-netizen.github.io/TESTE/catalogo/#https://catalogobomgosto.github.io/#g' index.html > "$DEST/index.html"
