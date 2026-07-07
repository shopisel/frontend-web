import { motion } from "motion/react";
import {
  ShoppingCart, ArrowUpDown, Bell, TrendingDown,
  List, Check, Loader2, Tag, Sparkles, MapPin,
} from "lucide-react";
import { brand } from "../../../brand.config";

interface OnboardingScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  isLoading?: boolean;
}

// ─── Google Play badge ─────────────────────────────────────────
function GooglePlayBadge() {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl cursor-not-allowed opacity-70"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {/* Play Store coloured triangle */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="100%" stopColor="#0072FF" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F7971E" />
            <stop offset="100%" stopColor="#FFD200" />
          </linearGradient>
          <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#56AB2F" />
            <stop offset="100%" stopColor="#A8E063" />
          </linearGradient>
          <linearGradient id="g4" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f953c6" />
            <stop offset="100%" stopColor="#b91d73" />
          </linearGradient>
        </defs>
        {/* Top-left triangle */}
        <path d="M3 2 L14 14 L3 14 Z" fill="url(#g1)" />
        {/* Bottom-left triangle */}
        <path d="M3 14 L14 14 L3 26 Z" fill="url(#g3)" />
        {/* Top-right triangle */}
        <path d="M14 14 L3 2 L22 8 Z" fill="url(#g2)" />
        {/* Bottom-right triangle */}
        <path d="M14 14 L22 20 L3 26 Z" fill="url(#g4)" />
      </svg>

      <div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 500, letterSpacing: 0.3 }}>
          FUTURAMENTE DISPONÍVEL
        </p>
        <p style={{ fontSize: 18, color: "white", fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.3 }}>
          Google Play
        </p>
      </div>
    </div>
  );
}

// ─── App Store badge ───────────────────────────────────────────
function AppStoreBadge() {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl cursor-not-allowed opacity-70"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      {/* Apple logo */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M19.6 14.9c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.6 1.3-.1 1.8-.9 3.4-.9 1.6 0 2 .9 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.7-1-2.7-4z"
          fill="white"
        />
        <path
          d="M17 6.9c.7-.8 1.1-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"
          fill="white"
        />
      </svg>

      <div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 500, letterSpacing: 0.3 }}>
          FUTURAMENTE DISPONÍVEL
        </p>
        <p style={{ fontSize: 18, color: "white", fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.3 }}>
          App Store
        </p>
      </div>
    </div>
  );
}

// ─── 3-D Physical Phone ────────────────────────────────────────
function PhoneMockup() {
  // Phone body dimensions
  const W = 210;   // width  (px)
  const H = 440;   // height (px)
  const D = 14;    // depth / thickness (px)

  const items = [
    { name: "Leite Mimosa 1L", store: "Continente", price: "1.09€", orig: "1.39€", pct: "-22%", checked: true  },
    { name: "Pão de Forma",    store: "Pingo Doce",  price: "0.89€", orig: null,    pct: null,   checked: false },
    { name: "Ovos M (12un)",   store: "Continente",  price: "1.99€", orig: "2.49€", pct: "-20%", checked: false },
  ];

  // Shared gradient for the metal edges
  const metalEdge = "linear-gradient(180deg,#2a2750 0%,#1a1740 35%,#14122e 65%,#2a2750 100%)";
  // Shared style for all faces
  const face: React.CSSProperties = { position: "absolute" };

  return (
    <div style={{ perspective: "1100px", perspectiveOrigin: "50% 50%", flexShrink: 0 }}>
      <motion.div
        style={{
          width: W, height: H, position: "relative",
          transformStyle: "preserve-3d",
          // Main rotation: tilt toward viewer-left so RIGHT edge is clearly visible
          transform: "rotateY(-30deg) rotateX(6deg)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      >

        {/* ── BACK FACE ── dark glass with camera bump */}
        <div style={{
          ...face, width: W, height: H,
          borderRadius: 34,
          background: "linear-gradient(145deg,#0d0b1e 0%,#1a1740 40%,#0d0b1e 100%)",
          transform: `rotateY(180deg) translateZ(${D / 2}px)`,
          boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
        }}>
          {/* Camera island */}
          <div style={{
            position: "absolute", top: 18, left: 18,
            width: 60, height: 60, borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}>
            <div style={{ position: "absolute", top: 8, left: 8, width: 20, height: 20, borderRadius: "50%", background: "#08060f", border: "2px solid rgba(255,255,255,0.13)" }} />
            <div style={{ position: "absolute", bottom: 8, right: 8, width: 14, height: 14, borderRadius: "50%", background: "#08060f", border: "1.5px solid rgba(255,255,255,0.1)" }} />
            {/* Flash */}
            <div style={{ position: "absolute", bottom: 10, left: 10, width: 7, height: 7, borderRadius: "50%", background: "rgba(255,220,80,0.2)" }} />
          </div>
          {/* Brand engraving */}
          <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "rgba(255,255,255,0.1)", fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>SHOPISEL</div>
        </div>

        {/* ── RIGHT SIDE EDGE — power button ── */}
        <div style={{
          ...face,
          width: D, height: H - 16, top: 8, left: (W - D) / 2,
          background: metalEdge,
          transform: `rotateY(90deg) translateZ(${W / 2}px)`,
        }}>
          {/* Power button */}
          <div style={{
            position: "absolute", right: -(D + 2), top: "28%",
            width: D + 3, height: 58,
            background: "linear-gradient(180deg,#3a3770,#2a2550)",
            borderRadius: "0 7px 7px 0",
            boxShadow: "2px 0 4px rgba(0,0,0,0.5)",
          }} />
        </div>

        {/* ── LEFT SIDE EDGE — volume + silent ── */}
        <div style={{
          ...face,
          width: D, height: H - 16, top: 8, left: (W - D) / 2,
          background: metalEdge,
          transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
        }}>
          {/* Silent / ring switch */}
          <div style={{ position: "absolute", left: -(D + 2), top: "12%", width: D + 3, height: 22, background: "linear-gradient(180deg,#3a3770,#2a2550)", borderRadius: "7px 0 0 7px", boxShadow: "-2px 0 4px rgba(0,0,0,0.5)" }} />
          {/* Volume up */}
          <div style={{ position: "absolute", left: -(D + 2), top: "20%", width: D + 3, height: 44, background: "linear-gradient(180deg,#3a3770,#2a2550)", borderRadius: "7px 0 0 7px", boxShadow: "-2px 0 4px rgba(0,0,0,0.5)" }} />
          {/* Volume down */}
          <div style={{ position: "absolute", left: -(D + 2), top: "31%", width: D + 3, height: 44, background: "linear-gradient(180deg,#3a3770,#2a2550)", borderRadius: "7px 0 0 7px", boxShadow: "-2px 0 4px rgba(0,0,0,0.5)" }} />
        </div>

        {/* ── TOP EDGE ── */}
        <div style={{
          ...face,
          width: W - 16, height: D, top: (H - D) / 2, left: 8,
          background: metalEdge,
          borderRadius: "0 0 3px 3px",
          transform: `rotateX(90deg) translateZ(${H / 2}px)`,
        }}>
          {/* SIM tray */}
          <div style={{ position: "absolute", top: -1, left: "28%", width: 32, height: D + 2, background: "rgba(255,255,255,0.06)", borderRadius: "0 0 4px 4px" }} />
        </div>

        {/* ── BOTTOM EDGE ── */}
        <div style={{
          ...face,
          width: W - 16, height: D, top: (H - D) / 2, left: 8,
          background: metalEdge,
          borderRadius: "3px 3px 0 0",
          transform: `rotateX(-90deg) translateZ(${H / 2}px)`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* USB-C port */}
          <div style={{ width: 30, height: D - 5, background: "#08060f", borderRadius: 5, border: "1px solid rgba(255,255,255,0.1)" }} />
          {/* Speakers */}
          {[-22, 22].map(offset => (
            <div key={offset} style={{
              position: "absolute", left: `calc(50% + ${offset}px)`,
              width: 16, height: D - 6,
              background: "transparent",
              display: "flex", gap: 2, alignItems: "center",
            }}>
              {[0,1,2,3].map(dot => (
                <div key={dot} style={{ width: 2, height: 4, borderRadius: 1, background: "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
          ))}
        </div>

        {/* ── FRONT FACE — screen ── */}
        <div style={{
          ...face, width: W, height: H,
          background: "#0a0818",
          borderRadius: 34,
          transform: `translateZ(${D / 2}px)`,
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.2), 0 24px 64px rgba(99,102,241,0.4)",
          overflow: "hidden",
        }}>
          {/* Screen bezel */}
          <div style={{ position: "absolute", inset: 4, background: "white", borderRadius: 31, overflow: "hidden" }}>

            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
              width: 100, height: 30,
              background: "#0a0818", borderRadius: 20, zIndex: 10,
            }}>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#12101e", border: "1.5px solid rgba(255,255,255,0.08)" }} />
            </div>

            {/* Status bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "46px 16px 4px", background: "#F9FAFB" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#374151" }}>9:41</span>
              <div style={{ width: 48, height: 6, borderRadius: 3, background: "#D1D5DB" }} />
            </div>

            {/* App header */}
            <div style={{ padding: "8px 12px", background: "white", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>🛒 Lista do Mercado</p>
                <p style={{ fontSize: 8, color: "#6B7280" }}>3 artigos · 3.97€</p>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: brand.colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "white", fontWeight: 700 }}>PT</span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: "#F3F4F6", margin: "8px 12px 0" }}>
              <motion.div style={{ height: "100%", background: brand.colors.primary, borderRadius: 2 }}
                initial={{ width: 0 }} animate={{ width: "33%" }}
                transition={{ delay: 1.3, duration: 0.8 }} />
            </div>

            {/* Items */}
            {items.map(item => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: "1px solid #F9FAFB" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: item.checked ? "#10B981" : "transparent",
                  border: `1.5px solid ${item.checked ? "#10B981" : "#D1D5DB"}`,
                }}>
                  {item.checked && <Check style={{ width: 8, height: 8, color: "white", strokeWidth: 3 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9, fontWeight: 600, color: item.checked ? "#9CA3AF" : "#111827", textDecoration: item.checked ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                  <p style={{ fontSize: 8, color: "#9CA3AF" }}>{item.store}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: item.checked ? "#9CA3AF" : "#10B981" }}>{item.price}</span>
                  {item.orig && <span style={{ fontSize: 8, color: "#9CA3AF", textDecoration: "line-through" }}>{item.orig}</span>}
                </div>
                {item.pct && (
                  <div style={{ padding: "2px 4px", borderRadius: 4, background: "#ECFDF5" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, color: "#10B981" }}>{item.pct}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Savings */}
            <div style={{ margin: "8px 12px 0", background: "#EEF2FF", borderRadius: 12, padding: "8px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Tag style={{ width: 9, height: 9, color: brand.colors.primary }} />
                  <span style={{ fontSize: 8, fontWeight: 600, color: brand.colors.primary }}>Poupança hoje</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: brand.colors.primary }}>0.80€</span>
              </div>
            </div>

            {/* Compare */}
            <div style={{ margin: "6px 12px 0", background: "#F0FDF4", borderRadius: 12, padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowUpDown style={{ width: 9, height: 9, color: "#10B981", flexShrink: 0 }} />
              <span style={{ fontSize: 8, color: "#065F46", fontWeight: 600 }}>2 lojas comparadas</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#10B981", marginLeft: "auto" }}>melhor: 1.09€</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

// ─── Floating card ─────────────────────────────────────────────
function FloatCard({
  children, delay, fromLeft,
}: { children: React.ReactNode; delay: number; fromLeft: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        x: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Feature cards ─────────────────────────────────────────────
const features = [
  {
    icon: ArrowUpDown, color: brand.colors.primary, bg: brand.colors.primaryLight,
    title: "Compara preços entre lojas",
    desc: "Pesquisa qualquer produto e vê instantaneamente o preço em todas as lojas disponíveis.",
  },
  {
    icon: List, color: "#10B981", bg: "#ECFDF5",
    title: "Listas de compras inteligentes",
    desc: "Cria listas, organiza por categoria e acompanha o total em tempo real.",
  },
  {
    icon: Bell, color: "#F59E0B", bg: "#FFFBEB",
    title: "Alertas automáticos de desconto",
    desc: "Recebe notificações push assim que os teus produtos favoritos baixam de preço.",
  },
  {
    icon: TrendingDown, color: brand.colors.secondary, bg: "#F5F3FF",
    title: "Poupança visível em cada lista",
    desc: "Vê exatamente quanto poupas com promoções ativas em cada ida ao supermercado.",
  },
];

// ─── Main ──────────────────────────────────────────────────────
export function OnboardingScreen({ onLogin, onRegister, isLoading = false }: OnboardingScreenProps) {
  return (
    <div className="flex flex-col min-h-dvh overflow-x-hidden"
      style={{ background: "linear-gradient(160deg,#0f0c29 0%,#1e1b4b 25%,#312e81 55%,#4c1d95 80%,#5b21b6 100%)" }}>

      {/* Ambient blobs */}
      {[
        { size: 320, top: "-80px",  right: "-80px", color: "rgba(99,102,241,0.3)",  dur: 5,   del: 0   },
        { size: 260, btm: "10%",   left: "-60px",  color: "rgba(139,92,246,0.25)", dur: 6.5, del: 1.5 },
        { size: 180, top: "45%",    right: "-30px",  color: "rgba(167,139,250,0.2)", dur: 4,   del: 0.8 },
      ].map((b, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width: b.size, height: b.size, top: b.top, bottom: (b as any).btm, left: (b as any).left, right: (b as any).right, background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.del }}
        />
      ))}

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 flex items-center px-6 lg:px-16 py-12 max-w-6xl mx-auto w-full">
        <div className="w-full flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

          {/* ── LEFT COLUMN: brand + text + CTAs ── */}
          <motion.div
            className="flex flex-col gap-6 flex-1"
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo + label */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl flex-shrink-0">
                <ShoppingCart className="w-7 h-7 text-indigo-700" strokeWidth={1.8} />
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span style={{ fontSize: 12, color: "rgba(199,210,254,0.9)", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  Shopping App
                </span>
              </div>
            </div>

            {/* Brand name — huge on all breakpoints */}
            <h1 className="font-black leading-[0.88] tracking-tight"
              style={{
                fontSize: "clamp(4.5rem, 10vw, 7.5rem)",
                background: "linear-gradient(130deg,#ffffff 0%,#e0e7ff 45%,#c4b5fd 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 48px rgba(165,180,252,0.55))",
              }}>
              {brand.name}
            </h1>

            {/* Tagline */}
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "rgba(199,210,254,0.95)", fontWeight: 500, lineHeight: 1.5 }}>
              A tua despensa <span style={{ color: "white", fontWeight: 700 }}>inteligente</span>,<br />
              sempre ao <span style={{ color: "#FCD34D", fontWeight: 700 }}>melhor preço.</span>
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: ArrowUpDown, label: "Comparação de preços" },
                { icon: List,        label: "Listas inteligentes"  },
                { icon: Bell,        label: "Alertas de promoção"  },
                { icon: TrendingDown,label: "Poupança visível"     },
              ].map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Icon style={{ width: 12, height: 12, color: "rgba(255,255,255,0.85)" }} strokeWidth={2} />
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{f.label}</span>
                  </div>
                );
              })}
            </div>

            {/* App stores */}
            <div className="flex flex-col gap-2">
              <p style={{ fontSize: 12, color: "rgba(199,210,254,0.65)", fontWeight: 500 }}>
                Brevemente disponível para Android e iOS
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <GooglePlayBadge />
                <AppStoreBadge />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <span style={{ fontSize: 12, color: "rgba(165,180,252,0.7)", fontWeight: 500 }}>
                ou continua na web
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* CTAs — only once */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={onRegister} disabled={isLoading}
                className="flex-1 py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.97] disabled:opacity-70"
                style={{ background: `linear-gradient(135deg,${brand.colors.primary} 0%,${brand.colors.secondary} 100%)`, boxShadow: `0 8px 32px ${brand.colors.activeBorder}` }}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar conta gratuita"}
              </button>
              <button onClick={onLogin} disabled={isLoading}
                className="flex-1 py-4 rounded-2xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.97] disabled:opacity-70"
                style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
                Já tenho conta
              </button>
            </div>

            <p style={{ fontSize: 11, color: "rgba(165,180,252,0.55)" }}>
              Gratuito · Sem anúncios · Privacidade garantida
            </p>
          </motion.div>

          {/* ── RIGHT COLUMN: phone + floating badges ── */}
          <motion.div
            className="flex items-center justify-center flex-shrink-0"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Location badge — left of phone */}
            <FloatCard delay={0.9} fromLeft>
              <div className="flex flex-col gap-2 mr-4">
                <div className="rounded-2xl px-3 py-3 shadow-xl"
                  style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", minWidth: 138 }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin style={{ width: 11, height: 11, color: "#34D399" }} />
                    <span style={{ fontSize: 10, color: "#34D399", fontWeight: 700 }}>Perto de ti</span>
                  </div>
                  <p style={{ fontSize: 12, color: "white", fontWeight: 700 }}>Continente · 320m</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>Pingo Doce · 780m</p>
                </div>
              </div>
            </FloatCard>

            {/* Phone */}
            <PhoneMockup />

            {/* Notifications + savings — right of phone */}
            <FloatCard delay={1.1} fromLeft={false}>
              <div className="flex flex-col gap-2 ml-4">
                <div className="rounded-2xl px-3 py-3 shadow-xl"
                  style={{ background: "linear-gradient(135deg,#1c1917,#292524)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", minWidth: 138 }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Bell style={{ width: 11, height: 11, color: "#FBBF24" }} />
                    <span style={{ fontSize: 9, color: "#FBBF24", fontWeight: 700, letterSpacing: "0.05em" }}>NOTIFICAÇÃO</span>
                  </div>
                  <p style={{ fontSize: 12, color: "white", fontWeight: 700, lineHeight: 1.35 }}>
                    🎉 Leite Mimosa<br />baixou -22% no Continente
                  </p>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>agora mesmo</p>
                </div>
                <div className="rounded-2xl px-3 py-3 shadow-xl"
                  style={{ background: "linear-gradient(135deg,#052e16,#064e3b)", border: "1px solid rgba(52,211,153,0.3)", backdropFilter: "blur(12px)" }}>
                  <p style={{ fontSize: 10, color: "#6EE7B7", fontWeight: 600 }}>💰 Esta semana</p>
                  <p style={{ fontSize: 18, color: "#34D399", fontWeight: 800, lineHeight: 1.15 }}>+3.40€</p>
                  <p style={{ fontSize: 10, color: "rgba(110,231,183,0.65)" }}>poupados</p>
                </div>
              </div>
            </FloatCard>
          </motion.div>

        </div>
      </div>

      {/* ══ FEATURES (white scroll section) ══════ */}
      <div className="relative z-10 bg-white rounded-t-3xl px-5 pt-6 pb-10">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        <h2 className="text-gray-900 text-2xl font-black mb-1">Porquê o {brand.name}?</h2>
        <p className="text-gray-400 text-sm mb-5">Tudo o que precisas para comprar mais inteligente.</p>

        <div className="flex flex-col gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} className="flex gap-4 p-4 rounded-2xl" style={{ backgroundColor: f.bg }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: f.color }}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
