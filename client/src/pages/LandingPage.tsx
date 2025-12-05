import {
  Navbar,
  HeroSection,
  FeaturesSection,
  ShareStatsSection,
  Footer,
} from '@/components/landing';

export const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-dark text-foreground">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />
        <ShareStatsSection />
      </main>
      <Footer />
    </div>
  );
};
