const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Direcao visual "Clinica e limpa" — Portal do Tutor.
      // A escala `slate` do Tailwind e preservada (telas antigas usam slate-100/500/900);
      // `text-slate` / `bg-slate` sem numero resolve para o token da direcao.
      colors: {
        clinic: "#0E7A63",
        "clinic-50": "#D8F0E7",
        "clinic-ink": "#0B5A49",
        ink: "#10201C",
        slate: { ...colors.slate, DEFAULT: "#5D706B" },
        mist: "#F4F7F7",
        line: "#E2E9E7",
        "line-strong": "#CFDBD8",
        hairline: "#EDF2F1",
        alert: "#C2513A",
        "alert-50": "#F8E2DD",
        "alert-ink": "#9A3A26",
        card: "#FFFFFF",
        "icon-off": "#D3DEDB",
        "text-off": "#8A9A95",
      },
      borderRadius: {
        badge: "4px",
        control: "8px",
        card: "12px",
      },
      // Fontes estaticas: cada peso e uma familia propria (font-weight nao troca
      // o arquivo no Android). Os nomes evitam colidir com font-medium/font-semibold.
      fontFamily: {
        sans: ["IBM_Plex_Sans_400Regular"],
        "sans-medium": ["IBM_Plex_Sans_500Medium"],
        "sans-semibold": ["IBM_Plex_Sans_600SemiBold"],
        mono: ["IBM_Plex_Mono_400Regular"],
        "mono-medium": ["IBM_Plex_Mono_500Medium"],
      },
      fontSize: {
        micro: ["9.5px", "14px"],
        badge: ["10px", "14px"],
        label: ["10.5px", "15px"],
        eyebrow: ["11px", "16px"],
        body: ["12.5px", "18px"],
        title: ["13px", "18px"],
        screen: ["19px", "24px"],
        metric: ["25px", "30px"],
      },
      letterSpacing: {
        screen: "-0.19px",
      },
    },
  },
  plugins: [],
}
