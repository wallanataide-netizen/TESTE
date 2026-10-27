import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { staticFile } from "remotion";

const { fontFamily: playfair } = loadPlayfair("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});
loadPlayfair("italic", { weights: ["600", "700"], subsets: ["latin"] });
const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

export const FONTE_TITULO = playfair;
export const FONTE_TEXTO = montserrat;

// Paleta tirada das embalagens e da logo
export const CORES = {
  cafe: "#2A140C",
  cafeEscuro: "#140804",
  madeira: "#5A2E17",
  madeiraClara: "#8A4A24",
  vermelho: "#D7192B",
  vermelhoEscuro: "#7A0A10",
  dourado: "#E8B04A",
  douradoClaro: "#FFE3A1",
  amarelo: "#FFD21F",
  creme: "#FFF3DC",
  calabresa: "#7A2E1A",
};

export const GRADIENTE_OURO =
  "linear-gradient(180deg, #FFF0C2 0%, #F3C766 45%, #C98A2B 100%)";

export const IMAGENS = {
  calabresa: staticFile("produtos/casquinha-calabresa.png"),
  manteiga: staticFile("produtos/manteiga-do-sertao.png"),
  rainha: staticFile("produtos/rainha-especial.png"),
  logo: staticFile("logo-bom-gosto.png"),
};

// Proporção largura / altura de cada embalagem (nunca distorcer)
export const PROPORCAO = {
  calabresa: 748 / 1487,
  manteiga: 716 / 1443,
  rainha: 908 / 1509,
  logo: 2000 / 1095,
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
