import React from 'react';

interface MainMenuProps {
    onStartAIMatch: () => void;
    onPlayOnline?: () => void;
    onJoinFriend?: () => void;
    onSolvePuzzles?: () => void;
    onTournaments?: () => void;
    onProfile?: () => void;
    onSettings?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
    onStartAIMatch,
    onPlayOnline,
    onJoinFriend,
    onSolvePuzzles,
    onTournaments,
    onProfile,
    onSettings,
}) => {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-[#101622] font-display text-white selection:bg-[#135bec] selection:text-white">
            {/* Background Decor */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-10"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 50% 0%, #135bec 0%, transparent 40%)',
                }}
            ></div>

            {/* Header */}
            <div className="relative z-10 flex items-center bg-[#101622]/95 backdrop-blur-sm p-4 pt-6 justify-between sticky top-0 border-b border-[#282e39]">
                <div className="text-white flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#135bec]/20">
                    <span
                        className="material-symbols-outlined text-[#135bec]"
                        style={{ fontSize: '28px' }}
                    >
                        chess
                    </span>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Chess Master
                </h2>
                <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-[#282e39] pr-3 pl-2 py-1">
                        <span
                            className="material-symbols-outlined text-[#facc15]"
                            style={{ fontSize: '20px' }}
                        >
                            extension
                        </span>
                        <p className="text-white text-xs font-bold leading-normal tracking-[0.015em]">
                            Daily
                        </p>
                    </div>
                </div>
            </div>

            {/* Welcome Headline */}
            <div className="relative z-10 px-4 pt-6 pb-2">
                <h2 className="text-white tracking-tight text-[28px] font-bold leading-tight">
                    Welcome back,
                    <br />
                    <span className="text-[#135bec]">Grandmaster</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[#9da6b9] text-sm">
                        trending_up
                    </span>
                    <p className="text-[#9da6b9] text-sm font-medium">
                        Current Rating: 1450 (Rapid)
                    </p>
                </div>
            </div>

            {/* Main Actions Stack */}
            <div className="relative z-10 flex flex-col gap-4 p-4">
                {/* Hero Card: Play AI */}
                <div className="group relative overflow-hidden rounded-xl bg-[#1c1f27] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-transform active:scale-[0.98]">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#101622]/80 via-transparent to-transparent z-10 pointer-events-none"></div>
                    <div className="flex flex-col">
                        <div
                            className="h-32 w-full bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWBNriXDjJ_66npyQMxeeO9RQEQ2edzHSFNe_AMviYGOEujat4CpV4L9YPn08RMhayRAMLY209Kie36ZzNlsF3bYuznnV5kZudTtbNNeoW9BsDAYdXGAdDHzQ5ci1VYxknZrbYX0BsI0Gy_SRsPYgmg_95UNUWwZtY5q4erdgUphfLFVNeEnvuUuw4bweYuk-xLTLpQjnZqCzvPuS-kQwzT6mT7njHgRDbnvp0apykcx8UjHz7CqBFVEdkxVe91VtVssoZSePj7vM")',
                            }}
                        ></div>
                        <div className="flex flex-col gap-3 p-4 relative z-20 -mt-10 bg-gradient-to-t from-[#1c1f27] via-[#1c1f27] to-transparent pt-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white text-xl font-bold leading-tight">
                                        Play Against AI
                                    </h3>
                                    <p className="text-[#9da6b9] text-sm mt-1">
                                        Challenge Stockfish levels 1-10
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-white bg-[#135bec]/20 p-2 rounded-full">
                                    smart_toy
                                </span>
                            </div>
                            <button
                                onClick={onStartAIMatch}
                                className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-[#135bec] py-3 text-white text-sm font-bold shadow-lg shadow-[#135bec]/30 hover:bg-[#1e6af7] transition-colors"
                            >
                                <span>Start Match</span>
                                <span className="material-symbols-outlined text-sm">
                                    play_arrow
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card: Play Online */}
                <div
                    onClick={onPlayOnline}
                    className="flex items-center justify-between gap-4 rounded-xl bg-[#1c1f27] p-4 shadow-md border border-[#282e39] active:bg-[#282e39] transition-colors cursor-pointer hover:border-[#135bec]/50"
                >
                    <div className="flex flex-col gap-1 flex-[2]">
                        <p className="text-white text-base font-bold leading-tight">
                            Play Online
                        </p>
                        <p className="text-[#9da6b9] text-sm font-normal leading-normal">
                            Ranked &amp; Casual Matches
                        </p>
                    </div>
                    <div
                        className="h-16 w-24 rounded-lg bg-cover bg-center shrink-0 border border-white/10"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkvHEqDANBzs2r3XtpTNN0t-XTkRPxfAHmgixY3o-_ZzzH_jmv2Gpwdm9cnASE1niqAopim-M3poCJbfAiP08fpEG4GtqiMqFbPhWu3uh8liQUR7ncVR95fCzosGzRqHZRvFytr7p6XjKsCKX2SyuVopXrRXwH_pagkbuALuTkSmFkvZeJWYD190s5FKFXTDO6wwANGsJh_qedbn90_iIyoa-bnIphm2Npd9OtilrDVOWm7sJVbqaPI-Ga1rentvSd0C-QYUV0agA")',
                        }}
                    ></div>
                </div>
            </div>

            {/* Secondary Actions Grid */}
            <div className="relative z-10 px-4 pb-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-3 text-opacity-60">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {/* Button: Join Game */}
                    <button
                        onClick={onJoinFriend}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1c1f27] p-4 text-center border border-[#282e39] hover:border-[#135bec]/50 transition-colors"
                    >
                        <div className="rounded-full bg-[#282e39] p-3 text-white">
                            <span className="material-symbols-outlined">group_add</span>
                        </div>
                        <span className="text-sm font-medium text-white">Join Friend</span>
                    </button>

                    {/* Button: Puzzles */}
                    <button
                        onClick={onSolvePuzzles}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#1c1f27] p-4 text-center border border-[#282e39] hover:border-[#135bec]/50 transition-colors"
                    >
                        <div className="rounded-full bg-[#282e39] p-3 text-white">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                            Solve Puzzles
                        </span>
                    </button>

                    {/* Button: Tournaments */}
                    <button
                        onClick={onTournaments}
                        className="col-span-2 flex items-center justify-between px-5 py-3 rounded-xl bg-[#1c1f27] border border-[#282e39] hover:border-[#135bec]/50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#facc15]">
                                emoji_events
                            </span>
                            <div className="text-left">
                                <span className="block text-sm font-medium text-white">
                                    Tournaments
                                </span>
                                <span className="block text-xs text-[#9da6b9]">
                                    Next: Blitz Cup in 20m
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-[#9da6b9] text-sm">
                            arrow_forward_ios
                        </span>
                    </button>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1f27] border-t border-[#282e39] px-6 pb-6 pt-3">
                <div className="flex items-center justify-between">
                    {/* Nav Item: Home (Active) */}
                    <button className="flex flex-col items-center gap-1 text-[#135bec]">
                        <span className="material-symbols-outlined fill-current">home</span>
                        <span className="text-[10px] font-medium">Home</span>
                    </button>

                    {/* Nav Item: Friends */}
                    <button className="flex flex-col items-center gap-1 text-[#9da6b9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">groups</span>
                        <span className="text-[10px] font-medium">Friends</span>
                    </button>

                    {/* Nav Item: Profile */}
                    <button
                        onClick={onProfile}
                        className="flex flex-col items-center gap-1 text-[#9da6b9] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-medium">Profile</span>
                    </button>

                    {/* Nav Item: Settings */}
                    <button
                        onClick={onSettings}
                        className="flex flex-col items-center gap-1 text-[#9da6b9] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-[10px] font-medium">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
