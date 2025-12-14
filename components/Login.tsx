import React, { useState } from 'react';

interface LoginProps {
    onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just proceed to the game
        onLogin();
    };

    return (
        <div className="bg-[#101622] font-sans text-white min-h-screen">
            <div className="relative flex h-full min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
                {/* Header Image Area */}
                <div className="w-full relative h-[280px] shrink-0">
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-center bg-no-repeat bg-cover z-0"
                        style={{
                            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCurLiSm94ytKtzD1EujuKw9-4ZbaASSsggBopbfohdgv8MlvQGd7j6Z27joua56ZoQHgyH7ebtbOsMkmoX268QdSlKLYFsQISVBx946xkip9QLyPM-WUl-VFJ710rF-FOLde5XT-jQQCcHoteOivt6MXFyh7xfBdmNg4qcFTxkZTUmBjvR6cI5iAEK8eoyTj1GDdDEvoMMSGc0_JtqgPftmYpUUB7TMYS1aU6mrRk6oRedhciENLmWsZm-eJTmjtT1cv4iZUIPjx8")'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#101622] z-10"></div>

                    {/* Logo/Title Overlay */}
                    <div className="relative z-20 flex flex-col items-center justify-end h-full pb-6 px-4">
                        <div className="w-16 h-16 bg-[#135bec]/20 rounded-xl backdrop-blur-sm flex items-center justify-center border border-[#135bec]/30 mb-4 shadow-[0_0_15px_rgba(19,91,236,0.5)]">
                            <svg className="w-8 h-8 text-[#135bec]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <h1 className="text-white tracking-tight text-3xl font-bold leading-tight text-center drop-shadow-md">Grandmaster</h1>
                        <p className="text-gray-300 text-sm font-medium mt-1">Master Your Strategy</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col px-6 pb-6 relative z-10 -mt-4">
                    {/* Segmented Control */}
                    <div className="flex p-1 bg-[#1c1f27] border border-[#282e39] rounded-xl mb-6 shadow-lg">
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="auth-mode"
                                value="login"
                                checked={authMode === 'login'}
                                onChange={() => setAuthMode('login')}
                                className="sr-only peer"
                            />
                            <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-gray-400 transition-all peer-checked:bg-[#135bec] peer-checked:text-white peer-checked:shadow-md">
                                Login
                            </div>
                        </label>
                        <label className="flex-1 cursor-pointer">
                            <input
                                type="radio"
                                name="auth-mode"
                                value="signup"
                                checked={authMode === 'signup'}
                                onChange={() => setAuthMode('signup')}
                                className="sr-only peer"
                            />
                            <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-gray-400 transition-all peer-checked:bg-[#135bec] peer-checked:text-white peer-checked:shadow-md">
                                Sign Up
                            </div>
                        </label>
                    </div>

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email or Username</label>
                            <div className="relative flex items-center group">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1c1f27] border border-[#3b4354] text-white text-base rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] block p-3.5 pr-12 transition-colors placeholder-gray-600"
                                    placeholder="magnus@chess.com"
                                />
                                <div className="absolute right-4 text-gray-500 pointer-events-none flex items-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative flex items-center group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1c1f27] border border-[#3b4354] text-white text-base rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] block p-3.5 pr-12 transition-colors placeholder-gray-600"
                                    placeholder="••••••••"
                                />
                                <div
                                    className="absolute right-4 text-gray-500 cursor-pointer hover:text-white transition-colors flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end pt-1">
                            <a className="text-sm font-medium text-[#135bec] hover:text-[#135bec]/80 transition-colors cursor-pointer">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Primary CTA */}
                        <button
                            type="submit"
                            className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-4 px-4 rounded-lg shadow-[0_4px_14px_0_rgba(19,91,236,0.39)] transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                        >
                            <span>Enter Arena</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>

                    {/* Social Login Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#282e39]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#101622] px-3 text-gray-500 font-medium tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-3 justify-center">
                        {/* Apple */}
                        <button
                            type="button"
                            onClick={onLogin}
                            className="flex-1 bg-[#1c1f27] border border-[#3b4354] hover:bg-[#2a2f3b] text-white p-3 rounded-lg transition-colors flex items-center justify-center group"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.2 3.82-1.2.66.02 2.53.25 3.73 1.99-3.23 1.95-2.67 6.49.52 7.78-.65 1.76-1.57 3.33-3.15 3.66zM12.03 7.25c-.19-2.69 2.1-4.87 4.74-5.06.28 2.52-2.67 5.25-4.74 5.06z" />
                            </svg>
                        </button>
                        {/* Google */}
                        <button
                            type="button"
                            onClick={onLogin}
                            className="flex-1 bg-[#1c1f27] border border-[#3b4354] hover:bg-[#2a2f3b] text-white p-3 rounded-lg transition-colors flex items-center justify-center group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>
                        {/* Facebook */}
                        <button
                            type="button"
                            onClick={onLogin}
                            className="flex-1 bg-[#1c1f27] border border-[#3b4354] hover:bg-[#2a2f3b] text-white p-3 rounded-lg transition-colors flex items-center justify-center group"
                        >
                            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                    </div>

                    {/* Footer Legal */}
                    <div className="mt-auto pt-8 pb-4 text-center">
                        <p className="text-[10px] text-gray-500">
                            By continuing, you agree to our <br />
                            <a className="underline hover:text-gray-300 cursor-pointer">Terms of Service</a> &amp; <a className="underline hover:text-gray-300 cursor-pointer">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
