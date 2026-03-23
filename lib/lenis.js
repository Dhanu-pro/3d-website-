import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function createLenis() {
  const lenis = new Lenis({
    lerp: 0.11,
    duration: 0.95,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.92,
  })

  const raf = (time) => {
    lenis.raf(time * 1000)
  }

  const onScroll = () => {
    ScrollTrigger.update()
  }

  lenis.on("scroll", onScroll)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return {
    lenis,
    destroy() {
      lenis.off("scroll", onScroll)
      gsap.ticker.remove(raf)
      lenis.destroy()
    },
  }
}
