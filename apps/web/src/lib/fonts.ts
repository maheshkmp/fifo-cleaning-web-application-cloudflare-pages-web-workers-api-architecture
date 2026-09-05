import { Space_Grotesk, Inter, Dancing_Script, Pacifico, Great_Vibes, Satisfy, Sacramento, Caveat, Allura, Pinyon_Script, Alex_Brush, Instrument_Serif, DM_Sans } from "next/font/google";

export const fontInstrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const fontDmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

// ── Signature fonts ──────────────────────────────────────────────────────────
export const fontDancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script"
});

export const fontPacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico"
});

export const fontGreatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes"
});

export const fontSatisfy = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-satisfy"
});

export const fontSacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-sacramento"
});

export const fontCaveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat"
});

export const fontAllura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura"
});

export const fontPinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon-script"
});

export const fontAlexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alex-brush"
});
