// resources/js/hooks/use-timer.js
import { useState, useEffect, useCallback } from "react";

export function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(() => {
    setIsActive(true);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    setIsActive(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formattedTime = `0:${seconds < 10 ? `0${seconds}` : seconds}`;

  return { seconds, isActive, start, reset, formattedTime };
}