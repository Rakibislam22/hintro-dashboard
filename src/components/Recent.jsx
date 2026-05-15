
const Recent = ({ profile, callSessions: callSessionsData, apiError, loading }) => {
    return (
        <div>
            <section className="mt-10">
                <h3 className="mb-3 text-center text-2xl font-semibold">Recent calls</h3>
                {/* Prepare call sessions from API (safe fallback to empty array) */}
                {(() => {
                    const callSessions = Array.isArray(callSessionsData?.callSessions) ? callSessionsData.callSessions : [];

                    const formatHeading = (d) => {
                        const month = d.toLocaleString('en-US', { month: 'long' });
                        const day = d.getDate();
                        const suffix = (n) => {
                            if (n % 10 === 1 && n % 100 !== 11) return 'st';
                            if (n % 10 === 2 && n % 100 !== 12) return 'nd';
                            if (n % 10 === 3 && n % 100 !== 13) return 'rd';
                            return 'th';
                        };
                        return `${month} ${day}${suffix(day)}`;
                    };

                    const formatTime = (iso) => {
                        const d = new Date(iso);
                        if (Number.isNaN(d.getTime())) return '';
                        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
                    };

                    if (loading) {
                        return (
                            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white px-4 py-6">
                                <div className="mb-4 h-5 w-40 animate-pulse rounded bg-zinc-200" />
                                <div className="space-y-4">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg px-2 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 animate-pulse rounded-md bg-zinc-200" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-44 animate-pulse rounded bg-zinc-200" />
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 animate-pulse rounded bg-zinc-200" />
                                                        <div className="h-4 w-4 animate-pulse rounded bg-zinc-200" />
                                                        <div className="h-4 w-4 animate-pulse rounded bg-zinc-200" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }

                    if (apiError) {
                        return (
                            <div className="mx-auto flex min-h-[290px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
                                        <path d="M12 9v4" />
                                        <path d="M12 17h.01" />
                                        <path d="M10.3 4.3h3.4L22 16.6v3.4H2v-3.4L10.3 4.3Z" />
                                    </svg>
                                </div>
                                <p className="text-xl font-semibold text-red-700">Recent calls unavailable</p>
                                <p className="mt-2 max-w-md text-sm text-red-600">{apiError}</p>
                            </div>
                        );
                    }

                    if (!callSessions.length) {
                        return (
                            <div className="mx-auto flex min-h-[290px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-[#f8f8f8] p-8 text-center">
                                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-blue-500 size-6`}>
                                        <path d="M4 7h16v13H4z" />
                                        <path d="M8 3v4M16 3v4M4 11h16" />
                                    </svg>
                                </div>
                                <p className="text-xl font-semibold text-zinc-700">No Recent Calls</p>
                                <p className="mt-2 max-w-md text-sm text-zinc-400">
                                    Connect your Google Calendar to see upcoming meetings, get reminders, and join calls directly from Hintro.
                                </p>
                                <button className="mt-5 rounded-md border border-zinc-500 px-4 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
                                    Start a Call
                                </button>
                            </div>
                        );
                    }

                    // Normalize sessions into objects with iso time and title
                    const normalized = callSessions.map((s) => {
                        if (typeof s === 'string') return { iso: s, title: 'Design Call' };
                        // Extract timestamp from common field names
                        const iso = s.startTime || s.endTime || s.createdAt || s.date || s.time || s.iso || null;
                        // Build title from client and description
                        const title = s.client ? `${s.client}${s.description ? ` - ${s.description}` : ''}` : (s.title || s.summary || 'Design Call');
                        return {
                            iso,
                            title,
                            participants: s.participants || [],
                        };
                    }).filter(x => x.iso);

                    // Group by date (descending)
                    const groups = {};
                    normalized.forEach((item) => {
                        const d = new Date(item.iso);
                        const key = d.toDateString();
                        if (!groups[key]) groups[key] = { date: d, items: [] };
                        groups[key].items.push(item);
                    });

                    const orderedKeys = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

                    return (
                        <div className="w-full max-w-4xl mx-auto">
                            {orderedKeys.map((k) => (
                                <div key={k} className="mb-5">
                                    <div className="px-3 text-sm font-medium text-zinc-500">{formatHeading(groups[k].date)}</div>
                                    <div>
                                        {groups[k].items.map((it, idx) => (
                                            <div key={idx} className="flex items-center justify-between  px-4 py-3 ">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 flex items-center justify-center rounded-md bg-violet-500 text-white font-bold">{(profile?.firstName || 'D').charAt(0)}</div>
                                                    <div>
                                                        <div className="text-sm mb-1 font-medium">{it.title}</div>
                                                        <div className="text-xs text-zinc-400 flex items-center">
                                                            {Array.isArray(it.participants) && it.participants.length > 0 ? (
                                                                <div className="flex items-center">
                                                                    {it.participants.slice(0, 3).map((p, pi) => {
                                                                        const src = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';
                                                                        return src ? (
                                                                            <img
                                                                                key={pi}
                                                                                src={src}
                                                                                alt={p?.name || `participant-${pi}`}
                                                                                className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                                                                style={{ marginLeft: pi === 0 ? 0 : -8 }}
                                                                            />
                                                                        ) : (
                                                                            <div
                                                                                key={pi}
                                                                                className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"
                                                                                style={{ marginLeft: pi === 0 ? 0 : -8 }}
                                                                            />
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <span className="inline-block w-4 h-4 rounded-sm bg-slate-200" />
                                                                    <span className="inline-block w-4 h-4 rounded-sm bg-slate-200" />
                                                                    <span className="inline-block w-4 h-4 rounded-sm bg-slate-200" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm text-zinc-600">{formatTime(it.iso)}</div>
                                                    <button className="font-bold px-2">
                                                        ⋮
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </section>
        </div>
    );
};

export default Recent;