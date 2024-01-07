export default function TableRow({ children }: { children: React.ReactNode }) {
  return <td className="hidden py-5 pr-6 sm:table-cell">{children}</td>;
}
