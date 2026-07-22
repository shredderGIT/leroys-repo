import Link from "next/link";
import { notFound } from "next/navigation";
import { getPassport, getPassports } from "@/lib/dpp-adapter";

export function generateStaticParams() {
  return getPassports().map((passport) => ({ dppId: passport.id }));
}

export default async function PassportPage({ params }: { params: Promise<{ dppId: string }> }) {
  const { dppId } = await params;
  const passport = getPassport(decodeURIComponent(dppId));
  if (!passport) notFound();

  return (
    <div className="page-shell detail-page">
      <Link className="back-link" href="/">← Back to catalogue</Link>
      <section className="detail-hero">
        <div>
          <div className="card-topline"><span className="badge">{passport.id}</span><span>{passport.businessRole}</span></div>
          <p className="eyebrow">{passport.productConcept}</p>
          <h1>{passport.productName}</h1>
          <p className="hero-copy">{passport.productSeries} · Model {passport.productModel}</p>
        </div>
        <div className="passport-seal"><span>DPP</span><small>Verified record</small></div>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <h2>Product identity</h2>
          <dl className="detail-list">
            <div><dt>DPP ID</dt><dd>{passport.id}</dd></div>
            <div><dt>Article number</dt><dd>{passport.articleNumber}</dd></div>
            <div><dt>Product concept</dt><dd>{passport.productConcept}</dd></div>
            <div><dt>Product series</dt><dd>{passport.productSeries}</dd></div>
            <div><dt>Product model</dt><dd>{passport.productModel}</dd></div>
          </dl>
        </article>
        <article className="panel">
          <h2>Passport holder</h2>
          <dl className="detail-list">
            <div><dt>Legal entity</dt><dd>{passport.holder.legalEntityName}</dd></div>
            <div><dt>Organisation number</dt><dd>{passport.holder.organisationNumber}</dd></div>
            <div><dt>Business role</dt><dd>{passport.businessRole}</dd></div>
            <div><dt>Ownership type</dt><dd>{passport.holder.ownershipType ?? "Not supplied"}</dd></div>
            <div><dt>Organisation type</dt><dd>{passport.holder.organisationType ?? "Not supplied"}</dd></div>
          </dl>
        </article>
      </section>
    </div>
  );
}
