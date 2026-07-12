import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const recommended = [
  {
    title: "Neural Frontiers",
    meta: "Tech • 45m",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5u-3Z34PBm-sAbOMTL9E4H7GhlIUOUuAgMvXbkHYzk0XyOrgbdMMt_dHICnHhsehvwbKpsV4rKHFCCJtf0deoJ_9DGNPay1Bo3iJBu-xCgseyRMFyWNyNEo9q68il1EuxNAhHS_isPWwcvJ22EM2MfXJ5prBvQ2PVTwk3uVuF0T87zUrJTM_I9cVezwTZ1V__aeLd-tTkOUU_eM7PnJGX4cNUg2gg6ML6cQpNItSCZafB2O4pVDao",
  },
  {
    title: "Midnight Stories",
    meta: "Culture • 1h 12m",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLjoQihFtfyJAs_72e29V1yq10b1WArrNToK1tcgV0pG4a7X6OcMq0HKaklffBWOPEGOCoLs3VcsvYm-Qd8qEsqC4e2Nq2TABEzJFcRZ3kURQ_36CaCZWL-Dax4oP9wnVuj7X6rsKeSo8zhZCMQWcawdIg0owXb89P3HODeK5dvp49Z-VpuYw27lyoWivtusxrpIE6maCMMn42CaYhSxu9lZWA4pFhKi72yMxpsT50wngzLIeH8Me2",
  },
  {
    title: "The Daily Pulse",
    meta: "News • 22m",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj9wA-AKVpLRpDRgo1cWWNgFluqX1e1wdN0tRWO33JXX9TmA_FtEnvVqK8g3p_bvVuQScHHN2HTkWIghVM0V4ldXHtVayGcvEU7dGbxGbtYivLTJWU4SzynICOnO285QJGSXKFDB4NV24CnE3hTdrUTdW2roygQREiQUqR3pewdSjrUUUvd1P-w15hHnL_Fp0KcwG4QQYUmMnqr98qgBpH9m-h1OCzmU-8hSEqfq_fuxRvXRf1sL-L",
  },
];

function HomePage() {
  return (
    <AppShell>
      <div className="space-y-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Good evening, Alex</h1>
          <p className="text-on-surface-variant opacity-80">Ready for your nightly session?</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">Live Now</h2>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              On Air
            </span>
          </div>
          <Link
            to="/live"
            className="group relative block h-64 w-full overflow-hidden rounded-2xl glass-card transition-transform active:scale-[0.98]"
          >
            <img
              alt="Studio background"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjA2dzlDChlXIvhOJIMc5Pe4d-lxSB-v7a4zerDdtex7gUECGIl0hyFUVT-OJUBUV4mzMkJg81dL4KFyOgeLMDyCNC66sQiWdQWR6LkdN889Xq4ko5IJNKMsfWSOQ19fSlO_shboRYSopgjbqSMKHZaVugbL6iJ7p41i-qfX6tvpP9lOfpmXYtNzMxeDhiaC6PQyPIvGUKvzmwufOEiemkY-s-e8CxVX-BE02A5HOsYtEsClegXYsu"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5">
              <div className="space-y-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-4 items-end gap-1">
                    <span className="waveform-bar" style={{ animationDelay: "0.1s" }} />
                    <span className="waveform-bar" style={{ animationDelay: "0.3s" }} />
                    <span className="waveform-bar" style={{ animationDelay: "0.2s" }} />
                    <span className="waveform-bar" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    98.4 Urban Beats
                  </span>
                </div>
                <h3 className="text-2xl font-bold leading-tight">After Hours Mix</h3>
                <p className="text-sm text-on-surface-variant opacity-80">
                  with DJ Luna • 42k listening
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_20px_rgba(26,75,255,0.4)] transition-transform active:scale-90">
                <Icon name="play_arrow" filled className="text-[32px]" />
              </div>
            </div>
          </Link>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recommended</h2>
            <Link to="/discover" className="text-xs font-semibold uppercase tracking-widest text-primary">
              See all
            </Link>
          </div>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 hide-scrollbar">
            {recommended.map((p) => (
              <div key={p.title} className="group w-40 min-w-[10rem] cursor-pointer space-y-2">
                <div className="relative aspect-square overflow-hidden rounded-xl glass-card">
                  <img
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={p.img}
                  />
                  <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
                      <Icon name="play_arrow" filled className="text-base" />
                    </div>
                  </div>
                </div>
                <h4 className="line-clamp-1 font-semibold group-hover:text-primary">{p.title}</h4>
                <p className="line-clamp-1 text-xs text-on-surface-variant opacity-70">{p.meta}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Recent News</h2>
          <Link
            to="/connect"
            className="group flex cursor-pointer items-center gap-4 rounded-2xl p-3 glass-card transition-transform active:scale-[0.99]"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                alt="AI Audio"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA6VEhIb1IHnzPfcNF3C0HdhcbLmLbDgszCD4DI9Z6WPoTbYMgGy-lJiI2D9i4NarT3H9H7mHI3MF_cYWA9840T9F7A79Z7Xlis2F8Zcf8JQHEmDq2jwjTEobekpw_C22hFqZWipUoTVyZA_dpYTZE5Xe7B1sM8GMRmfhQrbvmqZ_wa2roYTZUt4x3TrIKOnYYT6_SUzGEin3xUfnCb5OQ2UrjkalMWFGvBPj-I2guGPraYirA2nNC"
              />
            </div>
            <div className="flex-grow space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary">
                World News • 2h ago
              </span>
              <h4 className="font-bold leading-tight group-hover:text-primary">
                The Future of AI Audio: What's Next for Podcasting?
              </h4>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant opacity-70">
                <Icon name="schedule" className="text-[14px]" />
                <span>4 min read</span>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
