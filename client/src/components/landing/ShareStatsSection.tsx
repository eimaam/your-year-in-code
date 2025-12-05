import { MotionDiv, MotionH2, MotionP } from '@/components/ui/MotionComponents';

export const ShareStatsSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Share Your Stats
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-foreground/60 max-w-3xl mx-auto"
          >
            Generate a beautiful, shareable summary of your achievements to post on social media and show off your year in code.
          </MotionP>
        </div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative rounded-3xl bg-dark-100 p-12 border border-dark-200">
            <div className="bg-accent-100 rounded-2xl p-8 aspect-3/4 flex items-center justify-center shadow-2xl">
              <div className="bg-light-50 rounded-xl p-6 w-48 shadow-lg">
                <div className="space-y-2 mb-4">
                  <div className="h-1 bg-light-400 rounded w-3/4" />
                  <div className="h-1 bg-light-400 rounded w-full" />
                  <div className="h-1 bg-light-400 rounded w-2/3" />
                </div>
                
                <div className="mb-4">
                  <svg viewBox="0 0 120 40" className="w-full h-20">
                    <path d="M 10,35 L 20,20 L 30,25 L 40,15 L 50,18 L 60,10 L 70,20 L 80,12 L 90,22 L 100,15 L 110,25" 
                          className="fill-accent-700/30" 
                          stroke="none" />
                    <path d="M 10,35 L 20,20 L 30,25 L 40,15 L 50,18 L 60,10 L 70,20 L 80,12 L 90,22 L 100,15 L 110,25 L 110,40 L 10,40 Z" 
                          className="fill-accent-700/50" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-square rounded-full bg-accent-700" />
                  <div className="aspect-square rounded-full bg-dark-500" />
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-light-400" />
                  <div className="w-2 h-2 rounded-full bg-light-400" />
                  <div className="w-2 h-2 rounded-full bg-light-400" />
                </div>
              </div>
            </div>
            
            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl -z-10 opacity-60" />
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};
