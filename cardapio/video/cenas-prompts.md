# Ronald's Lanches — Vídeo "Novo nome, mesmo sabor" (30 s · 1080 × 1920 vertical)

Pacote de cenas para gerar no **Nano Banana** (imagem) e animar no **Kling** (imagem → vídeo).
Os prompts estão em inglês porque as duas ferramentas respondem melhor assim; a explicação está em português.

## Regras gerais (valem para todas as cenas)

- **Formato único: 1080 × 1920 px (9:16, vertical).** Tudo nesse tamanho: imagens, clipes e vídeo final.
  - **Nano Banana:** proporção **9:16**. Se sair em resolução menor, faça *upscale* para 1080 × 1920 antes de animar.
  - **Kling:** proporção **9:16**, usando a imagem 1080 × 1920 como quadro inicial.
  - **Edição:** projeto/sequência em 1080 × 1920, 30 fps.
  - **Enquadramento vertical:** o lanche fica no centro, ocupando mais ou menos o terço do meio. Deixe espaço acima e abaixo para os textos da edição.
  - **Área segura (Reels/Stories):** não coloque nada importante nos **250 px de cima** (nome do perfil) nem nos **350 px de baixo** (legenda e botões), nem colado nas laterais (deixe uns 60 px). Logo, preços, @ e WhatsApp sempre dentro da área segura.
- **Estilo fixo** — cole este bloco no fim de todo prompt de imagem para manter a identidade visual igual à do cardápio:

```
Style: premium fast-food commercial, dark moody background (#0c0908 near-black), warm rim lighting,
accent colors deep red (#d6141b) and golden yellow (#ffc21a), shallow depth of field, ultra sharp,
photorealistic, high-end food photography, cinematic color grade, no text, no logos, no watermark.
Vertical 9:16 composition (1080x1920), subject centered, empty space above and below for text.
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

## Trilha sonora e efeitos

**Clima:** food commercial moderno, alegre e confiante, com cara de marca grande. Groove de *funk/disco pop* ou *upbeat hip-hop* com metais, palmas e baixo marcado. Nada de música com letra cantada: ela briga com a locução.

- **Andamento:** 110–125 BPM (dinâmico, mas dá para ouvir a voz).
- **Volume:** a trilha fica uns **-18 dB abaixo da voz** enquanto você fala e sobe nos respiros (abaixar automaticamente com *ducking*).
- **Duração:** pegue uma faixa de 1–2 min e corte um trecho de 30 s que tenha **início com impacto e final com "fecho"** (não termine em *fade* arrastado).

### Mapa da trilha no roteiro

| Tempo | O que a música faz | Efeito sonoro (SFX) |
|---|---|---|
| 0–3 s | Intro baixa, só batida e baixo | Chiado de chapa (*grill sizzle*) |
| 3–7 s | *Riser* (subida de tensão) | *Whoosh* na transição das pinceladas |
| ~6,8 s | **Corte seco: 0,3 s de silêncio** | — |
| 7–10 s | **Drop**: entra a música inteira | **Impacto grave** (*boom/hit*) + brilho (*shimmer*) na logo |
| 10–17 s | Groove principal, energia máxima | *Swoosh* curto a cada lanche + "plim" na etiqueta de preço |
| 17–21 s | Mesmo groove, um pouco mais leve | Gelo caindo no copo + lata abrindo (*can open/fizz*) |
| 21–26 s | Groove segue | *Pop* quando o QR e o WhatsApp aparecem |
| 26–30 s | Final de frase musical, **fecho seco** no último beat | Impacto final + brilho na logo |

### Onde achar (com licença para uso comercial)

| Plataforma | Custo | O que pesquisar |
|---|---|---|
| **Artlist** / **Epidemic Sound** | Assinatura (melhor qualidade, licença comercial clara) | `funky food commercial`, `upbeat brass groove`, `fast food advertising` |
| **Envato Elements** | Assinatura (trilha + SFX + templates) | `food promo`, `burger commercial`, `funky upbeat logo` |
| **Uppbeat** | Grátis com crédito / plano pago | `funky`, `upbeat corporate`, `food` |
| **Pixabay Music** | Grátis | `funk food`, `upbeat advertising`, `happy groove` |
| **Biblioteca de Áudio do YouTube** | Grátis | Gênero *Funk* ou *Hip Hop*, clima *Feliz/Brilhante* |

SFX (chapa, *whoosh*, impacto, gelo, lata abrindo): Pixabay *Sound Effects*, Envato ou Epidemic.

> **Atenção (Instagram):** perfil comercial não pode usar músicas populares da biblioteca do Instagram em anúncio; só a **biblioteca de áudio comercial** ou trilha licenciada. Use uma das plataformas acima e guarde o comprovante/licença da faixa.

### Opção: trilha exclusiva feita com IA (Suno / Udio)

Gera uma música só de vocês, sem risco de outro anúncio usar a mesma. Use o modo **instrumental** (confira na plataforma se o plano permite uso comercial):

```
Instrumental, 30-second fast food TV commercial, funky disco-pop groove, 118 BPM, punchy slap bass,
bright brass stabs, hand claps, tight drums, energetic and joyful, premium brand feel,
short intro, big drop at 7 seconds, strong ending hit, no vocals
```

---

## Checklist para a montagem

- [ ] Áudio da locução gravado (WAV, 3 takes)
- [ ] Fotos reais dos lanches (do Instagram) para usar como referência
- [ ] 7 clipes do Kling exportados em 1080 × 1920 (9:16)
- [ ] Trilha licenciada (ou gerada no Suno/Udio) + SFX: chapa, whoosh, impacto, gelo, lata abrindo
- [ ] Montagem final sincronizada com a voz
