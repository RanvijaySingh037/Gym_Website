import Footer from '@/components/public/Footer';
import Header from '@/components/public/Header';
import Hero from '@/components/public/Hero';
import Pricing from '@/components/public/Pricing';
import TransformationHub from '@/components/public/TransformationHub';
import Contact from '@/components/public/Contact';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <Hero />
      <TransformationHub />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
