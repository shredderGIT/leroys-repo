import { createFileRoute, Link } from "@tanstack/react-router";
import { passports } from "@/data/dpp";
import { Leaf, Zap, Recycle, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import plus6Img from "@/assets/plus-6.png";
import plus8Img from "@/assets/plus-8.png";
import capellaImg from "@/assets/capella-esd.png";

const productImage: Record<string, string> = {
  "Plus 6": plus6Img,
  "Plus 8": plus8Img,
  "Capella X": capellaImg,
};



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Product Passport — Kinnarps" },
      {
        name: "description",
        content:
          "Browse digital product passports with verified sustainability metrics, materials, and supply chain transparency.",
      },
      { property: "og:title", content: "Digital Product Passport — Kinnarps" },
      {
        property: "og:description",
        content:
          "Verified sustainability metrics, materials, and supply chain transparency for every product.",
      },
    ],
  }),
  component: Index,
});

function useStretchText() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = () => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;

      const target = container.getBoundingClientRect().width;

      // Measure natural text width by shrinking to content
      const savedDisplay = text.style.display;
      const savedWidth = text.style.width;
      text.style.display = "inline-block";
      text.style.width = "auto";
      text.style.letterSpacing = "0px";
      const natural = text.getBoundingClientRect().width;
      text.style.display = savedDisplay;
      text.style.width = savedWidth;

      const chars = text.textContent?.length ?? 0;
      if (chars <= 1) return;

      const spacing = (target - natural) / (chars - 1);
      text.style.letterSpacing = spacing > 0 ? `${spacing}px` : "0px";
    };

    const handle = () => document.fonts.ready.then(apply);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  return { containerRef, textRef };
}

function Index() {
  const { containerRef, textRef } = useStretchText();
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-base font-medium">DPP Registry</span>
          </div>
          <nav className="text-xs text-muted-foreground">
            <span className="hidden sm:inline">Compliant with EU ESPR · ISO 59040</span>
          </nav>
        </div>
      </header>

      <section className="border-b border-border/60 bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Digital Product Passport
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-medium leading-[1.1] text-foreground sm:text-4xl">
            <span ref={containerRef} className="inline-block">
              <div className="whitespace-nowrap">Trace Your Product.</div>
              <div ref={textRef} className="whitespace-nowrap">Digitally.</div>
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Every passport collects verified environmental performance, traceable
            documentation, and the organisations responsible across the product's life cycle.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <Stat label="Active passports" value={passports.length.toString()} />
            <Stat label="Manufacturer" value="Kinnarps AB" />
            <Stat label="Org nr" value="556256-6736" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-medium">Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a product to view its complete passport.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {passports.map((p) => {
            const img = productImage[p.product];
            return (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]"
              >
                {/* Image panel */}
                <div className="relative h-56 overflow-hidden border-b border-border bg-[radial-gradient(circle_at_30%_20%,#fafafa,transparent_60%),repeating-linear-gradient(45deg,transparent_0_10px,rgba(0,0,0,0.025)_10px_11px)]">
                  <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/70">
                      {p.businessRole}
                    </span>
                  </div>
                  <div className="absolute left-5 top-4 z-10">
                    <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {p.series ?? "Kinnarps"}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground/70">
                      ID · {p.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>
                  {img && (
                    <img
                      src={img}
                      alt={`${p.product} task chair`}
                      className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <CropMark className="left-2 top-2" />
                  <CropMark className="right-2 top-2 rotate-90" />
                  <CropMark className="bottom-2 left-2 -rotate-90" />
                  <CropMark className="bottom-2 right-2 rotate-180" />
                </div>


                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-medium tracking-tight">{p.product}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      DPP
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.presentation}</p>

                  <div className="mt-5 grid grid-cols-3 gap-4 border-t border-dashed border-border pt-4">
                    <Metric
                      icon={<Zap className="h-4 w-4" />}
                      label="Energy"
                      value={`${Number(p.energyUse).toFixed(0)}`}
                      unit="kWh"
                    />
                    <Metric
                      icon={<Leaf className="h-4 w-4" />}
                      label="Footprint"
                      value={p.footprint.toString()}
                      unit="kg CO₂e"
                    />
                    <Metric
                      icon={<Recycle className="h-4 w-4" />}
                      label="Recycled"
                      value={`${p.recycledContent}`}
                      unit="%"
                    />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    View passport
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </section>

      <footer className="border-t border-border/60 py-6">
        <div className="mx-auto max-w-6xl px-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} DPP Registry · Data sourced from KS: Digital Product
          Passport export
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest">{label}</div>
      <div className="mt-1 text-lg text-foreground">{value}</div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-medium text-foreground">
        {value}
        <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function CropMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`absolute h-3 w-3 text-foreground/50 ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M0 1 H8" />
      <path d="M1 0 V8" />
    </svg>
  );
}

