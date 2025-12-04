import { useState, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button';
// TODO: Create these pages for Your Year in Code
// import { LandingPage } from '@/pages/LandingPage'
// import { AuthPage } from '@/pages/AuthPage'
// import { WrappedPage } from '@/pages/WrappedPage'
// import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  const [mounted, setMounted] = useState(false);

  // Dark mode is default
  useEffect(() => {
    document.documentElement.classList.remove('light');
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7C3AED", // Primary purple
          colorError: "#FF4D4F", // Secondary/danger red
          colorSuccess: "#22C55E",
          colorWarning: "#F59E0B",
          colorInfo: "#22D3EE", // Accent cyan
          colorTextBase: "#F5F5F5",
          colorBgBase: "#0D0D0D",
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <AuthProvider>
        <Routes>
          {/* TODO: Add routes for Your Year in Code */}
          <Route path="/" element={
            <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden">
              {/* Background gradient glow */}
              Building....
            </div>
          } />
          
          
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App