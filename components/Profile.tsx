import React from 'react';

interface ProfileProps {
    onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col antialiased selection:bg-primary/30">
            {/* Top App Bar */}
            <div className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center px-4 py-3 justify-between">
                    <div className="flex-1">
                        <button
                            onClick={onBack}
                            className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </button>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-none">Profile</h2>
                    <div className="flex-1 flex justify-end">
                        <button className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[24px]">settings</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Scrollable Content */}
            <main className="flex-1 overflow-y-auto pb-20">
                {/* Profile Header */}
                <div className="flex flex-col items-center pt-6 pb-6 px-4">
                    <div className="relative mb-4">
                        <div
                            className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-surface-light dark:border-surface-dark shadow-xl"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqrsFeBFh2pJrk5uBO2pYZXlj1rOqt3cVwum2luSksPAJmqhaBQWYJ74x4V2yMoo5cwK3sboe1pcD6rARwc2Peh_1Z9w3eITRbX1LLXH2J3UMLOGXbOLXOtx6K9aYzjN2X8rgyiRLCaz5A_aZ3Du3In3JC96jPUdoSC-epAYtDOVBOot2krcWS2LxouQ67LUlQt2w-AGVfiO-4Vm2roGGulFpICz4w5AdcXggIcm7SKFApKDtLcKexQ0s4cqpm3o7KPzK0BPQ6MLg')" }}
                        />
                        {/* Country Flag Badge */}
                        <div className="absolute bottom-1 right-1 bg-surface-light dark:bg-surface-dark p-1.5 rounded-full shadow-sm">
                            <img
                                alt="USA Flag"
                                className="w-6 h-4 object-cover rounded-[2px]"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrMXrzAs5tLMCcUuFUWqS5hig8F1ylwuPstPOXYEivdzNJtWmtdwkEz48ozGUb_j8Dknh-xZg90va0jOAlkF31G9XCMtlTm8dlEeuXIK0Artv97273mO5dMk7HkPabpIDEiZ8xVJzPYDhkniew-donc22SsMWrHgKmcyQL6poLTzSpoKOKzM97wDpG2Crq71hELUeQ1PUA9MBgxStyH0DEQUC-IsCZTf7tKoa2t1X7AReIivxKEnCWSSq9iwsQN_2MxubIYzbD8dw"
                            />
                        </div>
                    </div>
                    <div className="text-center mb-5">
                        <h1 className="text-2xl font-bold tracking-tight mb-1">GrandmasterFlash</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online Now
                        </p>
                    </div>
                    <button className="w-full max-w-[200px] h-10 rounded-lg bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Edit Profile
                    </button>
                </div>

                {/* Segmented Control (Game Modes) */}
                <div className="px-4 mb-6">
                    <div className="flex p-1 bg-gray-200 dark:bg-surface-dark rounded-xl">
                        <button className="flex-1 py-2 px-3 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white">Bullet</button>
                        <button className="flex-1 py-2 px-3 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-lg transition-colors hover:text-slate-900 dark:hover:text-white">Blitz</button>
                        <button className="flex-1 py-2 px-3 text-sm font-bold bg-white dark:bg-[#2A303C] text-slate-900 dark:text-white shadow-sm rounded-lg">Rapid</button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="px-4 mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-3 pl-1">Performance</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Current Rating */}
                        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-symbols-outlined text-4xl">show_chart</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Rating</p>
                            <div>
                                <p className="text-3xl font-extrabold text-primary tracking-tight">1,450</p>
                                <p className="text-xs text-green-500 font-bold mt-1 flex items-center">
                                    <span className="material-symbols-outlined text-[14px] mr-0.5">arrow_drop_up</span> +12 this week
                                </p>
                            </div>
                        </div>
                        {/* Best Win */}
                        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-32">
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Best Win</p>
                            <div>
                                <p className="text-2xl font-bold tracking-tight">2,100</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 uppercase font-semibold tracking-wide badge inline-flex items-center gap-1">
                                    <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-1.5 py-0.5 rounded text-[10px]">IM</span> Opponent
                                </p>
                            </div>
                        </div>
                        {/* Win Rate */}
                        <div className="col-span-2 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Win Rate</p>
                                    <p className="text-2xl font-bold mt-1">52% <span className="text-sm font-normal text-slate-400 ml-1">/ 542 Games</span></p>
                                </div>
                                <div className="flex gap-3 text-xs font-medium">
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Win</div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Loss</div>
                                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span> Draw</div>
                                </div>
                            </div>
                            {/* Visual Bar Chart */}
                            <div className="h-3 w-full flex rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[52%]"></div>
                                <div className="h-full bg-slate-300 dark:bg-slate-700 w-[8%] border-l border-r border-background-dark/20"></div>
                                <div className="h-full bg-slate-600 dark:bg-slate-600 flex-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Matches History */}
                <div className="px-4">
                    <div className="flex items-center justify-between mb-3 pl-1">
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Recent Matches</h3>
                        <a className="text-primary text-sm font-bold hover:underline cursor-pointer">View All</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        {/* Match Item: Win */}
                        <button className="group w-full flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 rounded-lg bg-cover bg-center bg-gray-700"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIvnrLYSTV7DbpoNO8B3Ma22YDPMFmHC4JCabpRPboEM0UUKlWnmInoxWav3BW7z3WuUDTI7AViQlx__Wr4SZPiPpVE_wtMFAA-FsmXTJp5nSmzTd-8T1QAcS5G6Hg3Sf3nkaIBQt2awRNZBEl2lE2fL22Pv_JKKYk1lJmHdIG2bJy9vmFD4RHZrZ4INB4c1PSVni2Z5e0uzXsVyD8UdOrInDmVX3o1vZqeNWUkm6pf9IvSzUSZIebIwOb3FgUfmXGDb_2HrNXWQM')" }}
                                />
                                <div className="absolute -bottom-1 -right-1 bg-background-light dark:bg-background-dark rounded-full p-[2px]">
                                    <div className="bg-primary w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold">W</div>
                                </div>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">PlayerTwo</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Rapid • 10 min ago</p>
                            </div>
                            <div className="text-right">
                                <p className="text-green-500 font-bold text-sm">+8</p>
                                <p className="text-xs text-slate-400">1458</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg group-hover:text-primary transition-colors">chevron_right</span>
                        </button>
                        {/* Match Item: Loss */}
                        <button className="group w-full flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 rounded-lg bg-cover bg-center bg-gray-700"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDl1wSCWNBocOT1mfvgmNrDZ-pv8fKo0O78ZqAKtVZhuFPPC1LXW8Xe1c_KfFEm5xoGeKPq90n-Ohr_S0zbYfhjbnC90gRybJDD6jYGFSf1kfYmi9YwM3q2Ao_2wNYDuw_IgjrgH_m2YMsWE5Z9rxGPgyu0l63lIjcwul0_xf_w4j9TDEAmUvgtVQ9tYittsyPkKgN0xFQstazbHpPQ8ne9tXDE6csRJh8Isr0uLGfAN0UPCb5Oo6urTmNhO458fVs9mNsKfkjdzxM')" }}
                                />
                                <div className="absolute -bottom-1 -right-1 bg-background-light dark:bg-background-dark rounded-full p-[2px]">
                                    <div className="bg-slate-500 w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold">L</div>
                                </div>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">ChessBot</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Rapid • 1 hour ago</p>
                            </div>
                            <div className="text-right">
                                <p className="text-red-500 font-bold text-sm">-5</p>
                                <p className="text-xs text-slate-400">1450</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg group-hover:text-primary transition-colors">chevron_right</span>
                        </button>
                        {/* Match Item: Win */}
                        <button className="group w-full flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 rounded-lg bg-cover bg-center bg-gray-700"
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBl5xltx30c2Pm7yQ59hhgrWX8Z-PA0pkyzJaGCbMm2R8XtTFSl9FQgZS4BeaFesYIdlgAtGuLag_YvJYpDKBy1RtY-f664ZA9bJ9vdpIaTEVXvB8V5tvmA-EzkR-nDP4FySQsA3XTEYhEacue6sDxy_8q70l32sJBFgmbciCeEHZn2KXOzAxToMBL3MLXhucHEEMcPIeOpEZCJJyWOWJzMmBJ3Ypzi9USNVfRCkrdvzTZPmFWlAc9PrKWy0_FNZRC9-NpHbWKtUz8')" }}
                                />
                                <div className="absolute -bottom-1 -right-1 bg-background-light dark:bg-background-dark rounded-full p-[2px]">
                                    <div className="bg-primary w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold">W</div>
                                </div>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">Sarah_Gambit</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Rapid • 2 hours ago</p>
                            </div>
                            <div className="text-right">
                                <p className="text-green-500 font-bold text-sm">+12</p>
                                <p className="text-xs text-slate-400">1455</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg group-hover:text-primary transition-colors">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="h-10"></div>
            </main>

            {/* Bottom Navigation */}
            <div className="sticky bottom-0 z-50 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-around items-center h-16 px-2">
                    <button
                        onClick={onBack}
                        className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-primary"
                    >
                        <span className="material-symbols-outlined">home</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-primary">
                        <span className="material-symbols-outlined">extension</span>
                    </button>
                    <button className="flex flex-col items-center justify-center w-full h-full text-primary">
                        <span className="material-symbols-outlined fill-current">person</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
