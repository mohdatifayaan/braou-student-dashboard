import { useState } from 'react'
import LoginPage        from './components/LoginPage.jsx'
import OnboardingScreen from './components/OnboardingScreen.jsx'
import Dashboard        from './components/Dashboard.jsx'
import ResultsPage      from './components/ResultsPage.jsx'

/**
 * App — top-level screen router.
 *
 * Screens:
 *   'login'       → LoginPage        (phone + OTP)
 *   'onboarding'  → OnboardingScreen (profile setup)
 *   'dashboard'   → Dashboard        (smart feed + courses)
 *   'results'     → ResultsPage      (academic history)
 *
 * Transitions are driven by callbacks passed down as props so child
 * components stay free of routing logic.
 */
export default function App() {
  const [screen, setScreen] = useState('login')
  const [user,   setUser]   = useState(null)
  const [tags,   setTags]   = useState([])   // interests selected during onboarding
  const [theme,  setTheme]  = useState('dark')

  // Called by LoginForm after successful OTP verification
  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setScreen('onboarding')
  }

  // Called by OnboardingScreen when "Complete Setup →" is clicked
  // payload = { userId, interests: string[], avatarPreview }
  const handleOnboardingComplete = (payload) => {
    setTags(payload.interests ?? [])
    setUser(prev => ({ ...prev, avatarPreview: payload.avatarPreview }))
    setScreen('dashboard')
  }

  // Called by Dashboard "Logout" button
  const handleLogout = () => {
    localStorage.removeItem('university_token')
    setUser(null)
    setTags([])
    setScreen('login')
  }

  // Called by Dashboard "View Results" quick action
  const handleViewResults = () => setScreen('results')

  // Called by ResultsPage "← Back to Dashboard" button
  const handleBackToDashboard = () => setScreen('dashboard')

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  let content;
  if (screen === 'onboarding') {
    content = <OnboardingScreen user={user} onComplete={handleOnboardingComplete} />
  } else if (screen === 'results') {
    content = <ResultsPage user={user} onBack={handleBackToDashboard} />
  } else if (screen === 'dashboard') {
    content = (
      <Dashboard
        user={user}
        tags={tags}
        onLogout={handleLogout}
        onViewResults={handleViewResults}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    )
  } else {
    content = <LoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className={theme}>
      <div className="min-h-screen text-[var(--text-primary)] transition-colors duration-300">
        {content}
      </div>
    </div>
  )
}
