import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-full bg-[#050505] text-[#f7f0df]">
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <section className="border-b border-white/10 pb-9">
          <div className="mb-5 text-[11px] font-normal uppercase tracking-[0.16em] text-[#ff6a00]">
            log in
          </div>
          <h1 className="max-w-4xl text-[46px] font-normal uppercase leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Account access comes next.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#c8bdae] sm:text-lg">
            For the MVP, Andrea&apos;s profile is available from the account menu.
            Auth can attach to this route when profiles become editable.
          </p>
        </section>

        <section className="py-8">
          <Link
            href="/andrea-dailey"
            className="inline-flex min-h-10 items-center rounded-md border border-[#ff6a00]/35 px-4 text-sm font-normal text-[#ffb16b] transition hover:border-[#ff6a00]"
          >
            Open Andrea&apos;s profile
          </Link>
        </section>
      </section>
    </main>
  );
}
