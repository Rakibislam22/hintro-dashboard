
import { useOutletContext } from 'react-router';
import Recent from './Recent';

const DashboardIcon = ({ type, className = 'size-4' }) => {
    if (type === 'pie') return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`text-red-500 ${className}`}>
            <path d="M11 3a9 9 0 1 0 10 10h-8a2 2 0 0 1-2-2V3Z" />
            <path d="M13 3v8h8A9 9 0 0 0 13 3Z" />
        </svg>
    );
    if (type === 'clock') return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-cyan-800 ${className}`}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" />
        </svg>
    );
    if (type === 'spark') return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`text-green-700 size-8 ${className}`}>
            <path d="m12 2 1.7 4.3L18 8l-4.3 1.7L12 14l-1.7-4.3L6 8l4.3-1.7L12 2Zm7 10 1 2.5 2.5 1L20 16.5 19 19l-1-2.5-2.5-1L18 14.5 19 12ZM5 13l1.2 3L9 17.2 6.2 18.5 5 21l-1.2-2.5L1 17.2 3.8 16 5 13Z" />
        </svg>
    );
    if (type === 'calendar') return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-violet-500 ${className}`}>
            <path d="M4 7h16v13H4z" />
            <path d="M8 3v4M16 3v4M4 11h16" />
        </svg>
    );
    return null;
};

const DashboardElement = () => {
    const { apiError, loading, profile, statCards, formatDuration, recentCalls } = useOutletContext();

    return (
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
                    const displayValue = card.title === 'Average Duration' ? (formatDuration ? formatDuration(card.value) : card.value) : (card.value ?? 0);
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
    );
};

export default DashboardElement;