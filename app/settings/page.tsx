import Link from "next/link";

const settingsGroups = [
  {
    title: "Profile",
    items: ["Name and handle", "Profile photo", "Vibe", "Theme", "Accent color"],
  },
  {
    title: "Sharing",
    items: ["Copy full profile link", "Public profile view", "Future profile slices"],
  },
  {
    title: "Account",
    items: ["Login", "Notifications", "Billing later", "Marketplace preferences later"],
  },
];

export default function SettingsPage() {
  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 pb-9">
          <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
            settings
          </div>
          <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Profile and account settings.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c8bdae] sm:text-lg">
            The MVP keeps settings simple: edit the core profile, copy/share the
            profile link, and manage appearance from one consistent account area.
          </p>
        </section>

        <section className="grid gap-6 border-b border-white/10 py-8 md:grid-cols-3">
          {settingsGroups.map((group) => (
            <article key={group.title} className="border-t border-white/10 pt-4">
              <h2 className="text-[24px] font-normal uppercase leading-tight text-white">
                {group.title}
              </h2>
              <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
                {group.items.map((item) => (
                  <div key={item} className="py-3 text-sm font-normal text-[#d8cfc0]">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="py-8">
          <Link
            href="/andrea-dailey#basics"
            className="inline-flex min-h-10 items-center rounded-md border border-[#ff6a00]/35 px-4 text-sm font-normal text-[#ffb16b] transition hover:border-[#ff6a00]"
          >
            Open profile settings
          </Link>
        </section>
      </section>
    </main>
  );
}
