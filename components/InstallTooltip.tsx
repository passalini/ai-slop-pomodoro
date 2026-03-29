import React, { useState, useEffect } from 'react';

interface InstallTooltipProps {
    onClose: () => void;
    onInstall: () => void;
    deferredPrompt: any; // BeforeInstallPromptEvent
    isActive: boolean;
    isFocus: boolean;
}

const InstallTooltip: React.FC<InstallTooltipProps> = ({ onClose, onInstall, deferredPrompt, isActive, isFocus }) => {
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if it's iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);
    }, []);

    const textColor = isActive
        ? 'text-white'
        : (isFocus ? 'text-focus-saturated' : 'text-break-saturated');

    const bgColor = isActive
        ? 'bg-white/10 backdrop-blur-md'
        : (isFocus ? 'bg-focus-accent' : 'bg-break-accent');

    const buttonBg = isActive
        ? 'bg-white text-focus-primary'
        : (isFocus ? 'bg-focus-saturated text-white' : 'bg-break-saturated text-white');

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`w-full max-w-[320px] p-6 rounded-[2rem] shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-300 ${bgColor} ${textColor}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center">
                        <span className="text-4xl">🍅</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold uppercase tracking-widest">Install Slop</h3>
                        <p className="text-xs opacity-70 leading-relaxed px-4">
                            Add Slop Pomodoro to your home screen for the best experience.
                        </p>
                    </div>

                    <div className="w-full mt-2">
                        {deferredPrompt ? (
                            <button
                                onClick={onInstall}
                                className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[12px] shadow-lg transition-transform active:scale-95 ${buttonBg}`}
                            >
                                Install Now
                            </button>
                        ) : isIOS ? (
                            <div className="flex flex-col gap-3 text-left bg-black/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px]">ios_share</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Step 1: Tap Share</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[18px]">add_box</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Step 2: Add to Home Screen</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                                Installation not supported on this browser.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallTooltip;
