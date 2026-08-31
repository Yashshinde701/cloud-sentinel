import { AlertTriangle, Bell, Boxes, ChevronRight, CircleHelp, Cloud, Gauge, Menu, Radio, Settings2, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { getGetMonitoringOverviewQueryKey, getHealthCheckQueryKey, useGetMonitoringOverview, useHealthCheck } from '@workspace/api-client-react';

const navItems = [
  { href: '/', label: 'Overview', icon: Gauge },
  { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { href: '/services', label: 'Services', icon: Boxes },
];

export function SentinelShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), staleTime: 30000 } });
  const overview = useGetMonitoringOverview({ query: { queryKey: getGetMonitoringOverviewQueryKey(), staleTime: 30000 } });
  const isOnline = health.isSuccess && health.data?.status === 'ok';

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[246px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[78px] items-center justify-between border-b border-sidebar-border px-5">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3" data-testid="link-brand">
            <span className="relative grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_0_4px_hsl(var(--sidebar-primary)/.11)]">
              <Cloud className="size-[19px]" strokeWidth={2.5} />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent ring-2 ring-sidebar" />
            </span>
            <span className="leading-none"><strong className="block text-[15px] tracking-tight text-sidebar-accent-foreground">cloud sentinel</strong><small className="mt-1 block font-mono text-[9px] uppercase tracking-[.2em] text-sidebar-foreground/60">control plane</small></span>
          </Link>
          <button className="rounded-lg p-1 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X className="size-5" /></button>
        </div>

        <div className="px-3 pt-7">
          <div className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/40">Monitor</div>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`} className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${active ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground'}`}>
                <Icon className={`size-[17px] ${active ? 'text-sidebar-primary' : 'text-sidebar-foreground/45 group-hover:text-sidebar-primary'}`} strokeWidth={active ? 2.5 : 2} /><span>{label}</span>{label === 'Incidents' && <span className="ml-auto rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-[10px] text-red-300">{overview.data?.activeIncidents ?? '—'}</span>}
              </Link>;
            })}
          </nav>
        </div>
        <div className="mt-8 px-3">
          <div className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/40">Workspace</div>
          <div className="space-y-1">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground" data-testid="button-workspace-settings"><Settings2 className="size-[17px] text-sidebar-foreground/45" />Settings<ChevronRight className="ml-auto size-3.5 opacity-40" /></button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground" data-testid="button-help"><CircleHelp className="size-[17px] text-sidebar-foreground/45" />Help center<ChevronRight className="ml-auto size-3.5 opacity-40" /></button>
          </div>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3.5">
            <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.16em] text-sidebar-foreground/50">Sentinel core</span><Radio className="size-3.5 text-sidebar-primary signal-pulse" /></div>
            <div className="flex items-center gap-2 text-xs text-sidebar-accent-foreground"><span className={`size-1.5 rounded-full ${isOnline ? 'bg-sidebar-primary' : 'bg-accent'}`} />{health.isLoading ? 'Checking relay…' : isOnline ? 'All systems operational' : 'Relay unreachable'}</div>
            <div className="mt-2 font-mono text-[10px] text-sidebar-foreground/40">v2.4.1 · us-east-1</div>
          </div>
        </div>
      </aside>

      {mobileOpen && <button className="fixed inset-0 z-30 bg-sidebar/50 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu overlay" data-testid="button-menu-overlay" />}
      <div className="md:pl-[246px]">
        <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-border p-2 hover:bg-muted md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu className="size-5" /></button>
            <div className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground sm:flex"><span>workspace</span><ChevronRight className="size-3" /><span className="text-foreground">production</span><span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">live</span></div>
            <span className="font-mono text-[11px] text-muted-foreground sm:hidden">production / live</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications" data-testid="button-notifications"><Bell className="size-[18px]" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-accent" /></button>
            <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <div className="flex items-center gap-2.5 pl-1"><div className="grid size-8 place-items-center rounded-full bg-[hsl(203_72%_50%)] text-xs font-bold text-white">AR</div><span className="hidden text-xs font-semibold sm:block">Alex Rivera</span><ChevronRight className="hidden size-3.5 rotate-90 text-muted-foreground sm:block" /></div>
          </div>
        </header>
        <main className="cockpit-grid min-h-[calc(100dvh-78px)] px-5 py-7 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}