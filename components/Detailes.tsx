import Countdown from "./Countdown"
import Image from "next/image"
import Location from "./Location"
import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Detailes = () => {
    useGSAP(() => {
        const textEle = gsap.utils.toArray<HTMLElement>(".texte");
        textEle.forEach((text) => {
        gsap.to(
            text,
            {
            backgroundSize: "100% 100%",
            ease: "none",
            scrollTrigger: {
                trigger: text,
                start: "center 80%",
                end: "bottom 20%",
                scrub: true,
            },
            }
        );
        })
        gsap.to(".w1",{
            width: "80%",
            x:-20,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".animimg",
                start: "top center",
                end: "bottom 80%",
                scrub: true
            }
        });
        gsap.to(".w2",{
            y:-150,
            x:-130,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".animimg",
                start: "top center",
                end: "bottom 80%",
                scrub: true
            }
        });
        gsap.to(".w3",{
            y:-150,
            x:130,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".animimg",
                start: "top center",
                end: "bottom 80%",
                scrub: true
            }
        });
        gsap.to(".m1",{
            y:150,
            x:130,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".animimg",
                start: "top center",
                end: "bottom 80%",
                scrub: true
            }
        });
        gsap.to(".m2",{
            y:150,
            x:-130,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".animimg",
                start: "top center",
                end: "bottom 80%",
                scrub: true
            }
        });
        gsap.from(".taban",{
            y:-20,
            opacity: 0,
            duration:0.5,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".taban",
                start: "top bottom",
                end: "bottom 80%",
                scrub: true
            }
        });
        gsap.from(".taban2",{
            y:-20,
            opacity: 0,
            duration:0.5,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".taban2",
                start: "top bottom",
                end: "bottom 80%",
                scrub: true
            }
        });
    });
  return (
    <div className="h-fill bg-[#f5ece5] overflow-hidden">
        { /** Nzoul detailes */}
        <div className="flex flex-col gap-5 justify-center items-center py-10 nzould">
            <span className="text-3xl font-bold texte">Nzoul count down</span>
            <div className="taban"><Countdown targetDate="2027-05-07T21:00:00" /></div>
            <div className="relative h-[700px] animimg">
                <span className="text-3xl font-bold texte">Nzoul dress code</span>
                <Image
                    src="/w1.jpg"
                    alt="OF"
                    width={150}
                    height={70}
                    className="w1 absolute top-60 left-10 border-10 border-white rounded-lg"
                    priority
                />
                <Image
                    src="/w2.jpg"
                    alt="OF"
                    width={150}
                    height={70}
                    className="w2 absolute rotate-[-20deg] top-70 left-10 border-10 border-white rounded-lg"
                    priority
                />
                <Image
                    src="/w3.jpg"
                    alt="OF"
                    width={150}
                    height={70}
                    className="w3 absolute top-70 left-10 border-10 border-white rounded-lg"
                    priority
                />
                <Image
                    src="/m1.jpg"
                    alt="OF"
                    width={150}
                    height={70}
                    className="m1 absolute rotate-10 top-70 left-10 border-10 border-white rounded-lg"
                    priority
                />
                <Image
                    src="/m2.jpg"
                    alt="OF"
                    width={150}
                    height={70}
                    className="m2 absolute rotate-[-10deg] top-70 left-10 border-10 border-white rounded-lg"
                    priority
                />
            </div>
            <div className="flex flex-col gap-5 justify-center items-center">
                <span className="text-3xl font-bold texte">Nzoul location</span>
                <Location name={"MARASSIM"} address={"route Teniour km 9,5 chihia Sfax, BP 3041, Sakiet Ezzit"} mapsUrl={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.321174446886!2d10.7328927!3d34.82301650000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1301d35cdb3518f5%3A0xe43a5623eae16e25!2sMARASSIM!5e0!3m2!1sen!2stn!4v1782836973895!5m2!1sen!2stn"} />
            </div>
        </div>
        {/** Wedd detailes */}
        <div className="flex flex-col gap-5 justify-center items-center py-10">
            <span className="text-3xl font-bold texte">wedding count down</span>
            <div className="taban2"><Countdown targetDate="2027-05-08T21:00:00" /></div>
            <div className="flex flex-col gap-5 justify-center items-center mx-2">
                <span className="text-3xl font-bold texte">Wedding location</span>
                <Location name={"MARASSIM"} address={"route Teniour km 9,5 chihia Sfax, BP 3041, Sakiet Ezzit"} mapsUrl={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.321174446886!2d10.7328927!3d34.82301650000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1301d35cdb3518f5%3A0xe43a5623eae16e25!2sMARASSIM!5e0!3m2!1sen!2stn!4v1782836973895!5m2!1sen!2stn"} />
            </div>
        </div>
    </div>
  )
}

export default Detailes