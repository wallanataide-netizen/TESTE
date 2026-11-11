# Ronald's Lanches — Vídeo "Novo nome, mesmo sabor" (30 s)

Pacote de cenas para gerar no **Nano Banana** (imagem) e animar no **Kling** (imagem → vídeo).
Os prompts estão em inglês porque as duas ferramentas respondem melhor assim; a explicação está em português.

## Regras gerais (valem para todas as cenas)

- **Formato:** 9:16 (Reels/Stories). Para YouTube/TV, gere também em 16:9.
- **Estilo fixo** — cole este bloco no fim de todo prompt de imagem para manter a identidade visual igual à do cardápio:

```
Style: premium fast-food commercial, dark moody background (#0c0908 near-black), warm rim lighting,
accent colors deep red (#d6141b) and golden yellow (#ffc21a), shallow depth of field, ultra sharp,
photorealistic, high-end food photography, cinematic color grade, no text, no logos, no watermark.
```

- **Nunca peça para a IA escrever a logo ou textos.** Ela deforma letras. Logo, preços, @ e WhatsApp entram depois, na edição (motion graphics), com os arquivos reais:
  - `cardapio/assets/logo-ronalds-recorte.png` (logo sem fundo)
  - `cardapio/assets/coca-cola-lata.webp` e `cardapio/assets/suco-laranja.webp`
  - `cardapio/assets/qr-instagram.svg`
- **Kling:** use *Image to Video*, 5 s por cena, modo Professional/High Quality; peça movimento **lento e simples** (um movimento de câmera + um efeito). Movimento demais derrete o lanche.
- **Fotos reais primeiro:** se houver fotos dos lanches de verdade (do Instagram), use-as como **referência** no Nano Banana ("keep this exact burger, improve lighting and background") — o cliente reconhece o próprio lanche.

---

## Cena 1 — Abertura (0–3 s)
**Locução:** "Sabe aquele lanche que você já conhece… e ama?"

**Nano Banana (imagem):**
```
Extreme close-up of a juicy double cheeseburger on a sesame bun, melted cheddar dripping over a
grilled beef patty, fresh lettuce and tomato, light steam rising, glistening sauce, shot from a
low 3/4 angle, burger centered on a dark slate surface. [estilo fixo]
```

**Kling (vídeo):**
```
Slow cinematic push-in towards the burger, melted cheese slowly drips down the patty, gentle steam
rises, subtle warm light flicker, 120fps slow motion feel, camera stable, no morphing of the food.
```
**Som:** chiado de chapa + primeira batida da trilha.

---

## Cena 2 — "Mudou de cara" (3–7 s)
**Locução:** "Ele mudou de cara… e ganhou um nome novo!"

Melhor fazer na **edição** (não na IA): transição *whip pan* + pinceladas vermelhas e douradas varrendo a tela sobre o fim da Cena 1.

Opcional — fundo gerado para as pinceladas:
```
Abstract dynamic brush strokes of deep red and golden yellow paint sweeping across a near-black
background, energetic diagonal motion, paint splatter particles, high contrast. [estilo fixo]
```
**Kling:** `Paint strokes sweep fast from left to right across the frame, particles fly, energetic.`

---

## Cena 3 — Revelação da logo (7–10 s)
**Locução:** "Agora é… RONALD'S LANCHES!"

**Fundo (Nano Banana):**
```
Empty dark stage with a warm golden spotlight glow in the center, subtle red light leaks on the
edges, floating sparks and embers, smoky atmosphere, space in the center for a logo. [estilo fixo]
```
**Kling:** `Slow push-in, embers float upward, golden light pulses once, smoke drifts gently.`

**Edição:** a logo real entra por cima (escala de 80% → 100% com *overshoot*, brilho dourado passando da esquerda para a direita, impacto sonoro). **Pausa seca na trilha** logo antes.

---

## Cena 4 — Os lanches (10–17 s)
**Locução:** "O mesmo sabor caprichado de sempre: X-Tudo, Picanha, Artesanais… e o campeão da casa, o Ronald's!"

Quatro planos rápidos (~1,7 s cada), um por lanche, com a etiqueta de preço dourada entrando na edição.

**4a — X-Tudo (R$ 18,00)**
```
A towering "everything" burger: sesame bun, beef patty, shredded chicken, fried egg, melted cheese,
ham, sliced sausage, calabresa sausage slices, crispy bacon, crispy shoestring potatoes (batata
palha), lettuce, tomato and creamy catupiry cheese, front view, generous and messy. [estilo fixo]
```
**4b — X-Picanha (R$ 16,00)**
```
Gourmet sandwich with juicy sliced picanha steak with caramelized onions, grilled coalho cheese,
creamy catupiry, crispy shoestring potatoes, lettuce and tomato on a toasted bun, 3/4 view. [estilo fixo]
```
**4c — X-Bacon Artesanal (R$ 18,00)**
```
Thick handmade smash burger (120g), melted cheese, crispy bacon strips, glossy barbecue sauce,
crispy shoestring potatoes and lettuce on a brioche bun, side view showing the layers. [estilo fixo]
```
**4d — Ronald's, o campeão (R$ 22,00)**
```
Massive double-stacked burger: two beef patties, shredded chicken, two fried eggs, double cheese,
double ham, sausage, calabresa slices, bacon, crispy shoestring potatoes, lettuce, tomato and
catupiry, epic hero shot from a low angle, golden backlight halo. [estilo fixo]
```
**Kling (use o mesmo para os quatro, trocando só a direção):**
```
Slow orbit of 15 degrees around the burger, steam rising, sauce glistening, camera stays focused,
no change to the food shape.
```
**Edição:** nome + preço com *kinetic typography* no ritmo da fala; no 4d, selo "★ O mais pedido".

---

## Cena 5 — Bebidas (17–21 s)
**Locução:** "Com refri geladinho e suco natural pra acompanhar."

**Não gere a lata na IA** (a marca sai deformada). Monte o *frame* inicial na edição com os PNGs reais
(lata + jarra) sobre fundo escuro, exporte esse quadro e use no Kling:
```
Ice cubes fall in slow motion around the drinks, cold condensation droplets slide down the can,
fresh splash of orange juice, cold mist, camera static, keep the can and pitcher unchanged.
```

---

## Cena 6 — Chamada final (21–26 s)
**Locução:** "Segue a gente no Insta: arroba ronaldslanches10… e pede já pelo WhatsApp!"

**100% edição** (sem IA): fundo escuro com brilho dourado, QR Code entra girando de leve,
**@ronaldslanches10** e **(84) 9 8869-8674** em destaque, ícone do WhatsApp pulsando no beat.

---

## Cena 7 — Assinatura (26–30 s)
**Locução:** "Ronald's Lanches. Novo nome, mesmo sabor!"

Reaproveite o fundo da Cena 3. Logo centralizada, slogan **"Novo nome, mesmo sabor"** em dourado
surgindo letra a letra, corte final seco no último beat.

---

## Checklist para a montagem

- [ ] Áudio da locução gravado (WAV, 3 takes)
- [ ] Fotos reais dos lanches (do Instagram) para usar como referência
- [ ] 7 clipes do Kling exportados em 9:16
- [ ] Trilha + efeitos: chiado de chapa, whoosh, impacto (logo), gelo caindo
- [ ] Montagem final sincronizada com a voz
