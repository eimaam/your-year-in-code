import { useState, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { LandingPage } from '@/pages/LandingPage'


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
          <Route path="/" element={<LandingPage />} />
          
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App