import { Button } from '@/components/ui/Button';
import { MotionDiv, MotionH1, MotionP } from '@/components/ui/MotionComponents';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark pt-20">
      <div className="absolute inset-0">
        <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 items-center justify-center p-4 text-center" data-alt="Dark futuristic background with glowing gradient waves" 
        style={{
            backgroundImage: `linear-gradient(
            rgba(13, 13, 13, 0.6) 0%, rgba(13, 13, 13, 0.9) 100%), 
            url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEznhsJ7Vzdg-GmEOzsZ45nqe2bDG5ab6sEWzASL2TqBUK9VqRFOc5__2RP9DbPXS085xowNv4LuM2UH2SUIzSVRBCdPAIgoF_U5IbIrFqSDtMD2E_qUbn-oarKF93taSK3PzGvTP0vVOpOBARhx_UUkd7Qyhu8VUJU-e4-6-KHnmiBuF6Ku_yXTk54opjfq0cENOOTGA6xoSAVVqvkhCrdLoid9MDSSG5Ux42qkm1z--gH0sZ41S6Ij2CDRXcci4hdawbgJ6rDlzj')`
        }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <MotionH1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
          >
            Your GitHub Year in Review
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-foreground/70 mb-10 max-w-3xl"
          >
            Discover your coding habits, celebrate your milestones, and see how you grew in 2024.
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center"
          >
            <Button
              variant="default"
              size="lg"
              className="bg-primary! hover:bg-primary-600! text-white rounded-full! px-8 animate-button-glow"
            >
              Generate Wrapped
            </Button>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};
