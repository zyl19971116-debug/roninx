export function PageHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <header className="page-heading"><small>{eyebrow}</small><h1>{title}</h1><p>{copy}</p></header>;
}
