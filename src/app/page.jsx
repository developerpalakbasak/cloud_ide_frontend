"use client"
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";


export default function Home() {

  const { authLoading } = useAuth();

  return (
    authLoading ? <Loader /> : <div className="mx-auto max-w-6xl h-screen">
      {/* <Navbar/> */}
      <div className="h-[85vh] flex items-center justify-center">
        <HeroSection />
      </div>
      {/* <CodeSection/> */}
      <div className="h-[15vh] flex items-center justify-center">
        <Footer />
      </div>
    </div>
  );
}
