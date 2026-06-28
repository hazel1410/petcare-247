import { useState } from 'react';
import { useApp } from '../app';
import { COMMUNITY_POSTS } from '../mock';
import { Avatar } from '../ui';

const TYPE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  Lost:   { label: 'Lost',   color: '#fff',     bg: 'var(--coral)' },
  Found:  { label: 'Found',  color: '#fff',     bg: 'var(--leaf)'  },
  Advice: { label: 'Advice', color: '#fff',     bg: 'var(--primary)' },
};

export function CommunityScreen() {
  const _a = useApp();
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);

  function handlePost() {
    if (!draft.trim()) return;
    setDraft('');
    setPending(true);
    setTimeout(() => setPending(false), 4000);
  }

  return (
    <div className="screen fade">
      <div className="pad stack">
        <div className="stack-sm">
          <h1 className="h1">Community</h1>
          <p className="body muted">Local lost &amp; found and friendly advice.</p>
        </div>

        <p className="disclaimer">
          Every post is reviewed before it goes live — kindness only.
        </p>

        <div className="card stack-sm">
          <input
            className="input"
            placeholder="Share something with local pet parents…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handlePost()}
          />
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-sm btn-primary"
              onClick={handlePost}
              disabled={!draft.trim()}
            >
              Post
            </button>
            {pending && (
              <span className="pill pill-amber" style={{ fontSize: 12 }}>
                Pending review ✓
              </span>
            )}
          </div>
        </div>

        {COMMUNITY_POSTS.map(post => {
          const typeStyle = TYPE_STYLE[post.type] ?? TYPE_STYLE.Advice;
          return (
            <div className="card stack-sm" key={post.id}>
              <div className="row-between" style={{ alignItems: 'flex-start' }}>
                <div className="row" style={{ gap: 10, alignItems: 'center' }}>
                  <Avatar initials={post.initials} size={36} />
                  <div>
                    <p className="strong" style={{ lineHeight: 1.2 }}>{post.author}</p>
                    <p className="tiny muted">{post.time}</p>
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    background: typeStyle.bg,
                    color: typeStyle.color,
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {typeStyle.label}
                </span>
              </div>

              <p className="body">{post.text}</p>

              <div className="row" style={{ gap: 16 }}>
                <span className="small muted">♡ {post.likes}</span>
                <span className="small muted">💬 {post.replies}</span>
              </div>
            </div>
          );
        })}

        <div style={{ height: 96 }} />
      </div>
    </div>
  );
}
