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
      <section className="default-margin default-height my-24 flex items-center justify-center">
        {children}
      </section>
      <Footer />
    </div>
  );
}
