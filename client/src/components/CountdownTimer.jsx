import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(deadline) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="text-2xl font-black text-white">{timeLeft[interval].toString().padStart(2, '0')}</span>
        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
      <Clock size={20} className="text-amber-400 mr-2" />
      {timerComponents.length ? (
        <div className="flex gap-4">
          {timerComponents.reduce((acc, curr, i) => {
             if (i === 0) return [curr];
             return [...acc, <div key={`sep-${i}`} className="text-slate-700 font-bold self-start mt-1">:</div>, curr];
          }, [])}
        </div>
      ) : (
        <span className="text-sm font-bold text-red-400 uppercase tracking-widest">Campaign Ended</span>
      )}
    </div>
  );
};

export default CountdownTimer;
