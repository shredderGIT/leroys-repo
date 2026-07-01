import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  getPassport,
  passports,
  registryNameMap,
  type DigitalProductPassport,
  type DppDocument,
  type DppMaterial,
} from "@/data/dpp";
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
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import plus6Img from "@/assets/plus-6.png";
import plus8Img from "@/assets/plus-8.png";
import capellaImg from "@/assets/capella-esd.png";
import oberonImg from "@/assets/oberon-167-ssv2.png";

const productImage: Record<string, string> = {
  "Plus 6": plus6Img,
  "Plus 8": plus8Img,
  "Capella X": capellaImg,
  "Oberon Meeting Table": oberonImg,
};


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
          <div className="grid items-start gap-8 sm:grid-cols-[1fr_220px]">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                {p.series ?? "Digital Product Passport"}
              </p>
              <h1 className="mt-2 text-3xl font-medium sm:text-4xl">{p.product}</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{p.presentation}</p>

              <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <MetaRow
                  icon={<Factory className="h-3.5 w-3.5" />}
                  label="Product Model"
                  value={p.modelPresentation ?? "—"}
                />
                <MetaRow
                  icon={<Layers className="h-3.5 w-3.5" />}
                  label="Series"
                  value={p.series ?? "—"}
                />

                {p.artNr && (
                  <MetaRow
                    icon={<Hash className="h-3.5 w-3.5" />}
                    label="Article nr"
                    value={p.artNr}
                  />
                )}
              </dl>
            </div>
            {productImage[p.product] && (
              <div className="flex flex-col gap-3">
                <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={productImage[p.product]}
                    alt={`${p.product} task chair`}
                    className="h-[190px] w-[190px] object-contain"
                  />
                </div>
                <div className="rounded-xl border border-border bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <Hash className="h-3.5 w-3.5" />
                    Digital Product Passport ID
                  </div>
                  <div className="mt-1 break-all font-mono text-xs text-foreground">
                    {p.dppId}
                  </div>
                </div>
              </div>
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
                  const declared = new Set(
                    p.materials
                      .map((m) => registryNameMap[m.name])
                      .filter((n): n is string => Boolean(n)),
                  );
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
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-medium">EPD material composition</h2>
          <p className="text-xs text-muted-foreground">
            Extracted via <span className="font-mono">epd-mat-info</span> skill
          </p>
        </div>
        {(() => {
          const epdGroups = groupBySource(p.materials).filter((g) => g.isEpd);
          if (epdGroups.length === 0) {
            return (
              <p className="mt-4 text-sm text-muted-foreground">
                No EPD material composition table available for this product.
              </p>
            );
          }
          return (
            <div className="mt-5 space-y-6">
              {epdGroups.map(({ source, items }) => (
                <EpdMatInfoTable key={source} source={source} items={items} />
              ))}
            </div>
          );
        })()}
      </section>

      <section>
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
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-medium">Material composition</h2>
            <p className="text-xs text-muted-foreground">Grouped by source document</p>
          </div>
          <div className="mt-5 space-y-6">
            {groupBySource(p.materials).map(({ source, items, isEpd }) => (
              <MaterialTable key={source} source={source} items={items} isEpd={isEpd} />
            ))}
          </div>
        </section>
      )}


      {p.recyclability && (
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-medium">Recyclability</h2>
            <p className="text-xs text-muted-foreground">Source: {p.recyclability.source}</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <BigMetric
              icon={<Recycle className="h-5 w-5" />}
              label="Material recycling"
              value={p.recyclability.materialRecyclingPercent.toString()}
              unit="%"
              tone="leaf"
              progress={p.recyclability.materialRecyclingPercent}
            />
            <BigMetric
              icon={<Zap className="h-5 w-5" />}
              label="Energy recovery"
              value={p.recyclability.energyRecoveryPercent.toString()}
              unit="%"
              tone="clay"
              progress={p.recyclability.energyRecoveryPercent}
            />
            <BigMetric
              icon={<Leaf className="h-5 w-5" />}
              label="Total recyclability"
              value={p.recyclability.totalPercent.toString()}
              unit="%"
              tone="leaf"
              progress={p.recyclability.totalPercent}
            />
          </div>
        </section>
      )}






      <section>
        <h2 className="text-xl font-medium">Documentation</h2>

        <div className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {sortDocuments(p.documents).map((d) => (
            <DocumentRow key={d.url} doc={d} />
          ))}
        </div>
      </section>
        </div>
      </div>

      <footer className="border-t border-border/60 py-6">
        <div className="mx-auto max-w-6xl px-6 text-xs text-muted-foreground">
          Passport data exported from KS: Digital Product Passport.
        </div>
      </footer>
    </div>

  );
}

function MetaRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border-b border-dashed border-border/70 pb-2">
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className={`mt-0.5 truncate text-sm text-foreground ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function groupBySource(
  materials: DppMaterial[],
): { source: string; items: DppMaterial[]; isEpd: boolean }[] {
  const groups = new Map<string, DppMaterial[]>();
  for (const m of materials) {
    const key = m.source ?? "Unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  const arr = Array.from(groups.entries()).map(([source, items]) => ({
    source,
    items,
    isEpd: /^NEPD/i.test(source),
  }));
  // EPD (NEPD) tables first, then the rest alphabetically
  return arr.sort((a, b) => {
    if (a.isEpd !== b.isEpd) return a.isEpd ? -1 : 1;
    return a.source.localeCompare(b.source);
  });
}

function MaterialTable({
  source,
  items,
  isEpd,
}: {
  source: string;
  items: DppMaterial[];
  isEpd: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{source}</span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
            isEpd
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {isEpd ? "Environmental Product Declaration" : "Sustainability Declaration"}
        </span>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium">Material</th>
            <th className="px-4 py-2.5 text-left font-medium">Category</th>
            <th className="px-4 py-2.5 text-right font-medium">kg</th>
            <th className="px-4 py-2.5 text-right font-medium">%</th>
            <th className="px-4 py-2.5 text-right font-medium">Recycled</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((m, i) => (
            <tr key={`${m.name}-${i}`}>
              <td className="px-4 py-2.5 font-medium">{m.name}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{m.category}</td>
              <td className="px-4 py-2.5 text-right font-mono">{m.kg?.toFixed(2) ?? "—"}</td>
              <td className="px-4 py-2.5 text-right font-mono">
                {m.percent !== undefined ? `${m.percent.toFixed(2)}%` : "—"}
              </td>
              <td className="px-4 py-2.5 text-right font-mono">
                {m.recycledPercent !== undefined ? `${m.recycledPercent.toFixed(2)}%` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EpdField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-foreground">{value}</div>
    </div>
  );
}

function docCategory(d: DppDocument): "epd" | "sd" | "cert" {
  if (/environmental product declaration/i.test(d.name) || /^NEPD/i.test(d.document)) return "epd";
  if (/sustainability declaration/i.test(d.name)) return "sd";
  return "cert";
}

function sortDocuments(docs: DppDocument[]): DppDocument[] {
  const order: Record<string, number> = { epd: 0, sd: 1, cert: 2 };
  return [...docs].sort((a, b) => order[docCategory(a)] - order[docCategory(b)]);
}

function DocumentRow({ doc: d }: { doc: DppDocument }) {
  const [open, setOpen] = useState(false);
  const category = docCategory(d);
  const hasDetails = Boolean(d.epdInfo || d.issuer);
  const isCert = category === "cert";

  return (
    <div className="p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium">{d.name}</span>
            {isCert && (
              <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                Certification
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {isCert ? `Certificate ID · ${d.document}` : d.document}
          </div>
        </div>
        <a
          href={d.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Open document"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
        {hasDetails && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Hide details" : "Show details"}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {hasDetails && open && (
        <div className="mt-4 space-y-3">
          {d.issuer && (
            <div className="text-xs text-muted-foreground">
              Issued by <span className="font-medium text-foreground">{d.issuer.name}</span>
              {d.issuer.orgNr && ` · ${d.issuer.orgNr}`}
            </div>
          )}
          {d.epdInfo && (
            <div className="grid gap-3 rounded-lg bg-muted/40 p-4 text-xs sm:grid-cols-2">
              <EpdField label="Declaration" value={d.epdInfo.declarationNumber} />
              <EpdField label="Product" value={d.epdInfo.product} />
              <EpdField label="Issue date" value={d.epdInfo.issueDate} />
              <EpdField label="Valid to" value={d.epdInfo.validTo} />
              <EpdField label="Programme operator" value={d.epdInfo.programmeOperator} />
              <EpdField label="Standard" value={d.epdInfo.standard} />
              <EpdField label="Owner contact" value={d.epdInfo.ownerContact.person} />
              <EpdField
                label="Contact"
                value={`${d.epdInfo.ownerContact.phone} · ${d.epdInfo.ownerContact.email}`}
              />
              <EpdField label="Third-party verifier" value={d.epdInfo.verifier} />
              <EpdField label="Approval" value={d.epdInfo.approvalStatus} />
            </div>
          )}
        </div>
      )}
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
