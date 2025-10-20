import React, { useState, useEffect } from "react";

// DevForum - Single-file React prototype
// - Tailwind CSS assumed available in the host project
// - Uses localStorage for lightweight persistence (auth, posts, settings)
// - Gradient and color palette based on user's palette
// - Cursive font for titles (Dancing Script) and Inter for body
// How to use: drop this component into a create-react-app / Next.js page with Tailwind enabled.

const GRADIENT = "bg-gradient-to-r from-[#5c4b8b] via-[#7b6f95] to-[#e8c3f9]";

const defaultData = {
  users: [
    { id: 1, name: "Admin", username: "admin", role: "admin" },
    { id: 2, name: "Alice", username: "alice", role: "member" },
    { id: 3, name: "Bob", username: "bob", role: "member" },
  ],
  threads: [
    {
      id: 1,
      title: "Project: Open Lens - realtime collaboration",
      authorId: 2,
      content: "We want to build a lightweight realtime sketching tool for ideation.",
      tags: ["project", "realtime"],
      votes: 6,
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
      comments: [
        { id: 1, authorId: 3, content: "Love this — count me in.", createdAt: Date.now() - 1000 * 60 * 60 * 20 },
      ],
    },
    {
      id: 2,
      title: "Share a small idea: micro libraries you wish existed",
      authorId: 3,
      content: "Short, focused ideas that could be built in a weekend.",
      tags: ["ideas", "micro"],
      votes: 3,
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
      comments: [],
    },
  ],
};

function uid() {
  return Math.floor(Math.random() * 1e9);
}

export default function DevForum() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("devforum:data");
    return saved ? JSON.parse(saved) : defaultData;
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("devforum:user");
    return saved ? JSON.parse(saved) : null;
  });
  const [viewThreadId, setViewThreadId] = useState(null);
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("devforum:data", JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    localStorage.setItem("devforum:user", JSON.stringify(user));
  }, [user]);

  const tags = Array.from(
    new Set(data.threads.flatMap((t) => t.tags))
  ).sort();

  function loginAs(username) {
    // simple simulated login for prototype
    const found = data.users.find((u) => u.username === username);
    if (found) {
      setUser(found);
    } else {
      const newUser = { id: uid(), name: username, username, role: "member" };
      setData((d) => ({ ...d, users: [...d.users, newUser] }));
      setUser(newUser);
    }
  }

  function logout() {
    setUser(null);
  }

  function createThread({ title, content, tags: tgs }) {
    const thread = {
      id: uid(),
      title,
      authorId: user ? user.id : null,
      content,
      tags: tgs,
      votes: 0,
      createdAt: Date.now(),
      comments: [],
    };
    setData((d) => ({ ...d, threads: [thread, ...d.threads] }));
    setShowNewModal(false);
    setViewThreadId(thread.id);
  }

  function addComment(threadId, content) {
    setData((d) => {
      const threads = d.threads.map((t) =>
        t.id === threadId
          ? { ...t, comments: [...t.comments, { id: uid(), authorId: user ? user.id : null, content, createdAt: Date.now() }] }
          : t
      );
      return { ...d, threads };
    });
  }

  function voteThread(threadId, delta) {
    setData((d) => ({ ...d, threads: d.threads.map((t) => (t.id === threadId ? { ...t, votes: t.votes + delta } : t)) }));
  }

  function deleteThread(threadId) {
    setData((d) => ({ ...d, threads: d.threads.filter((t) => t.id !== threadId) }));
    if (viewThreadId === threadId) setViewThreadId(null);
  }

  function renderThreads() {
    const filtered = data.threads
      .filter((t) => (tagFilter === "all" ? true : t.tags.includes(tagFilter)))
      .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.content.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.votes - a.votes || b.createdAt - a.createdAt);

    return (
      <div className="space-y-4">
        {filtered.map((t) => (
          <div key={t.id} className="p-4 rounded-2xl bg-black/40 border border-white/6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-cursive text-2xl text-white cursor-pointer" onClick={() => setViewThreadId(t.id)}>{t.title}</h3>
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">{t.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map((tg) => (
                    <span key={tg} className="text-xs px-2 py-1 rounded-full bg-white/6">#{tg}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => voteThread(t.id, 1)} className="px-3 py-1 rounded-md bg-white/6">▲</button>
                  <div className="text-sm">{t.votes}</div>
                  <button onClick={() => voteThread(t.id, -1)} className="px-3 py-1 rounded-md bg-white/6">▼</button>
                </div>
                <div className="text-xs text-gray-400">{timeAgo(t.createdAt)}</div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-gray-400">No threads found.</div>}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#0b0b0d]">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Inter:wght@300;400;600&display=swap');
         .font-cursive { font-family: 'Dancing Script', cursive; }
         .font-sans { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
         `}
      </style>

      <header className={`p-6 ${GRADIENT} rounded-b-3xl`}> 
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/8 flex items-center justify-center text-xl font-bold">DF</div>
            <div>
              <h1 className="text-3xl font-cursive leading-none">DevForum</h1>
              <div className="text-sm text-white/80">A modern dark forum for projects & ideas</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search threads or content..." className="px-3 py-2 rounded-lg bg-black/40 placeholder-gray-300 border border-white/6" />
              <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-black/40 border border-white/6">
                <option value="all">All tags</option>
                {tags.map((tg) => (
                  <option key={tg} value={tg}>{tg}</option>
                ))}
              </select>
            </div>

            {!user ? (
              <div className="flex gap-2">
                <button onClick={() => loginAs("guest")} className="px-4 py-2 rounded-md bg-white/8">Guest</button>
                <button onClick={() => loginAs("newuser") } className="px-4 py-2 rounded-md bg-white/8">Sign up</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm">{user.name}</div>
                  <div className="text-xs text-gray-300">{user.role}</div>
                </div>
                <button onClick={() => setShowNewModal(true)} className="px-4 py-2 rounded-md bg-white/6">New</button>
                <button onClick={() => logout()} className="px-3 py-2 rounded-md bg-black/30 border">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-cursive text-2xl">Threads</h2>
            <div className="text-sm text-gray-400">{data.threads.length} threads</div>
          </div>

          <div>{renderThreads()}</div>
        </section>

        <aside className="md:col-span-1 space-y-6">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/6">
            <h3 className="font-cursive text-xl">Community</h3>
            <p className="text-sm text-gray-300 mt-2">Active members</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.users.map((u) => (
                <div key={u.id} className="px-3 py-1 rounded-full bg-white/6 text-sm">{u.name}</div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">Tags</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => setTagFilter("all")} className="text-xs px-2 py-1 rounded-full bg-white/6">All</button>
              {tags.map((tg) => (
                <button key={tg} onClick={() => setTagFilter(tg)} className="text-xs px-2 py-1 rounded-full bg-white/6">#{tg}</button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/6">
            <h3 className="font-cursive text-xl">Admin</h3>
            <p className="text-sm text-gray-300 mt-2">Management</p>
            <div className="mt-3 flex flex-col gap-2">
              <button onClick={() => { if (user && user.role === 'admin') { setViewThreadId(null); } else alert('Only admin can access dashboard in this prototype') }} className="px-3 py-2 rounded-md bg-white/6">Open Dashboard</button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); alert('Link copied') }} className="px-3 py-2 rounded-md bg-black/30 border">Share</button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/6">
            <h3 className="font-cursive text-xl">About</h3>
            <p className="text-sm text-gray-300 mt-2">A minimal forum-style prototype for developer projects and idea discussion.</p>
          </div>
        </aside>

        <div className="md:col-span-3">
          {viewThreadId ? (
            <ThreadView thread={data.threads.find((t) => t.id === viewThreadId)} onClose={() => setViewThreadId(null)} onComment={addComment} onDelete={deleteThread} user={user} vote={voteThread} users={data.users} />
          ) : (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/6">Select a thread to view details and replies.</div>
          )}
        </div>
      </main>

      {showNewModal && (
        <NewThreadModal onClose={() => setShowNewModal(false)} onCreate={createThread} />
      )}

      <footer className="p-6 text-center text-sm text-gray-400">DevForum prototype • Dark theme • Gradient accent</footer>
    </div>
  );
}

function ThreadView({ thread, onClose, onComment, onDelete, user, vote, users }) {
  if (!thread) return null;
  const author = users.find((u) => u.id === thread.authorId) || { name: "Unknown" };
  return (
    <div className="p-6 rounded-2xl bg-black/50 border border-white/6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-cursive text-3xl">{thread.title}</h2>
          <div className="text-sm text-gray-300">by {author.name} • {timeAgo(thread.createdAt)}</div>
          <p className="mt-4 text-gray-200">{thread.content}</p>
          <div className="mt-4 flex gap-2">
            {thread.tags.map((tg) => (
              <span key={tg} className="text-xs px-2 py-1 rounded-full bg-white/6">#{tg}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => vote(thread.id, 1)} className="px-3 py-1 rounded-md bg-white/6">▲</button>
            <div className="text-sm">{thread.votes}</div>
            <button onClick={() => vote(thread.id, -1)} className="px-3 py-1 rounded-md bg-white/6">▼</button>
          </div>
          <div className="flex gap-2">
            {user && user.role === 'admin' && <button onClick={() => { if (confirm('Delete this thread?')) onDelete(thread.id) }} className="px-3 py-2 rounded-md bg-red-700/70">Delete</button>}
            <button onClick={onClose} className="px-3 py-2 rounded-md bg-black/30 border">Close</button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-cursive text-xl">Replies</h3>
        <div className="mt-4 space-y-4">
          {thread.comments.map((c) => (
            <div key={c.id} className="p-3 rounded-lg bg-black/30 border border-white/4">
              <div className="text-sm text-gray-300">{(users.find((u) => u.id === c.authorId) || { name: 'Guest' }).name} • {timeAgo(c.createdAt)}</div>
              <div className="mt-2 text-gray-200">{c.content}</div>
            </div>
          ))}
          {thread.comments.length === 0 && <div className="text-gray-400">No replies yet — be the first to comment.</div>}
        </div>

        <div className="mt-6">
          {user ? (
            <ReplyBox onSend={(text) => onComment(thread.id, text)} />
          ) : (
            <div className="text-gray-400">Sign in to reply.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplyBox({ onSend }) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full rounded-lg bg-black/20 p-3 placeholder-gray-400" placeholder="Write a thoughtful reply..." />
      <div className="flex justify-end">
        <button onClick={() => { if (text.trim()) { onSend(text.trim()); setText(''); } }} className="px-4 py-2 rounded-md bg-white/6">Reply</button>
      </div>
    </div>
  );
}

function NewThreadModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl p-6 rounded-2xl bg-[#0b0b0d] border border-white/6">
        <div className="flex items-center justify-between">
          <h3 className="font-cursive text-2xl">New Thread</h3>
          <button onClick={onClose} className="px-3 py-1 rounded-md bg-black/30 border">Close</button>
        </div>
        <div className="mt-4 grid gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Thread title" className="px-3 py-2 rounded-lg bg-black/20" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} placeholder="Describe your idea or project..." className="px-3 py-2 rounded-lg bg-black/20" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags separated by commas" className="px-3 py-2 rounded-lg bg-black/20" />
          <div className="flex justify-end gap-2">
            <button onClick={() => { if (!title.trim()) return alert('Add a title'); onCreate({ title: title.trim(), content: content.trim(), tags: tags.split(',').map(s=>s.trim()).filter(Boolean) }); }} className="px-4 py-2 rounded-md bg-white/6">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
