#!/usr/bin/env bash
# Gera as falas da narração (public/audio/narracao-N.mp3) com a voz offline Piper pt-BR.
# Requisitos: pip install piper-tts, ffmpeg e a voz pt-br-edresson-low:
#   https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-pt-br-edresson-low.tar.gz
# Uso: scripts/gerar-narracao.sh caminho/para/pt-br-edresson-low.onnx
# Para usar uma locução profissional, basta substituir os arquivos MP3 com os mesmos nomes.
set -euo pipefail
MODELO="$1"
TMP="$(mktemp -d)"
falar() { # numero, velocidade (length-scale), pausa entre frases, texto
  echo "$4" | python3 -m piper -m "$MODELO" -f "$TMP/l$1.wav" --length-scale "$2" --sentence-silence "$3"
  ffmpeg -v error -y -i "$TMP/l$1.wav" \
    -af "aresample=48000,highpass=f=90,equalizer=f=200:t=q:w=1:g=3,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-18dB:ratio=3,loudnorm=I=-16:TP=-1.5" \
    -ac 1 -b:a 160k "public/audio/narracao-$1.mp3"
}
falar 1 0.98 0.1  "Tem sabor que transforma os momentos à mesa!"
falar 2 0.9  0.1  "Pastel Calabresa: crocância e sabor em cada pedaço."
falar 3 0.98 0.1  "Manteiga do Sertão: aquele gostinho de tradição."
falar 4 0.9  0.1  "Rainha Especial: um toque irresistível para compartilhar."
falar 5 0.84 0.06 "Massas Bom Gosto. Qualidade na sua mesa. Prove e aprove!"
rm -rf "$TMP"
