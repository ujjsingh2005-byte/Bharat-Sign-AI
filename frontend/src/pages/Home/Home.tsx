import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Trusted from "../../components/home/Trusted";
import Features from "../../components/home/Features";
import Footer from "../../components/layout/Footer";
import Demo from "../../components/home/Demo";
import Languages from "../../components/home/Languages";
import WhyUs from "../../components/home/WhyUs";
import Stats from "../../components/home/Stats";
import FAQ from "../../components/home/FAQ";
import CTA from "../../components/home/CTA";

export default function Home() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Navbar />
      <Hero />
      <Demo />
      <Languages />
      <Features />
      <WhyUs />
      <Trusted />
      <Stats />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
