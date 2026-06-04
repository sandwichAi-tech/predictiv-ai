import { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AdminMessage {
  id: string;
  user_id: string;
  user_email: string;
  message: string;
  created_at: string;
}

interface Props {
  currentUserId: string;
  currentUserEmail: string;
}

const STORAGE_KEY_LAST_SEEN = 'admin_chat_last_seen';

export default function AdminChat({ currentUserId, currentUserEmail }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  const getLastSeen = () => Number(localStorage.getItem(STORAGE_KEY_LAST_SEEN) || '0');

  const markAllSeen = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_LAST_SEEN, String(Date.now()));
    setUnread(0);
    setPulse(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('admin_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(500);
      if (cancelled || !data) return;
      setMessages(data);
      const lastSeen = getLastSeen();
      const count = data.filter(
        (m) => m.user_id !== currentUserId && new Date(m.created_at).getTime() > lastSeen,
      ).length;
      setUnread(count);
    })();
    return () => { cancelled = true; };
  }, [currentUserId]);

  useEffect(() => {
    const channel = supabase
      .channel('admin_messages_feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_messages' },
        (payload) => {
          const msg = payload.new as AdminMessage;
          setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
          if (msg.user_id !== currentUserId) {
            if (openRef.current) markAllSeen();
            else { setUnread((u) => u + 1); setPulse(true); }
          }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUserId, markAllSeen]);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => { if (open) markAllSeen(); }, [open, markAllSeen]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('admin-chat:open', handler);
    return () => window.removeEventListener('admin-chat:open', handler);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    const { error } = await supabase.from('admin_messages').insert({
      user_id: currentUserId,
      user_email: currentUserEmail,
      message: text,
    });
    setSending(false);
    if (!error) setInput('');
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    return sameDay
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const senderLabel = (email: string) => email.split('@')[0];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105',
            pulse && 'animate-pulse ring-4 ring-primary/40',
          )}
          aria-label="Open admin team chat"
        >
          <MessageCircle className="h-6 w-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-mono font-bold text-destructive-foreground shadow ring-2 ring-background animate-pulse">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[60] flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col rounded-lg border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-semibold">Admin Team Chat</div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Private · 30-day history
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-center text-xs text-muted-foreground">
                No messages yet. Say hi 👋
              </div>
            )}
            {messages.map((m) => {
              const mine = m.user_id === currentUserId;
              return (
                <div key={m.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
                  <div className="mb-0.5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <span>{mine ? 'You' : senderLabel(m.user_email)}</span>
                    <span>·</span>
                    <span>{formatTime(m.created_at)}</span>
                  </div>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words',
                      mine ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                    )}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 border-t border-border p-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the team…"
              maxLength={2000}
              className="flex-1"
              disabled={sending}
            />
            <Button type="submit" size="icon" disabled={sending || !input.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
