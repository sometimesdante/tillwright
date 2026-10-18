import Sidebar from "@/ui/Sidebar";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Sidebar />
      <section className="default-margin default-height my-8">
        <div className="ml-16">{children}</div>
      </section>
    </div>
  );
}
