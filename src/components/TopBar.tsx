import { Icon } from "./Icon";

export function TopBar({
  title = "SoundStream",
  showAvatar = false,
}: {
  title?: string;
  showAvatar?: boolean;
}) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-surface/80 px-5 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon name="graphic_eq" filled />
        </div>
        <span className="font-headline text-xl font-extrabold tracking-tight text-primary">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center text-on-surface-variant transition-transform hover:text-on-surface active:scale-95"
        >
          <Icon name="search" />
        </button>
        {showAvatar && (
          <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/20">
            <img
              alt="You"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9YlrKLx8yD27NzLGwvOi_u8MibK_vE-1tZhYiPLo0JOyk_FEZbykiuXTZfUgihYNv86-ettakD9B_EFuabCdyd4cJDBAwtpK-WO7h8_bWIkH-IN7EvBf3ejGir7MRDpSwP8Laffb7DNjjIx2YcFcCAf-ZC8ObZWXIe7auQD9v5ErAqUU20x-iBRF4IzQ3h7CG3PXCNQI_0k26g5TvCFuZsOfadKdMBL-lwgnq0hgIfaNPzFtchdte"
            />
          </div>
        )}
      </div>
    </header>
  );
}
