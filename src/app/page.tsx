import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Research from "@/components/Research";
import Record from "@/components/Record";
import Teaching from "@/components/Teaching";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Research />
        <Record />
        <Teaching />
        <Publications />
        <Contact />
      </main>
    </>
  );
}
