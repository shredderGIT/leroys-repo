import { createFileRoute, Link } from "@tanstack/react-router";
import { passports } from "@/data/dpp";
import { Leaf, Zap, Recycle, ArrowRight } from "lucide-react";
import { ChairSketch } from "@/components/ChairSketch";


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

function Index() {
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
            Transparency from material to manufacture.
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
          {passports.map((p) => (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {p.series ?? "Series"}
                  </span>
                  <span className="rounded-full bg-leaf/20 px-2.5 py-1 text-xs font-medium text-leaf-foreground">
                    {p.businessRole}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-medium">{p.product}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.presentation}</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
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
            </Link>
          ))}
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
