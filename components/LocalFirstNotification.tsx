import React, { useState, useEffect } from 'react';

interface LocalFirstNotificationProps {
    onClose: () => void;
    isActive: boolean;
    isFocus: boolean;
}

const LocalFirstNotification: React.FC<LocalFirstNotificationProps> = ({ onClose, isActive, isFocus }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 1500);
        const dismissTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
        }, 11500); // 1.5s delay + 5s visible

        return () => {
            clearTimeout(showTimer);
            clearTimeout(dismissTimer);
        };
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 500);
    };

    const textColor = isActive
        ? 'text-white'
        : (isFocus ? 'text-focus-saturated' : 'text-break-saturated');

    const bgColor = isActive
        ? 'bg-white/10 backdrop-blur-md'
        : (isFocus ? 'bg-focus-accent' : 'bg-break-accent');

    return (
        <div
            className={`fixed top-12 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-[320px] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
                }`}
        >
            <div className={`flex items-center gap-3 p-3 px-4 rounded-2xl shadow-lg border border-white/20 ${bgColor} ${textColor}`}>
                <span className="material-symbols-outlined text-[20px] shrink-0">cloud_off</span>
                <div className="flex-grow flex flex-col">
                    <span className="text-[11px] font-bold leading-tight uppercase tracking-wider">Local-First</span>
                    <span className="text-[10px] leading-tight opacity-80">Your data stays on your device and works offline.</span>
                </div>
                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors shrink-0"
                >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
            </div>
        </div>
    );
};

export default LocalFirstNotification;
