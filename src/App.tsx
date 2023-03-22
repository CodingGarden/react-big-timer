import { useCallback, useEffect, useState } from 'react';

const params = Object.fromEntries(new URLSearchParams(window.location.search));

const safeParseNumber = (value: string) => {
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

const now = new Date().getTime();
let seconds = safeParseNumber(params.seconds);
let fontSize = '20vw';

if (params.time) {
  const parts = params.time.match(/(\d+)h(\d+)m(\d+)s/);
  if (parts) {
    const [, hours, minutes, s] = parts;
    params.hours = hours;
    params.minutes = minutes;
    seconds = safeParseNumber(s);
  }
}

if (params.hours) {
  seconds += safeParseNumber(params.hours) * 60 * 60;
}

if (params.minutes) {
  seconds += safeParseNumber(params.minutes) * 60;
}

let color = params.color ? `#${params.color}` : 'rgb(214 211 209)';
let backgroundColor = params.bgcolor ? `#${params.bgcolor}` : '';

const endTime = now + seconds * 1000;
const secondsLeft = Math.floor((endTime - now) / 1000);

const padNumber = (value: number) => value.toString().padStart(2, '0');

let numParts = 3;
const getParts = (value: number) => {
  const hours = Math.floor(value / 60 / 60);
  const minutes = Math.floor((value / 60) % 60);
  const seconds = Math.floor(value % 60);
  if (numParts === 3) return [hours, minutes, seconds];
  if (numParts === 2) return [minutes, seconds];
  return [seconds];
};
const parts = getParts(secondsLeft);
if (parts[0] === 0 && parts[1] === 0) {
  fontSize = '40vw';
  numParts = 1;
} else if (parts[0] === 0) {
  fontSize = '30vw';
  numParts = 2;
}

function App() {
  const [secondsLeft, setSecondsLeft] = useState('');
  useEffect(() => {
    let intervalId = setInterval(() => {
      const left = Math.floor((endTime - new Date().getTime()) / 1000);
      const parts = getParts(left);
      const timeString = parts.map(padNumber).join(':');
      setSecondsLeft(timeString);
      document.title = timeString;
      if (left <= 0) {
        const timesUP = getParts(0).map(padNumber).join(':');
        setSecondsLeft(timesUP);
        document.title = timesUP;
        return clearInterval(intervalId);
      }
    }, 200);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center font-['GlacialIndifferenceBold']">
      <p
        style={{
          color,
          fontSize,
          backgroundColor,
        }}
        className="rounded-[100px] bg-slate-900 px-10 text-center"
      >
        {secondsLeft}
      </p>
    </div>
  );
}

export default App;
