// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  // FIX: Ubah dari ["class"] menjadi "class" (String, bukan Array)
  darkMode: "class", 
  
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Menjadikan Inter sebagai font sans-serif default
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        // Optimasi ukuran huruf agar lebih terbaca di monitor besar
        "2xs": ["10px", "14px"],
        "3xs": ["8px", "12px"],
      },
      letterSpacing: {
        // Menambahkan variasi tracking untuk judul yang lebih bold dan tajam
        tightest: "-0.075em",
        widest: "0.25em",
      },
      borderRadius: {
        // Menyesuaikan radius sudut agar konsisten dengan desain awal yang rounded
        "3xl": "24px",
        "4xl": "32px",
      },
      colors: {
        // Mempertahankan skema warna institusional
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... sisa konfigurasi warna shadcn lainnya
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;