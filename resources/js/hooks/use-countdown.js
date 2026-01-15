import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialSeconds = 0) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) return;

        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    const startCountdown = useCallback((sec) => {
        setSeconds(sec);
    }, []);

    const formatTime = () => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return { seconds, startCountdown, formatTime };
}
