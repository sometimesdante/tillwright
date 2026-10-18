export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="default-margin my-24">{children}</section>
    </div>
  );
}
