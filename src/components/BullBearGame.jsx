import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";

const ROUND_SECONDS = 8;

function BullBearGame() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceAtGuess, setPriceAtGuess] = useState(null);
  const [guess, setGuess] = useState(null); // "UP" | "DOWN" | null
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState(null); // "WIN" | "LOSE" | null
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [rounds, setRounds] = useState(0);
  const timerRef = useRef(null);

  const fetchPrice = async () => {
    try {
      const res = await axiosInstance.get("/coins/bitcoin");
      return res.data.currentPrice;
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    fetchPrice().then(setCurrentPrice);
    const interval = setInterval(async () => {
      const price = await fetchPrice();
      if (price) setCurrentPrice(price);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startGuess = (direction) => {
    if (guess) return; // already guessing this round
    setGuess(direction);
    setPriceAtGuess(currentPrice);
    setResult(null);
    setCountdown(ROUND_SECONDS);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          resolveRound(direction);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resolveRound = async (direction) => {
    const finalPrice = await fetchPrice();
    setCurrentPrice(finalPrice);

    const wentUp = finalPrice > priceAtGuess;
    const wentDown = finalPrice < priceAtGuess;
    const correct = (direction === "UP" && wentUp) || (direction === "DOWN" && wentDown);

    setRounds((r) => r + 1);

    if (correct) {
      setResult("WIN");
      setScore((s) => s + 10);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else if (finalPrice === priceAtGuess) {
      setResult("DRAW");
    } else {
      setResult("LOSE");
      setStreak(0);
    }

    setTimeout(() => {
      setGuess(null);
      setPriceAtGuess(null);
      setResult(null);
    }, 3000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="card floating relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-500/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 text-purple-300">
            🎮 BULL OR BEAR
          </span>
          <div className="flex gap-4 text-xs text-gray-400">
            <span>Score: <span className="text-white font-semibold">{score}</span></span>
            <span>Streak: <span className="text-orange-400 font-semibold">🔥{streak}</span></span>
            <span>Best: <span className="text-green-400 font-semibold">{bestStreak}</span></span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-1 text-center">
          Will Bitcoin go UP or DOWN?
        </h3>
        <p className="text-xs text-gray-500 text-center mb-5">
          Predict the next {ROUND_SECONDS} seconds. Real live price. No risk.
        </p>

        <div className="text-center mb-5">
          <p className="text-xs text-gray-500">
            {guess ? "Price when you guessed" : "Current Price"}
          </p>
          <p className="text-3xl font-bold text-white">
            ${(guess ? priceAtGuess : currentPrice)?.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          {guess && (
            <p className="text-sm text-gray-400 mt-1">
              Live now: ${currentPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {!guess ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => startGuess("UP")}
              className="py-4 rounded-xl text-base font-bold text-white bg-green-600/80 shadow-md shadow-green-600/30 hover:shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all"
            >
              📈 UP
            </button>
            <button
              onClick={() => startGuess("DOWN")}
              className="py-4 rounded-xl text-base font-bold text-white bg-red-600/80 shadow-md shadow-red-600/30 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all"
            >
              📉 DOWN
            </button>
          </div>
        ) : (
          <div className="text-center">
            {result === null ? (
              <div>
                <p className="text-sm text-gray-400 mb-2">
                  You guessed <span className="text-white font-semibold">{guess}</span> —
                  revealing in...
                </p>
                <p className="text-4xl font-bold gradient-text">{countdown}</p>
              </div>
            ) : result === "WIN" ? (
              <p className="text-2xl font-bold text-green-400 animate-fade-in-up">
                🎉 Correct! +10 points
              </p>
            ) : result === "DRAW" ? (
              <p className="text-xl font-bold text-gray-400 animate-fade-in-up">
                🤝 No change — round voided
              </p>
            ) : (
              <p className="text-2xl font-bold text-red-400 animate-fade-in-up">
                ❌ Wrong! Streak reset
              </p>
            )}
          </div>
        )}

        {rounds > 0 && (
          <p className="text-center text-xs text-gray-600 mt-4">
            {rounds} round{rounds !== 1 ? "s" : ""} played this session
          </p>
        )}
      </div>
    </div>
  );
}

export default BullBearGame;