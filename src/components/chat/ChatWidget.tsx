'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSessionId, recordChatUsed } from '@/lib/engagement';

type Msg = { role: 'user' | 'assistant'; content: string };

const GREETING =
  "Hi! I'm the Vinoos assistant. Ask me about our custom tanks, acrylic work, cabinets, or how to get a quote.";
const SUGGESTIONS = ['Do you build custom tanks?', 'How do I get a quote?'];
const FALLBACK = 'Sorry, something went wrong. Please try again in a moment.';
// Once-per-session flag so the proactive nudge/pulse isn't shown on every page.
const NUDGE_KEY = 'chat:nudged';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [kbInset, setKbInset] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [pulse, setPulse] = useState(true);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const markSeen = () => {
    try {
      sessionStorage.setItem(NUDGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const openChat = () => {
    setOpen(true);
    setShowNudge(false);
    setPulse(false);
    markSeen();
  };

  const dismissNudge = () => {
    setShowNudge(false);
    setPulse(false);
    markSeen();
  };

  // Close and return focus to the launcher (the panel is non-modal, so we don't
  // trap focus — we just restore it so keyboard users aren't left adrift).
  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  // Proactively invite a click once per session, a few seconds after load.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(NUDGE_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (seen) {
      setPulse(false);
      return;
    }
    const t = setTimeout(() => setShowNudge(true), 3500);
    return () => clearTimeout(t);
  }, []);

  // Esc closes — capture phase + stopPropagation so it doesn't trip the app's
  // other global Escape handlers (e.g. the project lightbox).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  // Lift the fixed panel above the on-screen keyboard on mobile.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      setKbInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    onResize();
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    recordChatUsed();

    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-10),
          sessionId: getSessionId(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        (res.ok && typeof data.reply === 'string' && data.reply) ||
        (typeof data.error === 'string' && data.error) ||
        FALLBACK;
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: FALLBACK }]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Launcher + one-time nudge */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {showNudge && !open && (
          <div className="relative max-w-[16rem] animate-in fade-in slide-in-from-bottom-2 rounded-2xl rounded-br-md border bg-background px-4 py-3 shadow-xl">
            <button
              type="button"
              aria-label="Dismiss"
              onClick={dismissNudge}
              className="absolute -right-2 -top-2 rounded-full border bg-background p-1 text-muted-foreground shadow-md transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={openChat}
              className="block text-left text-sm leading-snug"
            >
              <span className="font-semibold text-foreground">
                Questions about your tank?
              </span>{' '}
              <span className="text-muted-foreground">
                Chat with us, we usually reply right away.
              </span>
            </button>
          </div>
        )}

        <Button
          ref={launcherRef}
          type="button"
          onClick={() => (open ? close() : openChat())}
          aria-label={open ? 'Close chat' : 'Open chat'}
          aria-expanded={open}
          className={cn(
            'relative h-14 rounded-full shadow-lg transition-all duration-200',
            open ? 'w-14 p-0' : 'gap-2 pl-5 pr-6'
          )}
        >
          {pulse && !open && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-primary/40" />
          )}
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              <span className="text-base font-semibold">Chat with us</span>
            </>
          )}
        </Button>
      </div>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Vinoos assistant"
          style={kbInset ? { bottom: kbInset + 16 } : undefined}
          className={cn(
            'fixed bottom-24 right-5 z-50 flex flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl',
            'h-[28rem] max-h-[calc(100dvh-7rem)] w-[calc(100vw-2.5rem)] sm:w-96'
          )}
        >
          <header className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Vinoos Assistant</span>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="rounded p-1 transition-colors hover:bg-white/15"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-atomic="false"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'flex',
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  role="status"
                  className="flex items-center gap-1.5 rounded-2xl bg-muted px-3 py-2.5 text-muted-foreground"
                >
                  <span className="sr-only">Assistant is typing</span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-primary/40 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 border-t p-3"
          >
            <textarea
              ref={inputRef}
              aria-label="Message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Type your message…"
              className="max-h-28 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
