'use client'
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HeroSec from "@/components/HeroSec"

gsap.registerPlugin(ScrollTrigger)

const Page = () => {
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/audio.mp3")
    audioRef.current.preload = "auto"
  }, [])

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback failed:", err)
      })
    }
  }, [isOpen])

  function handleOpen(): void {
    if (isOpen) return

    gsap.to(".im1", {
      xPercent: 100,
      duration: 4,
      ease: "power2.inOut",
    })

    gsap.to(".im2", {
      xPercent: -100,
      duration: 4,
      ease: "power2.inOut",
      onComplete: () => setIsOpen(true),
    })

    gsap.to(".btn", {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        gsap.set(".btn", { display: "none" })
      },
    })
  }

  return (
    // 1. Changed w-screen to w-full to prevent horizontal overflow on iOS
    // 2. Changed h-screen to h-dvh to match the actual visible viewport height
    <div
      className={`relative w-full ${
        isOpen ? "overflow-y-auto" : "h-dvh overflow-hidden"
      }`}
    >
      <HeroSec state={isOpen} />

      {/* Left door */}
      {/* 3. Changed inset-0 to top-0 inset-x-0 h-dvh. 
             Using bottom: 0 (from inset-0) on fixed elements causes gaps on iOS. 
             Explicitly setting the height to 100dvh ensures it perfectly covers the screen. */}
      <div className={`fixed top-0 inset-x-0 h-dvh z-[21] ${isOpen ? "hidden" : ""}`}>
        <Image className="object-cover im1" src="/cardhright.png" alt="" fill priority />
      </div>

      {/* Right door */}
      <div className={`fixed top-0 inset-x-0 h-dvh z-[20] ${isOpen ? "hidden" : ""}`}>
        <Image className="object-cover im2" src="/cardhleftbg.png" alt="" fill priority />
      </div>

      {/* Stamp button */}
      <button
        onClick={handleOpen}
        className="fixed h-30 w-30 rounded-full z-30 top-1/2 left-[30%] transform -translate-x-1/2 -translate-y-1/2 btn border-none outline-none bg-[url(/stamp.png)] bg-cover bg-center cursor-pointer"
        style={{
          WebkitTapHighlightColor: "transparent",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  )
}

export default Page