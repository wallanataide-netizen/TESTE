"""Generates the sound effects used by the Loteamento video into public/sfx/.

Usage: python3 scripts/gerar-sfx.py
"""

import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def t_axis(seconds):
    return np.arange(int(SR * seconds)) / SR


def lowpass(x, cutoff):
    # One-pole low-pass; cutoff may be an array (time-varying).
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def bandpass(x, low, high):
    return lowpass(x, high) - lowpass(x, low)


def fade(x, fade_in, fade_out):
    n_in, n_out = int(SR * fade_in), int(SR * fade_out)
    env = np.ones(len(x))
    if n_in:
        env[:n_in] = np.linspace(0, 1, n_in)
    if n_out:
        env[-n_out:] = np.linspace(1, 0, n_out)
    return x * (env[:, None] if x.ndim == 2 else env)


def stereo(left, right=None):
    return np.stack([left, left if right is None else right], axis=1)


def save(name, data, peak=0.9):
    data = data / (np.max(np.abs(data)) + 1e-9) * peak
    pcm = (data * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(pcm.tobytes())


def drone_ambience(seconds=7.2):
    """Wind + rotor hum that runs under the whole flight."""
    t = t_axis(seconds)
    wind_l = lowpass(rng.standard_normal(len(t)), 500)
    wind_r = lowpass(rng.standard_normal(len(t)), 500)
    gust = 0.7 + 0.3 * np.sin(2 * np.pi * 0.35 * t)
    rotor = sum(
        np.sin(2 * np.pi * f * t + p) / (k + 1)
        for k, (f, p) in enumerate([(118, 0), (236, 1.3), (354, 2.1), (472, 0.4)])
    )
    rotor *= 0.75 + 0.25 * np.sin(2 * np.pi * 24 * t)  # blade flutter
    mix_l = wind_l * 1.6 * gust + rotor * 0.06
    mix_r = wind_r * 1.6 * gust + rotor * 0.06
    return fade(stereo(mix_l, mix_r), 0.6, 0.8)


def whoosh(seconds=1.1):
    """Air swoosh with a sweeping band-pass and stereo pan."""
    t = t_axis(seconds)
    noise = rng.standard_normal(len(t))
    sweep = 300 + 2600 * np.sin(np.pi * t / seconds) ** 2
    body = bandpass(noise, sweep * 0.5, sweep)
    env = np.sin(np.pi * t / seconds) ** 1.6
    pan = t / seconds
    return stereo(body * env * (1 - pan * 0.6), body * env * (0.4 + pan * 0.6))


def neon_draw(seconds):
    """Electric neon buzz that rises in pitch while the line is drawn."""
    t = t_axis(seconds)
    hum_freq = 110
    hum = np.sign(np.sin(2 * np.pi * hum_freq * t)) * 0.3
    hum = lowpass(hum, 1800)
    rise = 300 + 900 * (t / seconds) ** 1.5
    phase = 2 * np.pi * np.cumsum(rise) / SR
    tone = np.sin(phase) * 0.5 + np.sin(phase * 2.01) * 0.2
    crackle = (rng.random(len(t)) > 0.9985) * rng.standard_normal(len(t)) * 2.5
    crackle = bandpass(crackle, 2000, 9000)
    flicker = 0.8 + 0.2 * np.sin(2 * np.pi * 9 * t)
    sig = (hum + tone + crackle) * flicker
    return fade(stereo(sig), 0.05, 0.35)


def badge_pop():
    """Bright pop + glassy chime for a badge appearing."""
    t = t_axis(0.9)
    pop_freq = 900 * np.exp(-t * 30) + 220
    pop = np.sin(2 * np.pi * np.cumsum(pop_freq) / SR) * np.exp(-t * 28)
    chime = sum(
        np.sin(2 * np.pi * f * t) * np.exp(-t * d) * a
        for f, d, a in [(1318.5, 6, 0.5), (1975.5, 8, 0.3), (2637, 11, 0.18)]
    )
    click = bandpass(rng.standard_normal(len(t)), 3000, 10000) * np.exp(-t * 200) * 0.6
    return stereo(pop * 0.9 + chime + click)


def badge_out():
    """Short soft swish for the badge leaving."""
    t = t_axis(0.35)
    body = bandpass(rng.standard_normal(len(t)), 1200, 5000)
    return stereo(body * np.sin(np.pi * t / 0.35) ** 2)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    save("drone-ambiente.wav", drone_ambience(), peak=0.7)
    save("whoosh.wav", whoosh())
    save("neon-lote.wav", neon_draw(1.3))
    save("neon-rodovia.wav", neon_draw(1.4))
    save("neon-centro.wav", neon_draw(1.6))
    save("pop.wav", badge_pop())
    save("saida.wav", badge_out(), peak=0.6)
    print("ok")
