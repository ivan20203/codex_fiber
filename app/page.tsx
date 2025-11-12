import dynamic from "next/dynamic";

const PortScene = dynamic(() => import("./components/PortScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-slate-200">
      Rendering harbor...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(41,91,158,0.45),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(4,15,27,0.65)_0%,_rgba(4,15,27,0.95)_65%,_rgba(4,15,27,1)_100%)]" />
      <section className="relative flex min-h-screen flex-col">
        <div className="relative flex h-[60vh] flex-1">
          <PortScene />
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-12 sm:p-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/75">
              Port of Los Angeles Visualization
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-100 drop-shadow-lg sm:text-5xl">
              The beating heart of transpacific trade rendered in realtime 3D.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-300">
              Explore a stylized but geographically faithful overview of the San Pedro Bay
              complex, highlighting San Pedro, Terminal Island, and the Port of Long Beach.
              Container stacks, breakwaters, and harbor traffic animate the busiest seaport in
              the Western Hemisphere.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-200/80">
            <div className="rounded-xl bg-slate-900/60 p-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-teal-300/70">Berths</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">43 miles of waterfront</p>
              <p className="text-sm text-slate-300/80">
                Breakwaters, dredged channels, and container yards reflect modern harbor
                engineering and terminal design.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-300/70">Throughput</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">~10M TEUs annually</p>
              <p className="text-sm text-slate-300/80">
                Animated vessels and cranes convey constant movement across San Pedro Bay
                terminals and channels.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900/60 p-4 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70">Landmarks</p>
              <p className="mt-2 text-lg font-semibold text-slate-100">Angels Gate &amp; Pier 400</p>
              <p className="text-sm text-slate-300/80">
                Key terminals, breakwaters, and neighborhoods are labeled for easy
                orientation as you orbit the harbor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
