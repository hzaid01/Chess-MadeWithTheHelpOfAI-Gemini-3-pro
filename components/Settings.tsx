import React, { useState } from 'react';

interface SettingsProps {
    onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticEnabled, setHapticEnabled] = useState(true);
    const [moveValidation, setMoveValidation] = useState(false);
    const [autoQueen, setAutoQueen] = useState(true);
    const [pieceAnimations, setPieceAnimations] = useState(true);

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
    );

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden selection:bg-primary/30">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-primary"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Settings</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
                {/* Profile Section */}
                <section className="flex flex-col gap-2">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div
                                className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center ring-2 ring-primary/20"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrprj3SgEVCD8SpXQxHa5zxOfAZkT9JLabE4TUiE88tv-LLI2FcTQ6bIxv2Nv5_yDsafl94kqIPs-wpFfjuC0H8Wlp-lzH0Ess8f6T-v16YCpAnTHXn3pOSOYCEoQWVatva6ND9Pb9gJEsfEOP-WNz8veArk0nyKG1drWSNm4xK0NYFU96u9Y634RCiroLuyecE1N9KNAqc942odXofE1RUQP-1ot-CscGhpyuGwD7qpqgrT0ru4PT6plv0bJ5hHSpWEL-qqBzJ2o')",
                                }}
                            ></div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-surface-light dark:border-surface-dark">
                                PRO
                            </div>
                        </div>
                        <div className="flex flex-col justify-center flex-1">
                            <h2 className="text-xl font-bold leading-tight">GrandmasterFlash</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                                    ELO 1500
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">USA</span>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">edit_square</span>
                        </button>
                    </div>
                </section>

                {/* Gameplay Settings */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Gameplay
                    </h3>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
                        {/* Sound Effects */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-indigo-100 dark:bg-[#282e39] text-indigo-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">volume_up</span>
                                </div>
                                <span className="text-sm font-medium">Sound Effects</span>
                            </div>
                            <Toggle checked={soundEnabled} onChange={() => setSoundEnabled(!soundEnabled)} />
                        </div>

                        {/* Haptic Feedback */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-pink-100 dark:bg-[#282e39] text-pink-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">vibration</span>
                                </div>
                                <span className="text-sm font-medium">Haptic Feedback</span>
                            </div>
                            <Toggle checked={hapticEnabled} onChange={() => setHapticEnabled(!hapticEnabled)} />
                        </div>

                        {/* Move Validation */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-100 dark:bg-[#282e39] text-emerald-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                </div>
                                <span className="text-sm font-medium">Move Validation</span>
                            </div>
                            <Toggle checked={moveValidation} onChange={() => setMoveValidation(!moveValidation)} />
                        </div>

                        {/* Auto Queen */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-amber-100 dark:bg-[#282e39] text-amber-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">crown</span>
                                </div>
                                <span className="text-sm font-medium">Auto-Queen</span>
                            </div>
                            <Toggle checked={autoQueen} onChange={() => setAutoQueen(!autoQueen)} />
                        </div>
                    </div>
                </section>

                {/* Appearance Settings */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Appearance
                    </h3>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
                        {/* Board Theme */}
                        <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-blue-100 dark:bg-[#282e39] text-blue-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                                </div>
                                <span className="text-sm font-medium">Board Theme</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="text-sm">Walnut</span>
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </div>
                        </button>

                        {/* Piece Set */}
                        <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-purple-100 dark:bg-[#282e39] text-purple-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">extension</span>
                                </div>
                                <span className="text-sm font-medium">Piece Set</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="text-sm">Neo</span>
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </div>
                        </button>

                        {/* Animations */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-teal-100 dark:bg-[#282e39] text-teal-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">animation</span>
                                </div>
                                <span className="text-sm font-medium">Piece Animations</span>
                            </div>
                            <Toggle checked={pieceAnimations} onChange={() => setPieceAnimations(!pieceAnimations)} />
                        </div>
                    </div>
                </section>

                {/* General Settings */}
                <section>
                    <h3 className="px-2 pb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        General
                    </h3>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm">
                        {/* Notifications */}
                        <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-red-100 dark:bg-[#282e39] text-red-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                                </div>
                                <span className="text-sm font-medium">Notifications</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </div>
                        </button>

                        {/* Language */}
                        <button className="w-full flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-orange-100 dark:bg-[#282e39] text-orange-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">language</span>
                                </div>
                                <span className="text-sm font-medium">Language</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="text-sm">English</span>
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </div>
                        </button>

                        {/* Privacy Policy */}
                        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center size-9 rounded-lg bg-slate-100 dark:bg-[#282e39] text-slate-600 dark:text-white shrink-0">
                                    <span className="material-symbols-outlined text-[20px]">shield_lock</span>
                                </div>
                                <span className="text-sm font-medium">Privacy Policy</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <section className="mt-4 mb-8 flex flex-col gap-4">
                    <button className="w-full bg-surface-light dark:bg-surface-dark text-red-500 font-semibold py-4 rounded-2xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        Log Out
                    </button>
                    <div className="text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-600">Chess Master v2.4.1 (Build 890)</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Settings;
