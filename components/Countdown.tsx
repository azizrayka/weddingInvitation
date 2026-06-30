'use client'
import { useEffect, useState } from "react"

interface CountdownProps {
  targetDate: string // Format: "2027-05-07T21:00:00"
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000 * 30) // minutes only need to refresh occasionally

    return () => clearInterval(timer)
  }, [targetDate])

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
  ]

  return (
    <div className="flex gap-3 sm:gap-5 justify-center items-center">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-5">
          <div className="relative flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-800 border border-white/10 shadow-lg shadow-black/20 backdrop-blur-sm">
            <span className="text-3xl sm:text-4xl font-bold tabular-nums text-white tracking-tight">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold sm:text-xs uppercase tracking-widest text-zinc-400 mt-1">
              {unit.label}
            </span>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl sm:text-3xl font-bold text-zinc-500">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default Countdown