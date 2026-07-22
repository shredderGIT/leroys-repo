import { getExportMetadata } from "@/lib/dpp-adapter";

export default function AboutPage() {
  const metadata = getExportMetadata();
  return (
    <div className="page-shell">
      <section className="hero compact"><div><p className="eyebrow">Information model</p><h1>Traceable field definitions</h1><p className="hero-copy">The catalogue uses stable metadata paths from the supplied export to preserve each field&apos;s semantic context.</p></div></section>
      <section className="panel table-panel">
        <h2>{metadata.name}</h2>
        <div className="table-wrap"><table><thead><tr><th>Display title</th><th>Type</th><th>Information-model path</th></tr></thead><tbody>
          {metadata.columns.map((column) => <tr key={column.id}><td>{column.title}</td><td>{column.dataType}</td><td><code>{column.path.join(" → ")}</code></td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  );
}
