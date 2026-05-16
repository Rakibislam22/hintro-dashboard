import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import Recent from "./Recent";
import { Link, useNavigate } from "react-router";
import { RiChatDownloadFill } from "react-icons/ri";
import { HiGift } from "react-icons/hi";

const dataFetch = async (url, head) => {
    try {
        const response = await fetch(`https://mock-backend-hintro.vercel.app${url}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": `${head}`
            }
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(payload?.message || payload?.error || `Request failed with status ${response.status}`);
        }

        return { data: payload, error: null };
    } catch (error) {
        return { data: null, error: error instanceof Error ? error.message : "Failed to fetch data" };
    }
};

// Format a duration value into "Xm Ysec". Accepts seconds or milliseconds.
const formatDuration = (value) => {
    // If already formatted like "14m 22sec", return as-is
    if (typeof value === 'string' && value.includes('m') && value.includes('sec')) return value;
    if (value == null) return '0m 0sec';

    let secs = Number(value);
    if (!Number.isFinite(secs)) return '0m 0sec';

    // API returns seconds; treat value as seconds and round
    secs = Math.round(secs);

    if (secs < 0) return '0m 0sec';

    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}sec`;
};

// Format an ISO timestamp into relative time like "5m ago", "2h ago", "3 days ago"
const formatRelativeTime = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';

    const secs = Math.floor((Date.now() - d.getTime()) / 1000);
    if (secs < 0) return 'just now';
    if (secs < 60) return `${secs}sec ago`;

    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;

    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

    const months = Math.floor(days / 30);
    return `${months}mo ago`;
};

const sidebarItems = [
    { label: "Dashboard", active: true, icon: "dashboard" },
    { label: "Call Insights", icon: "phone" },
    { label: "Knowledge Base", icon: "docs", hasInfo: true },
    { label: "Prompts", icon: "chat", hasInfo: true },
    { label: "Boxy Controls", icon: "globe", hasInfo: true },
];

const DashboardIcon = ({ type, className = "size-4" }) => {
    if (type === "dashboard") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M4 4h7v7H4V4Zm9 0h7v4h-7V4Zm0 6h7v10h-7V10ZM4 13h7v7H4v-7Z" />
            </svg>
        );
    }

    if (type === "phone") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
                <path d="M5 4h4l2 5-2.5 1.5a15 15 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
            </svg>
        );
    }

    if (type === "docs") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
                <path d="M7 3h7l5 5v13H7z" />
                <path d="M14 3v5h5" />
                <path d="M10 13h6M10 17h6" />
            </svg>
        );
    }

    if (type === "chat") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
                <path d="M4 5h16v10H8l-4 4V5Z" />
                <path d="M8 9h8" />
            </svg>
        );
    }

    if (type === "globe") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
        );
    }

    if (type === "pie") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`text-red-500 ${className}`}>
                <path d="M11 3a9 9 0 1 0 10 10h-8a2 2 0 0 1-2-2V3Z" />
                <path d="M13 3v8h8A9 9 0 0 0 13 3Z" />
            </svg>
        );
    }

    if (type === "clock") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-cyan-800 ${className}`}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        );
    }

    if (type === "spark") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`text-green-700 size-8 ${className}`}>
                <path d="m12 2 1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7L12 2Zm7 10 1 2.5 2.5 1L20 16.5 19 19l-1-2.5-2.5-1L18 14.5 19 12ZM5 13l1.2 3L9 17.2 6.2 18.5 5 21l-1.2-2.5L1 17.2 3.8 16 5 13Z" />
            </svg>
        );
    }

    if (type === "calendar") {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-violet-500 ${className}`}>
                <path d="M4 7h16v13H4z" />
                <path d="M8 3v4M16 3v4M4 11h16" />
            </svg>
        );
    }

    return null;
};

const InfoBadge = () => (
    <span className="flex size-4 items-center justify-center rounded-full border border-zinc-700 text-[10px] font-bold text-zinc-700">i</span>
);

const feedbackPrompts = {
    1: "What frustrated you or felt confusing?",
    2: "What frustrated you or felt confusing?",
    3: "What could have made this better?",
    4: "What did you like the most?",
    5: "What did you like the most?",
};

const Dashboard = () => {
    const [dashboardState, setDashboardState] = useState({
        loading: true,
        profile: {},
        dashboard: {},
        stats: {},
        recentCalls: { callSessions: [] },
        error: "",
    });
    const [feedbackState, setFeedbackState] = useState({
        rating: 0,
        comment: "",
    });
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const navigate = useNavigate();

    const openFeedbackModal = () => {
        setFeedbackState({ rating: 0, comment: "" });
        setFeedbackSubmitted(false);
        document.getElementById("feedback_modal")?.showModal();
    };

    const closeFeedbackModal = () => {
        setFeedbackState({ rating: 0, comment: "" });
        setFeedbackSubmitted(false);
        document.getElementById("feedback_modal")?.close();
    };

    const submitFeedback = () => {
        // send feedback to backend (TODO)
        setFeedbackSubmitted(true);
    };

    useEffect(() => {
        let isMounted = true;

        const storedProfile = localStorage.getItem('profile');
        if (!storedProfile) {
            navigate('/');
            return;
        }
        const { email } = JSON.parse(storedProfile);
        const userId = email === 'u1@gmail.com' ? 'u1' : 'u2';

        const loadDashboard = async () => {
            const [profileResult, dashboardResult, statsResult, recentCallsResult] = await Promise.all([
                dataFetch("/api/auth/profile", userId),
                dataFetch("/api/auth/dashboard", userId),
                dataFetch("/api/call-sessions/stats", userId),
                dataFetch("/api/call-sessions?limit=5", userId),
            ]);

            if (!isMounted) return;

            setDashboardState({
                loading: false,
                profile: profileResult.data || {},
                dashboard: dashboardResult.data || {},
                stats: statsResult.data || {},
                recentCalls: recentCallsResult.data || { callSessions: [] },
                error: profileResult.error || dashboardResult.error || statsResult.error || recentCallsResult.error || "",
            });
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    const { loading, profile, dashboard, stats, recentCalls, error: apiError } = dashboardState;

    const totalSessions = Number.isFinite(Number(stats?.totalSessions)) ? Number(stats.totalSessions) : 0;
    const averageDuration = Number.isFinite(Number(stats?.averageDuration)) ? Number(stats.averageDuration) : 0;
    const totalAIInteractions = Number.isFinite(Number(stats?.totalAIInteractions)) ? Number(stats.totalAIInteractions) : 0;
    const lastSessionRaw = Array.isArray(stats?.lastSession) && stats.lastSession.length ? stats.lastSession[0] : null;
    const lastSessionRelative = formatRelativeTime(lastSessionRaw);
    const kbFilesUsage = dashboard?.usage?.kb_files || null;
    const planLabel = dashboard?.subscription?.plan
        ? dashboard.subscription.plan.charAt(0).toUpperCase() + dashboard.subscription.plan.slice(1)
        : "Free";
    const statCards = [
        { title: "Total Sessions", value: totalSessions, color: "bg-red-100", icon: "pie" },
        { title: "Average Duration", value: averageDuration, color: "bg-cyan-100", icon: "clock" },
        { title: "AI Used", value: ` ${totalAIInteractions} times`, color: "bg-green-100", icon: "spark" },
        { title: "Last Session", value: lastSessionRelative || '-', color: "bg-violet-100", icon: "calendar" },
    ];

    return (
        <div className="min-h-screen bg-[#f7f7f8] text-zinc-800">
            <div className="drawer lg:drawer-open">
                <input id="main-sidebar" type="checkbox" className="drawer-toggle" defaultChecked />

                <div className="drawer-content min-h-screen">
                    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-[#f5f5f5] px-4 lg:px-8">
                        <div className="flex items-center gap-3">
                            <label htmlFor="main-sidebar" aria-label="open sidebar" className="btn btn-ghost btn-square btn-sm lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </label>
                            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="hidden items-center gap-2 rounded-md border border-zinc-400 bg-white px-4 py-1.5 text-sm font-medium text-zinc-800 sm:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Tutorial
                            </button>

                            <Avatar profile={profile} />
                        </div>
                    </header>

                    <main className="px-4 py-5 lg:px-8 lg:py-6">
                        {apiError ? (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                Server error: {apiError}. Showing available data only.
                            </div>
                        ) : null}

                        <section className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                {loading ? (
                                    <div className="h-9 w-80 animate-pulse rounded-md bg-zinc-200/80" />
                                ) : (
                                    <h2 className="text-[30px] font-medium leading-tight">Hi, {profile?.firstName} 👋 Welcome to Hintro</h2>
                                )}
                                <p className="mt-1 text-sm text-zinc-500">Ready to make your next call smarter ?</p>
                            </div>

                            <button className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800">Start New Call</button>
                        </section>

                        <section className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                            {statCards.map((card) => {
                                const displayValue = card.title === 'Average Duration' ? formatDuration(card.value) : (card.value ?? 0);
                                return (
                                    <article key={card.title} className="rounded-xl border border-zinc-300 bg-[#f4f4f4] px-2 sm:px-4 py-3">
                                        <div className="flex items-center gap-3 md:gap-6">
                                            <div className={`flex size-10 sm:size-15 items-center justify-center rounded-xl text-zinc-700 ${card.color}`}>
                                                <DashboardIcon type={card.icon} className="size-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm sm:text-lg font-medium leading-none">{card.title}</h3>
                                                <p className="mt-2 text-lg sm:text-2xl font-bold leading-none">{loading ? <span className="inline-block h-6 w-16 animate-pulse rounded bg-zinc-200" /> : displayValue}</p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        <Recent callSessions={recentCalls} profile={profile} apiError={apiError} loading={loading} />
                    </main>
                </div>

                <aside className="drawer-side border-r border-zinc-200">
                    <label htmlFor="main-sidebar" aria-label="close sidebar" className="drawer-overlay lg:hidden" />

                    <div className="flex min-h-full w-64 flex-col bg-[#f3f3f3]">
                        <div className="flex h-14 items-center border-b border-zinc-200 px-6">
                            <h2 className="pl-8 text-2xl font-medium tracking-tight">Hintro</h2>
                        </div>

                        <nav className="flex-1 px-2 py-4">
                            <ul className="space-y-1.5">
                                {sidebarItems.map((item) => (
                                    <li key={item.label}>
                                        <button
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${item.active
                                                ? "bg-[#e8ecff] font-medium text-[#4f6ef8]"
                                                : "text-zinc-700 hover:bg-zinc-100"
                                                }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <DashboardIcon type={item.icon} className="size-5" />
                                                {item.label}
                                            </span>
                                            {item.hasInfo && <InfoBadge />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="border-t border-zinc-200 px-2 py-4">
                            <button className="mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                                <RiChatDownloadFill className="text-lg" />
                                Feedback History
                            </button>

                            <button className="mb-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200 cursor-pointer" type="button" onClick={openFeedbackModal}>
                                <HiGift className="text-lg" />
                                Feedback
                            </button>

                            <div className="rounded-2xl bg-[#efefef] p-4">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-800">{loading ? <span className="inline-block h-4 w-24 animate-pulse rounded bg-zinc-200" /> : `${kbFilesUsage?.used ?? 0} of ${kbFilesUsage?.limit ?? 0} used`}</p>
                                        <p className="mt-1 text-xs text-zinc-500">Plan: {planLabel}</p>
                                    </div>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm">{loading ? '...' : `${kbFilesUsage?.percentage ?? 0}%`}</span>
                                </div>

                                <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200">
                                    <div
                                        className="h-full rounded-full bg-zinc-600 transition-all"
                                        style={{ width: `${kbFilesUsage?.percentage ?? 0}%` }}
                                    />
                                </div>

                                <button className="h-10 w-full rounded-lg border border-zinc-400 bg-zinc-600 text-sm font-medium text-zinc-100 shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-zinc-700">
                                    Upgrade
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* modal for leaving */}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box max-w-md rounded-lg p-6 shadow-xl">
                    <h3 className="text-xl font-semibold mb-3">Leaving already?</h3>
                    <div className="border-b border-zinc-200 mb-4" />
                    <p className="text-sm text-zinc-600 mb-6">You can log back in anytime to continue your meetings with Hintro.</p>
                    <div className="modal-action flex items-center justify-between gap-4">
                        <form method="dialog">
                            <button className="btn btn-outline">Cancel</button>
                        </form>
                        <Link to="/" className="btn btn-primary hover:bg-zinc-800" onClick={() => { localStorage.removeItem('profile'); }} >
                            Log out
                        </Link>
                    </div>
                </div>
            </dialog>

            {/* modal for feedback */}
            <dialog id="feedback_modal" className="modal">
                <div className="modal-box relative min-h-104 max-w-3xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                    <button
                        type="button"
                        onClick={() => { closeFeedbackModal(); setFeedbackSubmitted(false); }}
                        className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600"
                        aria-label="Close feedback dialog"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="mb-8">
                        <h3 className="text-3xl font-medium tracking-tight text-zinc-900">Give Feedback</h3>
                        <p className="mt-1 text-sm text-zinc-400">Describe your experience using Hintro...</p>
                    </div>

                    {feedbackSubmitted ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
                            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 17.27 5.82 21l1.64-6.16L2 10.24l6.37-.51L12 3.8l1.63 5.93L20 10.24l-5.46 4.6L16.18 21z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold">Thank you for your feedback!!</h4>
                            <p className="max-w-md text-sm text-zinc-500">Our team reviews every suggestion to improve AI responses, workflows, and overall experience.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 flex items-center justify-center gap-4 sm:gap-5">
                                {[1, 2, 3, 4, 5].map((rating) => {
                                    const isActive = feedbackState.rating >= rating;
                                    return (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() => setFeedbackState((current) => ({ ...current, rating }))}
                                            className={`transition-transform duration-150 hover:scale-110 ${isActive ? "text-amber-400" : "text-zinc-300"}`}
                                            aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-11 w-11 sm:h-12 sm:w-12">
                                                <path d="m12 17.27 5.18 3.73-1.64-6.16L20 10.24l-6.37-.51L12 3.8l-1.63 5.93L4 10.24l4.46 4.6-1.64 6.16L12 17.27Z" />
                                            </svg>
                                        </button>
                                    );
                                })}
                            </div>

                            {feedbackState.rating > 0 ? (
                                <div className="mb-10">
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        {feedbackPrompts[feedbackState.rating] || "What did you think about the experience?"}
                                    </label>
                                    <textarea
                                        value={feedbackState.comment}
                                        onChange={(event) => setFeedbackState((current) => ({ ...current, comment: event.target.value }))}
                                        placeholder="Share your thoughts here..."
                                        className="min-h-40 w-full resize-none rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-700 outline-none transition focus:border-zinc-400"
                                    />
                                </div>
                            ) : null}

                            <div className={`flex items-center justify-between gap-4 ${feedbackState.rating === 0 ? 'pt-18 px-12' : ''}`}>
                                <button type="button" onClick={closeFeedbackModal} className="btn btn-outline min-w-24 gap-2 rounded-md font-normal normal-case">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                        <path d="M15 18l-6-6 6-6" />
                                    </svg>
                                    Back
                                </button>

                                <button
                                    type="button"
                                    onClick={submitFeedback}
                                    disabled={feedbackState.rating === 0}
                                    className="btn min-w-24 rounded-md border-0 bg-zinc-400 font-normal text-white normal-case hover:bg-zinc-500 disabled:bg-zinc-300"
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default Dashboard;