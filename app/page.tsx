'use client'
import Image from "next/image"
import { useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import HeroSec from "@/components/HeroSec"

gsap.registerPlugin(ScrollTrigger)

const Page = () => {
  const [isOpen, setIsOpen] = useState(false)

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
      }
    })
  }

  return (
    <div
      className={`relative w-screen ${
        isOpen ? "overflow-y-auto" : "h-screen overflow-hidden"
      }`}
    >
      <HeroSec state={isOpen}/>

      {/* Left door */}
      <div className={`fixed mb-2 inset-0 z-20 ${isOpen ? "hidden" : ""}`}>
        <Image
          className="object-cover im1"
          src="/part1.png"
          alt=""
          fill
          priority
        />
      </div>

      {/* Right door */}
      <div className={`fixed inset-0 z-20 ${isOpen ? "hidden" : ""}`}>
        <Image
          className="object-cover im2"
          src="/stamp.png"
          alt=""
          fill
          priority
        />
      </div>

      {/* Stamp button */}
      <button
        onClick={handleOpen}
        className="fixed h-40 w-40 rounded-full z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn"
      />
    </div>
  )
}

export default Page