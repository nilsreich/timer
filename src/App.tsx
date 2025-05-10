import React, { useState, useCallback } from 'react';
import Button from './components/Button';
import useTimer from "./hooks/useTimer";
import Picker from 'react-mobile-picker';

// Define types for picker values
interface PickerValue {
  hours: string;
  minutes: string;
  seconds: string;
  [key: string]: string; // Add index signature
}

// Haupt-App-Komponente
const App: React.FC = () => {
  const [pickerValue, setPickerValue] = useState<PickerValue>({
    hours: '0',
    minutes: '0',
    seconds: '5', // Standardmäßig 5 Sekunden zum Testen
  });

  const { timeLeft, isActive, hasStarted, isTimeUp, startPauseTimer, resetTimer } = useTimer();

  const pickerOptionGroups = {
    hours: Array.from({ length: 4 }, (_, i) => String(i)), // 0-4
    minutes: Array.from({ length: 59 }, (_, i) => String(i)), // 0-59
    seconds: Array.from({ length: 60 }, (_, i) => String(i)), // 0-59
  };

  // Konvertiert die Eingabewerte (Stunden, Minuten, Sekunden) in Gesamtsekunden
  const getTotalSeconds = useCallback(() => {
    const h = parseInt(pickerValue.hours, 10) || 0;
    const m = parseInt(pickerValue.minutes, 10) || 0;
    const s = parseInt(pickerValue.seconds, 10) || 0;
    return h * 3600 + m * 60 + s;
  }, [pickerValue]);

  // Handler für den Start/Pause-Button
  const handleStartPauseClick = () => {
    if (!hasStarted) {
      const totalSeconds = getTotalSeconds();
      if (totalSeconds > 0) {
        startPauseTimer(totalSeconds);
      }
    } else {
      startPauseTimer();
    }
  };

  // Handler für den Reset-Button
  const handleResetClick = () => {
    resetTimer();
    setPickerValue({ hours: '0', minutes: '0', seconds: '5' }); // Reset picker
  };

  // Formatiert die verbleibende Zeit in HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Berechnet den Fortschritt für den Kreisindikator
  const totalDuration = getTotalSeconds();
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  // SVG Kreisradius und Umfang
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-100 p-4 font-sans">
      <div className="sm:p-10 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 ">Timer</h1>

        {/* Zeitanzeige oder Eingabefelder */}
        {!hasStarted ? (
          <div className="flex flex-col items-center justify-center space-y-4 mb-8">
            <div className="text-center text-sm text-neutral-950-secondary dark:text-neutral-100-secondary grid grid-cols-3 gap-x-2 px-4 sm:px-8 w-full max-w-xs mx-auto">
              <span>Stunden</span>
              <span>Minuten</span>
              <span>Sekunden</span>
            </div>
            {/* Wrapper div to control picker width */}
            <div className="w-full max-w-xs mx-auto">
              <Picker value={pickerValue} onChange={setPickerValue} height={180} itemHeight={36} wheelMode="natural">
                {Object.keys(pickerOptionGroups).map(name => (
                  <Picker.Column key={name} name={name}>
                    {pickerOptionGroups[name as keyof typeof pickerOptionGroups].map(option => (
                      <Picker.Item key={option} value={option}>
                        {({ selected }) => (
                          <div style={{ 
                            color: selected ? (document.documentElement.classList.contains('dark') ? 'white' : 'black') : 'grey', 
                            fontSize: '2.125rem' // Example: text-lg equivalent (18px)
                          }}>
                            {option}
                          </div>
                        )}
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                ))}
              </Picker>
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col items-center justify-center mb-8">
            {/* Kreisindikator */}
            <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90" viewBox="0 0 240 240">
              <circle
                className="text-neutral-200 dark:text-neutral-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="120"
                cy="120"
              />
              <circle
                className="text-neutral-300 dark:text-neutral-700"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="120"
                cy="120"
                style={{ transition: 'stroke-dashoffset 0.5s linear' }}
              />
            </svg>
            {/* Textuelle Zeitanzeige im Kreis */}
            <div className="absolute flex flex-col items-center justify-center inset-0">
              <div className="text-4xl sm:text-4xl font-mono tracking-tight">
                {formatTime(timeLeft)}
              </div>
              {totalDuration > 0 && (
                <div className="text-sm text-neutral-950-secondary dark:text-neutral-100-secondary mt-1">
                  Verbleibend
                </div>
              )}
            </div>
          </div>
        )}

        {/* Steuerknöpfe */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleStartPauseClick}
            variant={isActive ? "secondary" : "primary"}
            size="large"
            className="w-32 sm:w-36"
            disabled={getTotalSeconds() === 0 && !hasStarted}
          >
            {isActive ? 'Pause' : (hasStarted ? 'Fortsetzen' : 'Start')}
          </Button>
          <Button
            onClick={handleResetClick}
            variant="danger"
            size="large"
            className="w-32 sm:w-36"
            disabled={!hasStarted && timeLeft === 0}
          >
            Reset
          </Button>
        </div>

        {/* Time's up message */}
        {isTimeUp && (
          <div className="text-center mt-6 text-2xl font-semibold text-green-400 dark:text-green-500">
            Time's up!
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
