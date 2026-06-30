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
    audioRef.current = new Audio("/audo.mp3")
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
    <div
      className={`relative w-screen ${
        isOpen ? "overflow-y-auto" : "h-screen overflow-hidden"
      }`}
    >
      <HeroSec state={isOpen} />

      {/* Left door */}
      <div className={`fixed mb-2 inset-0 z-20 ${isOpen ? "hidden" : ""}`}>
        <Image className="object-cover im1" src="/part1.png" alt="" fill priority />
      </div>

      {/* Right door */}
      <div className={`fixed inset-0 z-20 ${isOpen ? "hidden" : ""}`}>
        <Image className="object-cover im2" src="/stamp.png" alt="" fill priority />
      </div>

      {/* Stamp button */}
      <button
        onClick={handleOpen}
        className="fixed h-40 w-40 rounded-full z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn border-none outline-none bg-transparent"
        style={{
          WebkitTapHighlightColor: "transparent",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  )
}

export default Page