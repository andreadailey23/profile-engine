import Link from "next/link";
import { entities } from "@/lib/engine/seed";

const TYPE_PILL: Record<string, string> = {
  person: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  brand: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  product: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  gamer: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  seller: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Profile engine</h1>
      <p className="text-sm text-zinc-400 mt-1">
        One entity system, every profile type — dev viewer. Click any profile to
        open it in the shell.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mt-8">
        {entities.map((e) => (
          <Link
            key={e.id}
            href={`/${e.handle}`}
            className="rounded-xl bg-[#11141d] border border-white/[0.07] p-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                {e.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{e.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-px rounded-full border ${TYPE_PILL[e.type]}`}
                  >
                    {e.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{e.tagline}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-xs text-zinc-600 mt-10">
        Seed data: <code>lib/engine/seed.ts</code> · Supabase schema:{" "}
        <code>sql/schema.sql</code> · Swap the seed for a Supabase client when
        ready to go live.
      </p>
    </main>
  );
}
