const principles = [
  {
    title: "Profile first",
    body: "Start with a clean public profile that can show identity, links, projects, picks, updates, offers, and proof.",
  },
  {
    title: "Useful for anyone",
    body: "A profile can be for a person, creator, author, gamer, parent, local vendor, product, project, or brand.",
  },
  {
    title: "One shape",
    body: "The same underlying profile engine can support Building Empires now and Andrea's other tools later.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 pb-9">
          <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
            about
          </div>
          <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Building Empires is the public home for profiles, tools, and useful context.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c8bdae] sm:text-lg">
            The MVP starts with a simple profile shell: who you are, what you care about,
            what you make, what you recommend, and where people can find you.
          </p>
        </section>

        <section className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="border-t border-white/10 pt-4">
              <h2 className="text-[24px] font-normal uppercase leading-tight text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#c8bdae]">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="py-8">
          <div className="mb-4 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
            v1 scope
          </div>
          <div className="divide-y divide-white/10 border-t border-white/10">
            {["Profiles", "Links", "Projects", "Best of", "Updates", "Offers"].map((item) => (
              <div key={item} className="py-3 text-sm font-normal text-[#d8cfc0]">
                {item}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
