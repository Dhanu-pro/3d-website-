import Scene from "../components/Scene"

export default function Home() {
  return (
    <main className="page-shell" id="scroll-root">
      <Scene />
      <div className="story-shell">
        <section className="story-panel hero-panel">
          <p className="eyebrow">VA-04 motion study</p>
          <h1>Lift, rotate, and settle into frame.</h1>
          <p className="lede">
            A scroll-driven 3D landing page with a manually aligned propeller attachment, smooth Lenis scrolling,
            and GSAP timing that keeps every moving part locked together.
          </p>
        </section>

        <section className="story-panel mid-panel">
          <p className="eyebrow">Mid scroll</p>
          <h2>The body rotates while the attached propeller stays in place.</h2>
          <p className="body-copy">
            The parent group carries the entire assembly, so the propeller never drifts out of alignment when the
            model shifts on the x, y, and z axes.
          </p>
        </section>

        <section className="story-panel final-panel">
          <p className="eyebrow">Final pass</p>
          <h2>The vehicle glides away toward the landing and takeoff platforms.</h2>
          <p className="body-copy">
            The scene finishes with a slight camera pullback, extra platform objects in the environment, and a clean
            production-ready exit.
          </p>
        </section>
      </div>
    </main>
  )
}
