const lanes = [
  {
    title: "Digital picks",
    body: "Templates, tools, books, guides, downloads, creator products, and setup offers can come from profile recommendations.",
  },
  {
    title: "Local favorites",
    body: "The later marketplace can support trusted local recommendations without forcing everything to look like a traditional shop.",
  },
  {
    title: "Profile-led discovery",
    body: "The profile explains the person first; the marketplace grows from what they make, use, recommend, or sell.",
  },
];

export default function MarketplacePage() {
  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 pb-9">
          <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
            marketplace
          </div>
          <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Marketplace comes after the profile works.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c8bdae] sm:text-lg">
            V1 focuses on the profile. V2 can turn projects, picks, local favorites,
            digital goods, services, and setup offers into a marketplace layer.
          </p>
        </section>

        <section className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-3">
          {lanes.map((lane) => (
            <article key={lane.title} className="border-t border-white/10 pt-4">
              <h2 className="text-[24px] font-normal uppercase leading-tight text-white">
                {lane.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#c8bdae]">{lane.body}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-4 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
              possible categories
            </div>
            <div className="divide-y divide-white/10 border-t border-white/10">
              {["Tools", "Books", "Courses", "Templates", "Local vendors", "Shows", "Services"].map((item) => (
                <div key={item} className="py-3 text-sm font-normal text-[#d8cfc0]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <aside className="border-t border-[#ff6a00]/35 pt-4">
            <div className="text-[10px] font-normal uppercase tracking-[0.16em] text-[#ffb16b]">
              current decision
            </div>
            <h2 className="mt-2 text-xl font-normal text-white">Do profiles first.</h2>
            <p className="mt-2 text-sm leading-6 text-[#c8bdae]">
              The marketplace should be pulled from real profile behavior, not guessed too early.
            </p>
          </aside>
        </section>
      </section>
    </main>
  );
}
