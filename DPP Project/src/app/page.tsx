import Catalogue from "@/components/Catalogue";
import { getExportMetadata, getPassports } from "@/lib/dpp-adapter";

export default function Home() {
  const passports = getPassports();
  const metadata = getExportMetadata();

  return (
    <div className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Digital Project Passport</p>
          <h1>Product information, made accessible.</h1>
          <p className="hero-copy">A catalogue generated from the existing information model and its JSON export—without redefining the source model.</p>
        </div>
        <div className="stat-card"><strong>{metadata.totalSize}</strong><span>Published passports</span></div>
      </section>
      <Catalogue passports={passports} />
    </div>
  );
}
