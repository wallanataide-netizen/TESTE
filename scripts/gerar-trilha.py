"""Gera uma trilha instrumental alegre de 20 s (public/audio/trilha.wav).

Progressão C - G - Am - F a 108 BPM com dedilhado tipo violão/marimba,
pad suave, baixo e percussão leve. Tudo sintetizado com numpy.
"""
import wave
import sys
import numpy as np

SR = 48000
DUR = 20.0
BPM = 108
BEAT = 60 / BPM
N = int(SR * DUR)
out = np.zeros((N, 2))


def nota(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def add(sinal, inicio, pan=0.0):
    i = int(inicio * SR)
    if i >= N:
        return
    s = sinal[: N - i]
    out[i : i + len(s), 0] += s * (1 - pan) / 2 * 2 ** 0.5
    out[i : i + len(s), 1] += s * (1 + pan) / 2 * 2 ** 0.5


def pluck(f, dur=1.2, vol=0.18):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 5.5) * np.minimum(1, t * 400)
    s = sum(np.sin(2 * np.pi * f * k * t) / k ** 1.6 for k in range(1, 7))
    return s * env * vol


def pad(freqs, dur, vol=0.05):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)
    s = sum(
        np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.003 * t)
        for f in freqs
    )
    return s * env * vol


def baixo(f, dur, vol=0.22):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 2.5) * np.minimum(1, t * 200)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * env * vol


def kick(vol=0.35):
    t = np.arange(int(SR * 0.35)) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12) * vol


def shaker(vol=0.05):
    rng = np.random.default_rng(1)
    t = np.arange(int(SR * 0.08)) / SR
    return rng.standard_normal(len(t)) * np.exp(-t * 60) * vol


# Acordes (MIDI): C, G, Am, F
acordes = [
    [60, 64, 67, 72],
    [55, 59, 62, 67],
    [57, 60, 64, 69],
    [53, 57, 60, 65],
]
baixos = [36, 43, 45, 41]
padrao = [0, 2, 1, 3, 2, 1, 3, 2]  # dedilhado em colcheias

compasso = 4 * BEAT
t = 0.0
c = 0
while t < DUR:
    idx = c % 4
    ac = acordes[idx]
    add(pad([nota(m) for m in ac[:3]], compasso + 0.3), t)
    add(baixo(nota(baixos[idx]), compasso * 0.5), t)
    add(baixo(nota(baixos[idx]), compasso * 0.5), t + 2 * BEAT)
    for k, p in enumerate(padrao):
        add(pluck(nota(ac[p] + 12)), t + k * BEAT / 2, pan=0.3 if k % 2 else -0.3)
    for b in range(4):
        if c > 0 or b >= 2:
            add(kick(), t + b * BEAT)
        for h in range(2):
            add(shaker(), t + b * BEAT + h * BEAT / 2, pan=0.5)
    t += compasso
    c += 1

# Final: acorde de C sustentado
add(pad([nota(m) for m in [48, 60, 64, 67, 72]], 2.2, vol=0.06), DUR - 2.2)

# Fade in/out e normalização
fade = np.ones(N)
fade[: int(SR * 0.4)] = np.linspace(0, 1, int(SR * 0.4))
fade[-int(SR * 1.5) :] = np.linspace(1, 0, int(SR * 1.5))
out *= fade[:, None]
out /= np.max(np.abs(out)) / 0.8

with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype("<i2").tobytes())
