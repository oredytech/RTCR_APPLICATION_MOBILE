import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Podcasts — SoundStream" },
      { name: "description", content: "Browse trending podcasts, categories, and fresh finds curated for you." },
    ],
  }),
  component: DiscoverPage,
});

const categories = [
  {
    label: "True Crime",
    span: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPkM2oYmvOihJUzvdx3ZEC1mdvShZem41w48gc9NANFY7patg43LwbWAEJIb17pluxqDs-TQ2kKIAuBFReMIjzuiDakYrT3hA_ePFoz4l1ZJpYw38MPVc0vSQhJZThdr2xpIvzWxR1zshgrmO_wPKkHeVACRquSbfGnYVTBvm9N-AJD11hIy_w2JpHr26MfKULszyLGcRvMBMxnizZwxylnsY7j863hO7o86sVK-aqDfKC2HUdhg2x",
  },
  {
    label: "Tech",
    span: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_OLKX-I-qVD9xXpZnnIb32ygUgySVfV-oncWWtHwGDYLgoMkvIGENoqJuPxaRP2MkTlMNuvauybdL0sG0D_M3R-QCS11F_fpgP4xFjYSqbDOuyNUEjHLAwydw2ROoxVNn2gBFnQWA6rkLOTyfxwbWoWQRW2dDbt2JdJNC3rJErqODwnBYxpU5hdBN1nJu1LYR3HftmPXH86gkkSoiH_rmwdww0W07udTowGV000q9BVc06BOHE9TO",
  },
  {
    label: "Music Culture",
    span: 2,
    wide: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuNS1mJGgn2qDXNdUecAXfUKTfhzP8ApuerbACUl6bhbCBGbYwBHWxFK82op5sIs-g0o3GlSKHvhXbvu4I2qi1u1pbhbl-A8f2Fr-oQLNkKLha0XVL9FMu_kfTC62_QEq_fL2jUSQF3xJKSm7swgy33XHTswVPSDviq9nbTikxJz2zBvQSf5k2HffDrPx-mOUwaP-OPkKNS9p8PL-KpNVdCpog8g24QU5Ao6mB0QroowxdnldpZvs0",
  },
  {
    label: "Comedy",
    span: 1,
    icon: "sentiment_very_satisfied",
  },
  {
    label: "History",
    span: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4oBo7OfMweiERnuqsBY2zTN9h-UxhlTzZNjy3nupydio2dIcwQtHv6VIH3JhexqOgpNvd_Dm2PYTHI3tlzsD5wbj9pvMX6QzxPQMaLlvkMLV3ZtiP6WazXG6NxtAS0Gd5GUlf_xMK_FPIg4xprei0HWXMmdl9jZMQJK81YZYFjJlkyIUEs8xMAGXDIqBIuEg_IID3bUOMu2vubJ8HokxbWpXi2w0oJB6628gP88otN-sHSQbgTZar",
  },
];

const trending = [
  {
    title: "The Daily Pulse",
    author: "Global News Network",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj9wA-AKVpLRpDRgo1cWWNgFluqX1e1wdN0tRWO33JXX9TmA_FtEnvVqK8g3p_bvVuQScHHN2HTkWIghVM0V4ldXHtVayGcvEU7dGbxGbtYivLTJWU4SzynICOnO285QJGSXKFDB4NV24CnE3hTdrUTdW2roygQREiQUqR3pewdSjrUUUvd1P-w15hHnL_Fp0KcwG4QQYUmMnqr98qgBpH9m-h1OCzmU-8hSEqfq_fuxRvXRf1sL-L",
  },
  {
    title: "Mind Over Matter",
    author: "Dr. Aris Thorne",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU-deMCYuLJePXw3IqXFkqJnI3kJxd2CxrzsXPL28--ZUZ6UTa0HYcG90LJwdk-fef3WriZNet8NGjpDr-av_PmGXwCoGTn7-iPUC0ZvW5sj_gOdD8W_oEskcOp0vMRIkQqMN8kNvOKipr70_k3jXqcJZQV4bcV6PsE4tGqvQxBPkcLZMnFw-qGly86PEzY-s2yq9RsizOLJJH-gXfsKetGdoj54Ft8IkqAamzUt7kTk3nEktmqF9b",
  },
  {
    title: "Late Night Tales",
    author: "Storyhouse FM",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAucXo5N75JxBv7qLU5RsxD4p90wygUpWdxRQfke2YQYEWXnbvkIiiYfeZ42NCG8Xckk--Uj4dvAV4AG3tA_SeEMpxk698R3IDAZ9abQaYlou0SlSgIF3kTlE8w-UO1DfLAVNtezRSIoF1W7KWTVfQFOI9VZgcaaT6sJZSjEX9OsCd83bO9Rk9fj5i0wyIhrq919TejVtggW8yY8n9DCj0kQJeddUDrrhyEgdlITRW1MhD1OMJ6GuZn",
  },
];

const fresh = [
  {
    title: "The Stoic Developer",
    meta: "Episode 42 • 45 min",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIWSDmT1zT5X0dSLPPeXkmPxLVNU1OeArK-aWpKsUtA7TjQ0d9ZgxXhC3HLYHguvfejORPpwDd5lTk1y9pgU56egUjlkRTOj5779G9eYuioNt1La7QZyjUT02m7hHj058M1yrI7P56U46fKYVIFa12UgmIuoLaMqLht4cMGrcnmIQZRL2bsn1tFDxiq-KDt21GscRThWYHG08P6w_VAOxjOMCpd143S_TZFM2G7Vc0fa6o9pnHl3V_",
  },
  {
    title: "Morning Coffee Chats",
    meta: "New Arrival • 32 min",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAygoqYq-qFitgdmvN0DY50yq9eOWwxtCSjhKi-608_jr_VLh7CaVHa-xBVKJ_bGgxWGJ-aw-tF6rz39dGpDuS_dz6aTY-Ym1n4AG9cW5K0394zEDk_cLudQjxjxjebLJiZPa9GOgsOhvefQKev2S25l5odXT5I2zKU1VozRxbJ4ZFMDIgiKd5hnKdDJmiIZnbQL9gy7e0ZhZvpnC3X9VNuvpbstwzkFVj4AkqFGYREWif6pPD7ImRj",
  },
  {
    title: "Vinyl Archives",
    meta: "Series • 12 Episodes",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSXqQ0aFoRsghDLi7QBArjORTYvYDxizgT_NG_AczobyZQqnyt5-tppNHo7AvrZn_4W-AFvP3TtfHJYvu-4DCTFQtYFlYAa-PEPNC_DSJND5WwK65CVUkgW4osyIxXDRJedX2x3v7N0w3EswUhTJ_TH4sAb7rkoN-hXYNBWh1TzAbVNR_ZA4V3LBRojA5rEKJYc88xGg3ftyt1-IO01g9-WLrw94eLAuYJigMTp4YKIZIQN2qIZ-3h",
  },
];

function DiscoverPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search podcasts, hosts, or topics"
            className="h-14 w-full rounded-2xl border-none bg-surface-container-high pl-12 pr-4 text-on-surface outline-none transition-all placeholder:text-outline focus:ring-2 focus:ring-primary"
          />
        </div>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">Categories</h2>
            <button className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => (
              <div
                key={c.label}
                className={`group relative overflow-hidden rounded-2xl transition-transform active:scale-95 ${
                  c.wide ? "col-span-2 h-32" : "h-44"
                } ${c.icon ? "border border-primary/20 bg-primary/10" : ""}`}
              >
                {c.img && (
                  <>
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <img
                      alt={c.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={c.img}
                    />
                  </>
                )}
                {c.icon && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-25 transition-opacity group-hover:opacity-40">
                    <Icon name={c.icon} className="text-[80px] text-primary" />
                  </div>
                )}
                <div
                  className={`absolute z-20 ${
                    c.wide ? "inset-y-0 left-4 flex items-center" : "bottom-3 left-3"
                  }`}
                >
                  <p className={`text-2xl font-bold ${c.icon ? "text-on-surface" : "text-white"}`}>
                    {c.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <button className="text-xs font-semibold uppercase tracking-widest text-primary hover:opacity-80">
              View chart
            </button>
          </div>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 hide-scrollbar">
            {trending.map((t) => (
              <div key={t.title} className="group w-40 min-w-[10rem] flex-shrink-0">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-xl border border-white/5 shadow-lg">
                  <img alt={t.title} className="h-full w-full object-cover" src={t.img} />
                  <div className="absolute right-2 top-2 flex h-8 w-8 translate-y-4 items-center justify-center rounded-full bg-primary opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Icon name="play_arrow" filled className="text-on-primary text-base" />
                  </div>
                </div>
                <p className="line-clamp-1 font-bold">{t.title}</p>
                <p className="line-clamp-1 text-xs text-on-surface-variant">{t.author}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Fresh Finds</h2>
          <div className="space-y-2">
            {fresh.map((f) => (
              <div
                key={f.title}
                className="group flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-all hover:bg-surface-container active:scale-[0.98]"
              >
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                  <img alt={f.title} className="h-full w-full object-cover" src={f.img} />
                </div>
                <div className="min-w-0 flex-grow">
                  <h4 className="truncate font-semibold">{f.title}</h4>
                  <p className="text-xs text-on-surface-variant">{f.meta}</p>
                </div>
                <button
                  className="text-on-surface-variant transition-colors group-hover:text-primary"
                  aria-label={`Add ${f.title}`}
                >
                  <Icon name="add_circle" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
