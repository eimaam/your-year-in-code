import { Button } from '@/components/ui/Button';
import { MotionHeader } from '@/components/ui/MotionComponents';
import { Logo } from '../ui/Logo';

export const Navbar = () => {
    return (
        <MotionHeader
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-card/50 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <nav className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-3">
                        <Logo />
                        <span className="text-xl font-bold text-foreground">
                            Your Year in Code
                        </span>
                    </div>
                    <div className='flex items-center gap-6 justify-center'>
                        <div className="hidden md:flex items-center gap-8">
                            <a
                                href="#how-it-works"
                                className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                            >
                                How it works
                            </a>
                            <a
                                href="#privacy"
                                className="text-foreground/70 hover:text-foreground transition-colors text-sm"
                            >
                                Privacy
                            </a>
                        </div>
                        <Button
                            variant="default"
                            size="default"
                            className="bg-primary! hover:bg-primary-600! text-white rounded-full! px-6"
                        >
                            Sign in with GitHub
                        </Button>
                    </div>
                </nav>
            </div>
        </MotionHeader>
    );
};
