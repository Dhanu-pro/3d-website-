import Scene from "../components/Scene"

export default function Home() {
  return (
    <main className="page-shell" id="scroll-root">
      <Scene />
      <div className="story-shell">
        <section className="story-panel hero-panel">
          <p className="eyebrow">VA-04 motion study</p>
          <h1>Lift into focus with a locked propeller and guided camera move.</h1>
          <p className="lede">
            Scroll starts with a measured reveal, holding the aircraft and propeller together under one parent group
            while the camera frames the nose through a dedicated focus target.
          </p>
        </section>

        <section className="story-panel mid-panel section-2">
          <p className="eyebrow">Orbit beat</p>
          <h2>The aircraft banks and rotates as one assembly through the middle act.</h2>
          <p className="body-copy">
            The GSAP timeline only animates the master group and camera, so the propeller housing stays attached to
            the airframe while the internal rotor keeps spinning locally.
          </p>
        </section>

        <section className="story-panel final-panel section-3">
          <p className="eyebrow">Departure beat</p>
          <h2>The final section widens the frame and lets the vehicle glide out cinematically.</h2>
          <p className="body-copy">
            The last scroll beat pulls the camera back, opens the scene, and keeps the aircraft locked on its focus
            path as the departure move settles into place.
          </p>
        </section>
      </div>
    </main>
  )
}
