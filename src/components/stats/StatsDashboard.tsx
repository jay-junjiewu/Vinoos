'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';

const KEY_STORAGE = 'stats:key';

type Stats = any;

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold text-primary">{value}</div>
      </CardContent>
    </Card>
  );
}

function CountList({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {rows.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground">{r.name}</span>
                <span className="font-medium text-muted-foreground">
                  {r.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function fmtTime(ts: string) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export function StatsDashboard() {
  const [key, setKey] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedVisit, setExpandedVisit] = useState<Set<number>>(new Set());
  const [expandedIp, setExpandedIp] = useState<Set<string>>(new Set());

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stats', { headers: { 'x-stats-key': k } });
      if (res.status === 401) {
        sessionStorage.removeItem(KEY_STORAGE);
        setKey(null);
        setData(null);
        setError('Incorrect key.');
        return;
      }
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setData(await res.json());
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load stats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE);
    if (stored) {
      setKey(stored);
      load(stored);
    }
  }, [load]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const k = input.trim();
    if (!k) return;
    sessionStorage.setItem(KEY_STORAGE, k);
    setKey(k);
    setInput('');
    load(k);
  };

  // ── gate ──
  if (!key) {
    return (
      <div className="container mx-auto max-w-sm px-4 py-24">
        <Card>
          <CardHeader>
            <CardTitle>Private stats</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input
                type="password"
                placeholder="Access key"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full">
                Unlock
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── dashboard ──
  const visits: any[] = data?.recent ?? [];
  const chat = data?.chat ?? {};
  const transcripts: any[] = chat.messages ?? [];

  // Group transcripts by IP for display.
  const byIp = new Map<string, any[]>();
  for (const m of transcripts) {
    const ip = m.ip || 'unknown';
    if (!byIp.has(ip)) byIp.set(ip, []);
    byIp.get(ip)!.push(m);
  }

  const toggle = <T,>(set: Set<T>, value: T, update: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    update(next);
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Analytics</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => load(key)}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!data && loading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      {data && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <StatCard label="Total visits" value={data.total ?? 0} />
            <StatCard label="Today" value={data.today ?? 0} />
            <StatCard label="Unique IPs (recent)" value={data.uniqueIps ?? 0} />
            <StatCard
              label="Chat msgs today"
              value={chat.messagesToday ?? 0}
            />
            <StatCard label="Chat msgs (recent)" value={chat.messagesTotal ?? 0} />
          </div>

          {/* Breakdowns */}
          <div className="grid gap-4 md:grid-cols-2">
            <CountList title="Top countries (recent)" rows={data.byCountry ?? []} />
            <CountList title="Devices (recent)" rows={data.byDevice ?? []} />
          </div>

          {/* Recent visits (expandable) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Recent visits ({visits.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Time</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((v) => {
                    const open = expandedVisit.has(v.id);
                    return (
                      <Fragment key={v.id}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() =>
                            toggle(expandedVisit, v.id, setExpandedVisit)
                          }
                        >
                          <TableCell>
                            {open ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {fmtTime(v.created_at)}
                          </TableCell>
                          <TableCell>{v.country ?? '—'}</TableCell>
                          <TableCell>{v.city ?? '—'}</TableCell>
                          <TableCell className="max-w-[12rem] truncate">
                            {v.path ?? '—'}
                          </TableCell>
                          <TableCell>{v.device_type ?? '—'}</TableCell>
                          <TableCell>{v.browser ?? '—'}</TableCell>
                        </TableRow>
                        {open && (
                          <TableRow>
                            <TableCell colSpan={7} className="bg-muted/30">
                              <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs md:grid-cols-3">
                                {Object.entries(v).map(([field, value]) => (
                                  <div key={field} className="flex gap-2">
                                    <dt className="font-medium text-muted-foreground">
                                      {field}:
                                    </dt>
                                    <dd className="break-all">
                                      {value === null || value === ''
                                        ? '—'
                                        : String(value)}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                  {visits.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        No visits yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Chat usage by IP/day */}
          {(chat.recent ?? []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chat usage (per IP / day)</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chat.recent.map((u: any, i: number) => (
                      <TableRow key={`${u.ip}-${u.day}-${i}`}>
                        <TableCell>{u.ip}</TableCell>
                        <TableCell>{u.day}</TableCell>
                        <TableCell className="text-right">{u.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Chat transcripts grouped by IP */}
          {byIp.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Chat transcripts ({transcripts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...byIp.entries()].map(([ip, msgs]) => {
                  const open = expandedIp.has(ip);
                  const where = [msgs[0]?.city, msgs[0]?.country]
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <div key={ip} className="rounded-lg border">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                        onClick={() => toggle(expandedIp, ip, setExpandedIp)}
                      >
                        <span className="flex items-center gap-2">
                          {open ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <span className="font-medium">{ip}</span>
                          {where && (
                            <span className="text-xs text-muted-foreground">
                              {where}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msgs.length} msg{msgs.length === 1 ? '' : 's'}
                        </span>
                      </button>
                      {open && (
                        <div className="space-y-3 border-t px-4 py-3">
                          {msgs.map((m: any) => (
                            <div key={m.id} className="text-sm">
                              <div className="text-xs text-muted-foreground">
                                {fmtTime(m.created_at)}
                                {m.timezone ? ` · ${m.timezone}` : ''}
                              </div>
                              <p className="mt-1">
                                <span className="font-medium">Q: </span>
                                {m.question}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">
                                  A:{' '}
                                </span>
                                {m.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
