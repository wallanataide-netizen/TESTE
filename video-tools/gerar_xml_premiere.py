"""Gera a linha do tempo do anúncio para o Premiere Pro (Final Cut Pro XML / xmeml v4).

Uso: python3 video-tools/gerar_xml_premiere.py <pasta_do_pacote> [raiz_no_windows]
A pasta do pacote deve conter 01_video_1080x1920.mp4, 02_locucao.wav e SFX/*.wav.
Os caminhos no XML apontam para <raiz_no_windows>/Ronalds_Anuncio (padrão C:/), para que o
Premiere encontre as mídias sozinho se a pasta for extraída em C:\\.
"""
import os
import subprocess
import sys
from xml.sax.saxutils import escape

FPS = 30
W, H = 1080, 1920
PASTA = sys.argv[1]
RAIZ = (sys.argv[2] if len(sys.argv) > 2 else "C:/").rstrip("/")
NOME_PACOTE = os.path.basename(os.path.normpath(PASTA))


def dur_frames(arq: str) -> int:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(PASTA, arq)]
    )
    return int(round(float(out) * FPS))


def url(arq: str) -> str:
    return f"file://localhost/{RAIZ}/{NOME_PACOTE}/{arq}".replace(" ", "%20")


def rate() -> str:
    return f"<rate><timebase>{FPS}</timebase><ntsc>FALSE</ntsc></rate>"


arquivos: dict[str, str] = {}


def file_el(arq: str, tipo: str) -> str:
    """Primeira ocorrência descreve o arquivo; as seguintes só referenciam o id."""
    if arq in arquivos:
        return f'<file id="{arquivos[arq]}"/>'
    fid = f"file-{len(arquivos) + 1}"
    arquivos[arq] = fid
    d = dur_frames(arq)
    if tipo == "video":
        midia = (
            f"<media><video><samplecharacteristics>{rate()}<width>{W}</width><height>{H}</height>"
            f"<pixelaspectratio>square</pixelaspectratio></samplecharacteristics></video></media>"
        )
    else:
        midia = (
            "<media><audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate>"
            "</samplecharacteristics><channelcount>2</channelcount></audio></media>"
        )
    return (
        f'<file id="{fid}"><name>{escape(os.path.basename(arq))}</name><pathurl>{url(arq)}</pathurl>'
        f"{rate()}<duration>{d}</duration>{midia}</file>"
    )


cid = 0


def clip(arq: str, tipo: str, inicio: int, dur: int, ganho_db: float = 0.0) -> str:
    global cid
    cid += 1
    nome = escape(os.path.splitext(os.path.basename(arq))[0])
    filtro = ""
    if tipo == "audio" and ganho_db:
        nivel = 10 ** (ganho_db / 20)
        filtro = (
            "<filter><effect><name>Audio Levels</name><effectid>audiolevels</effectid>"
            "<effectcategory>audiolevels</effectcategory><effecttype>audiolevels</effecttype>"
            "<mediatype>audio</mediatype><parameter><parameterid>level</parameterid><name>Level</name>"
            f"<valuemin>0</valuemin><valuemax>3.98109</valuemax><value>{nivel:.5f}</value></parameter>"
            "</effect></filter>"
        )
    extra = "<sourcetrack><mediatype>audio</mediatype><trackindex>1</trackindex></sourcetrack>" if tipo == "audio" else ""
    return (
        f'<clipitem id="clip-{cid}"><name>{nome}</name><enabled>TRUE</enabled><duration>{dur_frames(arq)}</duration>'
        f"{rate()}<start>{inicio}</start><end>{inicio + dur}</end><in>0</in><out>{dur}</out>"
        f"{file_el(arq, tipo)}{extra}{filtro}</clipitem>"
    )


def faixa(clipes: list[str]) -> str:
    return f"<track>{''.join(clipes)}</track>"


s = lambda seg: int(round(seg * FPS))  # segundos -> quadros
TOTAL = dur_frames("01_video_1080x1920.mp4")
ABERTURA = s(3.8)
CORTE = round(ABERTURA / 3)

v1 = faixa([clip("01_video_1080x1920.mp4", "video", 0, TOTAL)])
a1 = faixa([clip("02_locucao.wav", "audio", 0, dur_frames("02_locucao.wav"))])
# A2: um chiado por corte da abertura (smash · fumaça · queijo/bacon)
a2 = faixa([
    clip("SFX/01-chapa-smash-espatula.wav", "audio", 0, CORTE, -8),
    clip("SFX/02-chapa-chiado-fumaca.wav", "audio", CORTE, CORTE, -8),
    clip("SFX/03-queijo-e-bacon-estalando.wav", "audio", 2 * CORTE, ABERTURA - 2 * CORTE, -8),
])
# A3: cama de chiado contínuo por baixo da abertura
a3 = faixa([clip("SFX/04-chapa-chiado-continuo.wav", "audio", 0, ABERTURA, -16)])
# A4: entrada das bebidas (15,2 s): lata abrindo e gelo no copo
a4 = faixa([
    clip("SFX/07-lata-abrindo.wav", "audio", s(15.2), dur_frames("SFX/07-lata-abrindo.wav"), -8),
    clip("SFX/06-gelo-no-copo-e-refri.wav", "audio", s(15.6), min(dur_frames("SFX/06-gelo-no-copo-e-refri.wav"), s(3.8)), -8),
])

xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence id="seq-1">
    <name>Ronalds Lanches - Anuncio 1080x1920</name>
    <duration>{TOTAL}</duration>
    {rate()}
    <timecode>{rate()}<string>00:00:00:00</string><frame>0</frame><displayformat>NDF</displayformat></timecode>
    <media>
      <video>
        <format><samplecharacteristics>{rate()}<width>{W}</width><height>{H}</height>
          <pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></format>
        {v1}
      </video>
      <audio>
        <numOutputChannels>2</numOutputChannels>
        <format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
        {a1}{a2}{a3}{a4}
      </audio>
    </media>
  </sequence>
</xmeml>
"""
destino = os.path.join(PASTA, "Ronalds_Anuncio_Premiere.xml")
with open(destino, "w", encoding="utf-8") as f:
    f.write(xml)
print("ok", destino, "quadros:", TOTAL)
