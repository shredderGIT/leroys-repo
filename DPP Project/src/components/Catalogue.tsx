"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Passport } from "@/lib/types";

export default function Catalogue({ passports }: { passports: Passport[] }) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("all");

  const seriesOptions = useMemo(
    () => [...new Set(passports.map((p) => p.productSeries).filter(Boolean))].sort(),
    [passports]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return passports.filter((p) => {
      const matchesSeries = series === "all" || p.productSeries === series;
      const haystack = [p.id, p.productName, p.productModel, p.productSeries, p.articleNumber, p.productConcept, p.holder.legalEntityName].join(" ").toLowerCase();
      return matchesSeries && (!q || haystack.includes(q));
    });
  }, [passports, query, series]);

  return (
    <>
      <section className="toolbar" aria-label="Catalogue filters">
        <label>
          <span>Search passports</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Product, DPP ID, article or holder" />
        </label>
        <label>
          <span>Product series</span>
          <select value={series} onChange={(e) => setSeries(e.target.value)}>
            <option value="all">All series</option>
            {seriesOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <div className="result-row"><strong>{filtered.length}</strong> of {passports.length} passports</div>

      <section className="card-grid">
        {filtered.map((passport) => (
          <article className="passport-card" key={passport.id}>
            <div className="card-topline"><span className="badge">{passport.id}</span><span>{passport.businessRole}</span></div>
            <div>
              <p className="eyebrow">{passport.productConcept || "Product"}</p>
              <h2>{passport.productName}</h2>
              <p className="muted">{passport.productSeries} · {passport.productModel}</p>
            </div>
            <dl className="card-facts">
              <div><dt>Article</dt><dd>{passport.articleNumber}</dd></div>
              <div><dt>Holder</dt><dd>{passport.holder.legalEntityName}</dd></div>
            </dl>
            <Link className="button" href={`/passports/${encodeURIComponent(passport.id)}`}>View passport <span>→</span></Link>
          </article>
        ))}
      </section>
      {filtered.length === 0 && <div className="empty">No passports match the selected filters.</div>}
    </>
  );
}
