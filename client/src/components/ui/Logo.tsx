import logo from "../../assets/images/year-in-code-logo.png";

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
    xxlarge: 'w-20 h-20',
  };
  className = className ? `${sizeClasses[size]} ${className}` : sizeClasses[size];
  return (
    <img src={logo} alt="aboutly logo" className={`w-10 h-10 ${className}`} />
  );
};
