
import { useState } from 'react';

const StarRow = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i <= rating ? 'currentColor' : 'none'} stroke="currentColor" className={`h-4 w-4 ${i <= rating ? 'text-amber-400' : 'text-zinc-300'}`}>
                    <path d="m12 17.27 5.18 3.73-1.64-6.16L20 10.24l-6.37-.51L12 3.8l-1.63 5.93L4 10.24l4.46 4.6-1.64 6.16L12 17.27Z" />
                </svg>
            ))}
        </div>
    );
};

const truncate = (s, n = 80) => s && s.length > n ? s.slice(0, n - 1) + '…' : s || '';

const FeedBackHistory = () => {
    const [items] = useState(() => {
        try {
            const raw = localStorage.getItem('hintro_feedbacks') || '[]';
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.warn('Failed to load feedbacks', err);
            return [];
        }
    });

    // determine current user id from stored profile
    const currentUserId = (() => {
        try {
            const sp = localStorage.getItem('profile');
            if (!sp) return null;
            const parsed = JSON.parse(sp);
            return parsed?.email === 'u1@gmail.com' ? 'u1' : 'u2';
        } catch {
            return null;
        }
    })();

    const visible = currentUserId ? items.filter((it) => it.userId === currentUserId) : [];

    if (!visible || visible.length === 0) {
        return (
            <div className="p-6">
                <h3 className="mb-6 text-lg text-zinc-500">Browse your previous feedback submissions</h3>
                <div className="mx-auto max-w-5xl rounded-xl border border-zinc-200 bg-white p-20  text-center text-sm text-zinc-600">
                    <p className="mb-4 text-sm text-zinc-500">No feedbacks yet</p>
                    <button
                        type="button"
                        onClick={() => document.getElementById('feedback_modal')?.showModal()}
                        className="rounded border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                        Give Feedback
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h3 className="mb-4 text-sm text-zinc-500">Browse your previous feedback submissions</h3>

            {/* Mobile: cards list */}
            <div className="space-y-3 md:hidden">
                {visible.map((it, idx) => (
                    <div key={it.iso || idx} className="rounded-lg border border-zinc-200 bg-white p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-zinc-900">{it.title || 'Feedback Title'}</h4>
                                <p className="mt-1 text-xs text-zinc-500">{truncate(it.description, 80)}</p>
                                <p className="mt-3 text-blue-400 text-xs">{it.date} · {it.time}</p>
                            </div>
                            <div className="pl-4">
                                <StarRow rating={Number(it.rating) || 0} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-zinc-50">
                            <tr className="text-left text-xs text-zinc-500">
                                <th className="p-3 w-1/4">Title</th>
                                <th className="p-3 w-1/12">Rating</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 w-1/6">Date</th>
                                <th className="p-3 w-1/12">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((it, idx) => (
                                <tr key={it.iso || idx} className="border-t border-zinc-100 even:bg-zinc-50">
                                    <td className="p-3 align-top text-sm text-zinc-900">{it.title || 'My First Call'}</td>
                                    <td className="p-3 align-top text-sm"><span className="text-zinc-700">{it.rating || 0}/5</span></td>
                                    <td className="p-3 align-top text-sm text-zinc-600">{truncate(it.description, 80)}</td>
                                    <td className="p-3 align-top text-sm text-zinc-600">{it.date}</td>
                                    <td className="p-3 align-top text-sm text-zinc-600">{it.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeedBackHistory;