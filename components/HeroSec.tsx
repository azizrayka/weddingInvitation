'use client'
import Image from "next/image"
import Detailes from "./Detailes"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import Share from "./Share";

gsap.registerPlugin(ScrollTrigger);

const HeroSec = ({state}:{state:boolean}) => {
  const component = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state || !component.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(".names", 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "power1.out" }
      );

      tl.fromTo(".nzoul, .wedd",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 2, ease: "power1.out", stagger: 0.2 },
        "-=0.5"
      );

    }, component);

    return () => ctx.revert();
  }, [state]);

  return (
    <div className="hero" ref={component}>
      <div className="relative h-screen w-screen text-white overflow-hidden bg-[url(/am.jpg)] bg-cover bg-center flex justify-center items-center">
        <div className="flex flex-col items-center mt-10">
            <Image
              src="/names.png"
              alt="OF"
              width={400}
              height={70}
              className="absolute object-contain top-75 w-auto h-auto names"
              style={{ opacity: 0 }}
              priority
            />
        </div>

        {/* Nzoul Box */}
        <div className="absolute backdrop-blur-sm p-3 rounded-lg top-[55%] left-0 right-0 mx-auto w-fit flex flex-row gap-5 items-center text-black nzoul" style={{ opacity: 0 }}>
        <span className="w-32 text-center">Nzoul</span>
        <div className="h-[80px] w-1 border-b-[3px] border-black bg-black"></div>
        <span className="flex flex-col items-center">
        <span>May</span>
        <span className="text-2xl">07</span>
        <span>2027</span>
        </span>
        <div className="h-[80px] w-1 border-b-[3px] border-black bg-black"></div>
        <span className="w-32 text-center">At 9:00 PM</span>
        </div>

        {/* Wedding Box */}
        <div className="absolute backdrop-blur-sm p-3 rounded-lg top-[70%] left-0 right-0 mx-auto w-fit flex flex-row gap-5 items-center text-black wedd" style={{ opacity: 0 }}>
        <span className="w-32 text-center">Wedding</span>
        <div className="h-[80px] w-1 border-b-[3px] border-black bg-black"></div>
        <span className="flex flex-col items-center">
        <span>May</span>
        <span className="text-2xl">08</span>
        <span>2027</span>
        </span>
        <div className="h-[80px] w-1 border-b-[3px] border-black bg-black"></div>
        <span className="w-32 text-center">At 9:00 PM</span>
        </div>

      </div>
      <Detailes />
      <Share />
    </div>
  )
}

export default HeroSec