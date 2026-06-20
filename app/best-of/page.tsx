import { houses, items } from "@/lib/engine/seed";

const bestOfItems = items.filter(
  (item) =>
    item.itemType === "pick" ||
    item.tags.includes("picks") ||
    item.tags.includes("recommendations"),
);

function ownerName(houseId: string) {
  return houses.find((house) => house.id === houseId)?.name ?? "Profile";
}

export default function BestOfPage() {
  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 pb-9">
          <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
            best of
          </div>
          <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Picks, favorites, and recommendations from real profiles.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c8bdae] sm:text-lg">
            This starts simple: a cross-profile place for tools, shows, local vendors,
            books, products, places, and anything someone wants to stand behind.
          </p>
        </section>

        <section className="py-8">
          <div className="mb-4 text-[10px] font-normal uppercase tracking-[0.18em] text-[#8f8577]">
            current picks
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {bestOfItems.map((item) => (
              <a
                key={item.id}
                href={item.url ?? "#"}
                target={item.url?.startsWith("http") ? "_blank" : undefined}
                rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
                className="rounded-md border border-white/10 bg-white/[0.035] p-5 transition hover:border-[#ff6a00]/45"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] font-normal uppercase tracking-[0.14em] text-[#ff6a00]">
                    {ownerName(item.houseId)}
                  </span>
                  <span className="border border-white/10 px-2 py-1 text-[9px] font-normal uppercase tracking-[0.14em] text-[#8f8577]">
                    {item.itemType}
                  </span>
                </div>
                <h2 className="text-xl font-normal text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#b8ad9f]">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-normal uppercase tracking-[0.12em] text-[#8f8577]">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {bestOfItems.length === 0 && (
            <div className="border-t border-white/10 py-8 text-sm leading-6 text-[#c8bdae]">
              No picks are published yet.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
