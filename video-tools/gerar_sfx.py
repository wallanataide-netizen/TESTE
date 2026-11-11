"""Sintetiza os efeitos sonoros do anúncio (44.1 kHz, estéreo) em public/sfx/."""
import numpy as np, scipy.io.wavfile as wf, scipy.signal as ss, os
SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r):  # ataque/decay exponencial
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (r * SR)); return e
def bp(x, lo, hi, o=2): return ss.sosfilt(ss.butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def lp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return ss.sosfilt(ss.butter(o, f, "high", fs=SR, output="sos"), x)
def salvar(nome, x, pan=0.0, ganho=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * ganho
    st = np.stack([x * (1 - max(pan, 0)), x * (1 + min(pan, 0))], 1)
    wf.write(os.path.join(OUT, nome), SR, (st * 32767).astype(np.int16))

def sweep_noise(d, f0, f1, q=0.35):
    n = int(SR * d); x = rng.standard_normal(n); out = np.zeros(n); blk = 512
    for i in range(0, n, blk):
        f = f0 * (f1 / f0) ** (i / n); lo, hi = f * (1 - q), min(f * (1 + q), SR / 2 - 100)
        out[i:i + blk] = bp(x[i:i + blk + 0], lo, hi)[: len(out[i:i + blk])]
    return lp(out, 9000)

# Whoosh longo (transições de cena)
d = 0.9; n = int(SR * d); w = sweep_noise(d, 300, 4500)
shape = np.sin(np.linspace(0, np.pi, n)) ** 2
salvar("whoosh.wav", w * shape, ganho=0.8)

# Swoosh curto (troca de lanche)
d = 0.35; n = int(SR * d); w = sweep_noise(d, 800, 6000, 0.5)
salvar("swoosh.wav", w * np.sin(np.linspace(0, np.pi, n)) ** 1.5, ganho=0.7)

# Impacto grave (logo): boom senoidal com queda de pitch + estalo
d = 1.6; tt = t(d); f = 95 * np.exp(-tt * 3) + 38
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.003, 0.45)
click = lp(rng.standard_normal(len(tt)), 3000) * env(len(tt), 0.001, 0.025)
cauda = lp(rng.standard_normal(len(tt)), 400) * env(len(tt), 0.01, 0.5) * 0.25
salvar("impacto.wav", boom + 0.5 * click + cauda, ganho=0.95)

# Brilho (shimmer dourado): arpejo agudo cintilante
d = 1.4; tt = t(d); x = np.zeros(len(tt))
for k, fr in enumerate([1568, 2093, 2637, 3136, 4186, 5274]):
    st = int(k * 0.07 * SR); seg = tt[: len(tt) - st]
    x[st:] += np.sin(2 * np.pi * fr * seg) * np.exp(-seg / 0.35) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * seg))
x += hp(rng.standard_normal(len(tt)), 7000) * env(len(tt), 0.05, 0.4) * 0.15
salvar("brilho.wav", x, ganho=0.55)

# Pop (letras/selos entrando)
d = 0.18; tt = t(d); f = 900 * np.exp(-tt * 30) + 250
salvar("pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.04), ganho=0.7)

# Gelo tilintando
d = 1.2; tt = t(d); x = np.zeros(len(tt))
for st, fr in [(0.0, 3200), (0.12, 4100), (0.27, 2900), (0.41, 3700), (0.6, 4500)]:
    i = int(st * SR); seg = tt[: len(tt) - i]
    x[i:] += (np.sin(2 * np.pi * fr * seg) + 0.5 * np.sin(2 * np.pi * fr * 2.7 * seg)) * np.exp(-seg / 0.07)
salvar("gelo.wav", x, ganho=0.5)

# Lata abrindo: "tsss" + estalo
d = 1.3; tt = t(d); n = len(tt)
estalo = hp(rng.standard_normal(n), 1500) * env(n, 0.001, 0.012)
fizz = bp(rng.standard_normal(n), 3000, 12000) * env(n, 0.02, 0.5) * (1 + 0.3 * rng.standard_normal(n))
salvar("lata.wav", estalo * 1.5 + fizz * 0.6, ganho=0.6)
print("ok", sorted(os.listdir(OUT)))
