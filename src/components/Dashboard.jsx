
const sidebarItems = [
    { label: "Dashboard", active: true, icon: "dashboard" },
    { label: "Call Insights", icon: "phone" },
    { label: "Knowledge Base", icon: "docs", hasInfo: true },
    { label: "Prompts", icon: "chat", hasInfo: true },
    { label: "Boxy Controls", icon: "globe", hasInfo: true },
];

const statCards = [
    { title: "Total Sessions", value: "0", color: "bg-red-100", icon: "pie" },
    { title: "Average Duration", value: "0", color: "bg-cyan-100", icon: "clock" },
    { title: "AI Used", value: "0", color: "bg-green-100", icon: "spark" },
    { title: "Last Session", value: "-", color: "bg-violet-100", icon: "calendar" },
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

const Dashboard = () => {
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
                            <button className="hidden items-center gap-2 rounded-md border border-zinc-400 bg-white px-4 py-1.5 text-xs font-medium text-zinc-800 sm:flex">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Watch Tutorial
                            </button>

                            <button className="flex items-center gap-2 rounded-full p-1.5 hover:bg-zinc-100">
                                <div className="size-7 rounded-full bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60')] bg-cover bg-center" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3 text-zinc-500">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>
                        </div>
                    </header>

                    <main className="px-4 py-5 lg:px-8 lg:py-6">
                        <section className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <h2 className="text-[30px] font-medium leading-tight">Hi, Name 👋 Welcome to Hintro</h2>
                                <p className="mt-1 text-sm text-zinc-500">Ready to make your next call smarter ?</p>
                            </div>

                            <button className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-zinc-800">Start New Call</button>
                        </section>

                        <section className="grid gap-3 grid-cols-2 xl:grid-cols-4">
                            {statCards.map((card) => (
                                <article key={card.title} className="rounded-xl border border-zinc-300 bg-[#f4f4f4] px-2 sm:px-4 py-3">
                                    <div className="flex items-center gap-3 md:gap-6">
                                        <div className={`flex size-10 sm:size-15 items-center justify-center rounded-xl text-zinc-700 ${card.color}`}>
                                            <DashboardIcon type={card.icon} className="size-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-lg font-medium leading-none">{card.title}</h3>
                                            <p className="mt-2 text-lg sm:text-2xl font-bold leading-none">{card.value}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>

                        <section className="mt-10">
                            <h3 className="mb-3 text-center text-2xl font-semibold">Recent calls</h3>
                            <div className="mx-auto flex min-h-[290px] w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-[#f8f8f8] p-8 text-center">
                                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500">
                                    <DashboardIcon type="calendar" className="size-6" />
                                </div>
                                <p className="text-xl font-semibold text-zinc-700">No Recent Calls</p>
                                <p className="mt-2 max-w-md text-sm text-zinc-400">
                                    Connect your Google Calendar to see upcoming meetings, get reminders, and join calls directly from Hintro.
                                </p>
                                <button className="mt-5 rounded-md border border-zinc-500 px-4 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
                                    Start a Call
                                </button>
                            </div>
                        </section>
                    </main>
                </div>

                <aside className="drawer-side border-r border-zinc-200">
                    <label htmlFor="main-sidebar" aria-label="close sidebar" className="drawer-overlay lg:hidden" />

                    <div className="flex min-h-full w-64 flex-col bg-[#f3f3f3]">
                        <div className="flex h-14 items-center border-b border-zinc-200 px-6">
                            <h2 className="text-[31px] font-medium tracking-tight">Hintro</h2>
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
                                                <DashboardIcon type={item.icon} className="size-4" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                    <path d="M14 3h7v7" />
                                    <path d="M10 14 21 3" />
                                    <path d="M21 14v7h-7" />
                                    <path d="M3 10 14 21" />
                                </svg>
                                Feedback History
                            </button>

                            <button className="mb-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                    <path d="M12 4v16M4 12h16" />
                                    <path d="M5 5h14v14H5z" />
                                </svg>
                                Feedback
                            </button>

                            <button className="h-8 w-full rounded-lg border border-zinc-400 bg-zinc-600 text-sm font-medium text-zinc-100 shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:bg-zinc-700">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;