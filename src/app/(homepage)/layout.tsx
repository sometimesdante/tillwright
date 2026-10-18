import Footer from "@/ui/Footer";
import Header from "@/ui/Header";
import CartPanel from "@/ui/CartPanel";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <CartPanel />
      <section className="mt-[4.25rem] mb-24">
        {children}
      </section>
      <Footer />
    </div>
  );
}
