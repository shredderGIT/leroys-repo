import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPassport, passports, type DigitalProductPassport } from "@/data/dpp";
import {
  ArrowLeft,
  Leaf,
  Zap,
  Recycle,
  FileText,
  ExternalLink,
  Building2,
  Hash,
  Factory,
  Layers,
} from "lucide-react";


export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = getPassport(params.id);
    const title = p ? `${p.product} — Digital Product Passport` : "Product Passport";
    const description = p
      ? `Sustainability passport for ${p.product}: ${p.footprint} kg CO₂e footprint, ${p.recycledContent}% recycled content, ${Number(p.energyUse).toFixed(0)} kWh energy use.`
      : "Digital product passport details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  loader: ({ params }) => {
    const p = getPassport(params.id);
    if (!p) throw notFound();
    return p;
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-xl font-medium">Passport not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">No DPP exists for this ID.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to registry
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-lg font-medium">Couldn't load this passport</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Retry
        </button>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData() as DigitalProductPassport;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All passports
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-leaf/20 px-2.5 py-1 font-medium text-leaf-foreground">
              Verified
            </span>
          </div>
        </div>
      </header>

      <section className="border-b border-border/60 bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            {p.series ?? "Digital Product Passport"}
          </p>
          <h1 className="mt-2 text-3xl font-medium sm:text-4xl">{p.product}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{p.presentation}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <IdRow icon={<Hash className="h-4 w-4" />} label="DPP ID" value={p.dppId} />
            <IdRow icon={<Hash className="h-4 w-4" />} label="Passport ID" value={p.id} />
            <IdRow
              icon={<Factory className="h-4 w-4" />}
              label="Model"
              value={p.modelPresentation ?? p.model}
            />
            {p.artNr && (
              <IdRow icon={<Hash className="h-4 w-4" />} label="Article nr" value={p.artNr} />
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Layers className="h-4 w-4" />
              Classification
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Materials grouped by category for {p.product}
            </p>
            {p.classification.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No classification available.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {p.classification.map((c) => {
                  const declared = new Set(p.materials.map((m) => m.name));
                  return (
                    <li key={c.category}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">{c.category}</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          {c.materials.length}
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {c.materials.map((m) => {
                          const isDeclared = declared.has(m);
                          return (
                            <li
                              key={m}
                              className={`flex items-center justify-between rounded-md px-2 py-1 text-xs ${
                                isDeclared
                                  ? "bg-primary/10 text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span>{m}</span>
                              {isDeclared && (
                                <span className="rounded-full bg-primary px-1.5 text-[9px] font-medium uppercase tracking-wider text-primary-foreground">
                                  EPD
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <div className="space-y-10">
      <section>

        <h2 className="text-xl font-medium">Environmental performance</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <BigMetric
            icon={<Zap className="h-5 w-5" />}
            label="Energy use"
            value={Number(p.energyUse).toLocaleString()}
            unit="kWh"
            tone="clay"
          />
          <BigMetric
            icon={<Leaf className="h-5 w-5" />}
            label="Carbon footprint"
            value={p.footprint.toString()}
            unit="kg CO₂e"
            tone="leaf"
          />
          <BigMetric
            icon={<Recycle className="h-5 w-5" />}
            label="Recycled content"
            value={p.recycledContent.toString()}
            unit="%"
            tone="leaf"
            progress={p.recycledContent}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-4">
        <h2 className="text-xl font-medium">Organisations</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {p.organisations.map((o, i) => (
            <div
              key={`${o.orgNr}-${o.role}-${i}`}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                {o.url ? (
                  <a
                    href={o.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-primary hover:underline"
                  >
                    {o.name} <ExternalLink className="inline h-3 w-3" />
                  </a>
                ) : (
                  <div className="text-base font-medium">{o.name}</div>
                )}
                <div className="text-sm text-muted-foreground">Org nr · {o.orgNr}</div>
                <span className="mt-2 inline-block rounded-full bg-accent/30 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                  {o.role}
                </span>
              </div>

            </div>
          ))}
        </div>
      </section>

      {p.materials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-medium">Material composition</h2>
            <p className="text-xs text-muted-foreground">
              Filtered to materials declared in the product material registry
            </p>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Material</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">kg</th>
                  <th className="px-4 py-3 text-right font-medium">%</th>
                  <th className="px-4 py-3 text-right font-medium">Recycled</th>
                  <th className="px-4 py-3 text-left font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {p.materials.map((m) => (
                  <tr key={m.name}>
                    <td className="px-4 py-3 font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.category}</td>
                    <td className="px-4 py-3 text-right font-mono">{m.kg?.toFixed(2) ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      {m.percent !== undefined ? `${m.percent.toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {m.recycledPercent !== undefined ? `${m.recycledPercent.toFixed(2)}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.source ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}





      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-xl font-medium">Documentation</h2>

        <div className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {p.documents.map((d) => (
            <a
              key={d.url}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 transition-colors hover:bg-muted/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{d.name}</div>
                <div className="text-sm text-muted-foreground">{d.document}</div>
                {d.issuer && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Issued by <span className="font-medium text-foreground">{d.issuer.name}</span>
                    {d.issuer.orgNr && ` · ${d.issuer.orgNr}`}
                  </div>
                )}
              </div>

              <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 py-6">
        <div className="mx-auto max-w-6xl px-6 text-xs text-muted-foreground">
          Passport data exported from KS: Digital Product Passport.
        </div>
      </footer>
    </div>
  );
}

function IdRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 truncate font-mono text-xs">{value}</div>
    </div>
  );
}





function BigMetric({
  icon,
  label,
  value,
  unit,
  tone,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  tone: "leaf" | "clay";
  progress?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            tone === "leaf" ? "bg-leaf/20 text-leaf-foreground" : "bg-clay/25 text-clay-foreground"
          }`}
        >
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-3 text-2xl font-medium">
        {value}
        <span className="ml-2 text-sm font-normal text-muted-foreground">{unit}</span>
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-leaf transition-all"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Preload route tree references
void passports;
