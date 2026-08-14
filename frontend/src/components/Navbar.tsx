import { useState, useEffect } from 'react'
import {Sun, Moon } from 'lucide-react'

interface NavbarProps {
  modelLoaded: boolean
  isConnected: boolean
}

export const Navbar = ({ modelLoaded, isConnected }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference or localStorage
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDarkMode = saved ? saved === 'dark' : prefersDark
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-800 dark:from-green-900 dark:to-green-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 flex items-center">
              {/* <Leaf className="h-8 w-8 text-green-300 animate-pulse" /> */}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white"> MaizeGuard
              </h1>
              <p className="text-xs text-green-200">AI-Powered Disease Detection</p>
            </div>
          </div>

          {/* Right side - Status & Controls */}
          <div className="flex items-center gap-6">
            {/* Status Indicators */}
            <div className="flex items-center gap-4">
              {/* Model Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${modelLoaded ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <span className="text-sm font-medium text-green-100">
                  {modelLoaded ? 'Model Ready' : 'Loading Model'}
                </span>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm font-medium text-green-100">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="text-yellow-300" size={20} />
              ) : (
                <Moon className="text-green-200" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
