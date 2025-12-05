export const Footer = () => {
    return (
        <footer className="bg-background border-t border-dark-200 py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="text-foreground/50 text-sm text-center md:text-left">
                            © {new Date().getFullYear()} Year in Code - Github Wrapped. Not affiliated with GitHub, Inc.
                        </p>
                        <span className="hidden md:inline text-foreground/30">•</span>

                    </div>

                    <div className="flex items-center gap-8">
                        <a
                            href="#about"
                            className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="#privacy"
                            className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#source-code"
                            className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                        >
                            Source Code
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
