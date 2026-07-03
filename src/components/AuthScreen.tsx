import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Lock, 
  Info,
  Globe,
  Loader2
} from 'lucide-react';
import { ALL_INDIAN_STATES } from '../seedData';

// Custom SVG for Google
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2 inline-block" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      setError('Please fill in all credentials.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Fetch users from localStorage
      const users = JSON.parse(localStorage.getItem('mp_portal_users') || '[]');
      const user = users.find((u: any) => u.email.toLowerCase() === signInEmail.toLowerCase());

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 850));

      if (user && user.password === signInPassword) {
        localStorage.setItem('mp_portal_current_user', JSON.stringify(user));
        onAuthSuccess(user);
      } else if (signInEmail.toLowerCase() === 'admin@mp.gov.in' && signInPassword === 'admin123') {
        // Default master account
        const defaultUser = {
          firstName: 'Abhinav',
          lastName: 'Srivastava',
          email: 'admin@mp.gov.in',
          phone: '+91 94471 01234',
          gender: 'Male',
          dob: '1990-01-01',
          state: 'Kerala',
          city: 'Thiruvananthapuram',
          isAdmin: true
        };
        localStorage.setItem('mp_portal_current_user', JSON.stringify(defaultUser));
        onAuthSuccess(defaultUser);
      } else {
        setError('Invalid email or password combination.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!firstName || !lastName || !phone || !email || !gender || !dob || !state || !city || !password) {
      setError('Please fill in all fields to complete registration.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('mp_portal_users') || '[]');
      
      // Check duplicate
      const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email address already exists.');
        setLoading(false);
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        firstName,
        lastName,
        phone,
        email,
        gender,
        dob,
        state,
        city,
        password,
        isAdmin: false
      };

      // Push and save
      users.push(newUser);
      localStorage.setItem('mp_portal_users', JSON.stringify(users));

      // Simulate server save
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      }).catch(err => console.log('Silent server register sync fallback: ', err));

      // Simulate loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Auto login after sign up
      localStorage.setItem('mp_portal_current_user', JSON.stringify(newUser));
      onAuthSuccess(newUser);
    } catch (err) {
      setError('An error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset demo login
  const handleQuickDemoLogin = (role: 'mp' | 'citizen') => {
    if (role === 'mp') {
      const demoMP = {
        firstName: 'Abhinav',
        lastName: 'Srivastava',
        email: 'admin@mp.gov.in',
        phone: '+91 94471 01234',
        gender: 'Male',
        dob: '1990-01-01',
        state: 'Kerala',
        city: 'Thiruvananthapuram',
        isAdmin: true
      };
      localStorage.setItem('mp_portal_current_user', JSON.stringify(demoMP));
      onAuthSuccess(demoMP);
    } else {
      const demoCitizen = {
        firstName: 'Harish',
        lastName: 'Kumar',
        email: 'harish.kumar@gmail.com',
        phone: '+91 98456 78901',
        gender: 'Male',
        dob: '1995-05-15',
        state: 'Kerala',
        city: 'Kazhakkoottam',
        isAdmin: false
      };
      localStorage.setItem('mp_portal_current_user', JSON.stringify(demoCitizen));
      onAuthSuccess(demoCitizen);
    }
  };

  return (
    <div id="auth-screen-container" className="min-h-screen bg-[#060608] flex flex-col justify-between items-center text-slate-100 font-sans p-4 relative overflow-hidden">
      
      {/* Decorative vector background meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-950/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header section with Portal Branding */}
      <div className="w-full max-w-md text-center pt-8 space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-800/80 rounded-full">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[10px] font-mono tracking-wider font-extrabold text-cyan-400 uppercase">
            National Constituency Engine
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          MP-Citizen Development Portal
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 font-sans max-w-xs mx-auto">
          AI-driven collaborative pipeline linking members of parliament and local residents.
        </p>
      </div>

      {/* Main card box */}
      <div className="w-full max-w-xl my-6 relative z-10">
        <div className="bg-[#09090b]/95 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!isSignUp ? (
              /* SIGN IN PAGE VIEW */
              <motion.div
                key="signin-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Sign In Account</h2>
                  <p className="text-xs text-slate-400">Enter your credentials to manage your constituency portal.</p>
                </div>

                {/* Social Login preset */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('citizen')}
                    className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-zinc-800 bg-[#0f0f11] hover:bg-zinc-800 text-[11px] font-bold text-slate-200 transition-all cursor-pointer"
                  >
                    <GoogleIcon />
                    Google
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-800/60"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest">Or</span>
                  <div className="flex-grow border-t border-zinc-800/60"></div>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="eg. johnfrans@gmail.com"
                      className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 text-slate-100 placeholder-zinc-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('mp')}
                        className="text-[9px] text-cyan-400 hover:underline font-mono"
                      >
                        Demo Access?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 pr-11 text-slate-100 placeholder-zinc-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white hover:bg-slate-100 text-black font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(true); setError(null); }}
                      className="text-white font-bold hover:underline cursor-pointer"
                    >
                      Log in? Sign Up
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* SIGN UP PAGE VIEW */
              <motion.div
                key="signup-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">Sign Up Account</h2>
                  <p className="text-xs text-slate-400">Enter your personal data to create your account.</p>
                </div>

                {/* Social logins */}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('citizen')}
                    className="flex items-center justify-center py-2 px-4 rounded-xl border border-zinc-800 bg-[#0f0f11] hover:bg-zinc-800 text-[10px] font-bold text-slate-200 transition-all cursor-pointer"
                  >
                    <GoogleIcon />
                    Google
                  </button>
                </div>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-zinc-800/60"></div>
                  <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest">Or</span>
                  <div className="flex-grow border-t border-zinc-800/60"></div>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  {/* 1. Name fields in a grid row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="eg. John"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="eg. Francisco"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 2. Contact details: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        Email ID
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="eg. johnfrans@gmail.com"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="eg. +91 94471 01234"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 3. Demographics: Gender & DOB */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                        Gender
                      </label>
                      <select
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                      >
                        <option value="" className="text-zinc-600 bg-slate-950">Select Gender</option>
                        <option value="Male" className="bg-slate-950 text-slate-200">Male</option>
                        <option value="Female" className="bg-slate-950 text-slate-200">Female</option>
                        <option value="Other" className="bg-slate-950 text-slate-200">Other</option>
                        <option value="Prefer not to say" className="bg-slate-950 text-slate-200">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        DOB
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        onClick={(e) => {
                          try {
                            e.currentTarget.showPicker();
                          } catch (err) {
                            // Fallback for older browsers
                          }
                        }}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer text-slate-300 [color-scheme:dark]"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  {/* 4. Geography: State & City */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                        State
                      </label>
                      <select
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 focus:outline-none cursor-pointer"
                      >
                        <option value="" className="text-zinc-600 bg-slate-955">Select State</option>
                        {ALL_INDIAN_STATES.map((s) => (
                          <option key={s} value={s} className="bg-[#0f0f12] text-slate-200">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="eg. Thiruvananthapuram"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3 text-slate-100 placeholder-zinc-650 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* 5. Password & parameters */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full text-xs bg-[#0f0f12] border border-zinc-800 focus:border-zinc-600 rounded-xl p-3.5 pr-11 text-slate-100 placeholder-zinc-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-350 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block leading-relaxed font-sans pl-1">
                      Must be at least 8 characters.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white hover:bg-slate-100 text-black font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        Creating Account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </form>

                <div className="text-center pt-1">
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(false); setError(null); }}
                      className="text-white font-bold hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Developer and Portal notice bar */}
      <div className="w-full max-w-md text-center pb-6 space-y-2 relative z-10">
        <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5 text-cyan-500/60" />
          Secure, direct-action biometric identity matching & session tracking.
        </p>
      </div>

    </div>
  );
}
