import { MotionDiv, MotionH2, MotionP } from '@/components/ui/MotionComponents';
import { Card } from '../ui/Card';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '📊',
    title: 'Coding Patterns',
    description: 'Analyze your most productive days and commit frequencies.',
  },
  {
    icon: '👥',
    title: 'Top Collaborators',
    description: 'See who you worked with the most throughout the year.',
  },
  {
    icon: '⭐',
    title: 'Project Highlights',
    description: 'Celebrate the repositories that got the most attention.',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="relative py-20 md:py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Unlock Your Coding Story
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-foreground/60 max-w-3xl mx-auto"
          >
            From your busiest day to your most used language, get a personalized summary of your year on GitHub.
          </MotionP>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <MotionDiv
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-dark-100 border border-dark-200 rounded-2xl p-8 hover:border-primary/30 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};
