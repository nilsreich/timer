import { useState, useEffect, useRef, useCallback } from 'react';

// Custom Hook für die Timer-Logik
const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false); // New state for time up message
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    }
  }, []);

  useEffect(() => {
    const audioElement = new Audio('/ring.mp3');
    audioElement.load();
    audioRef.current = audioElement;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive && hasStarted) {
      playAlarm();
      setIsActive(false);
      setHasStarted(false); // Allow new inputs
      setIsTimeUp(true); // Set time up flag
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, hasStarted, playAlarm]);

  const startPauseTimer = useCallback((initialSeconds?: number) => {
    if (!hasStarted && initialSeconds !== undefined && initialSeconds > 0) {
      setTimeLeft(initialSeconds);
      setIsActive(true);
      setHasStarted(true);
      setIsTimeUp(false); // Reset time up flag
    } else if (hasStarted) {
      setIsActive((prevIsActive) => !prevIsActive);
      if (isTimeUp) setIsTimeUp(false); // If resuming after time up, clear message
    }
  }, [hasStarted, isTimeUp]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setHasStarted(false);
    setTimeLeft(0);
    setIsTimeUp(false); // Reset time up flag
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { timeLeft, isActive, hasStarted, isTimeUp, startPauseTimer, resetTimer };
};

export default useTimer;
