export default function SentimentChart({
  positive,
  neutral,
  negative,
}: {
  positive: number;
  neutral: number;
  negative: number;
}) {
  const total = positive + neutral + negative;
  const posPercent = total ? (positive / total) * 100 : 0;
  const neuPercent = total ? (neutral / total) * 100 : 0;
  const negPercent = total ? (negative / total) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${posPercent}%` }}
          title={`Positive: ${positive}`}
        />
        <div
          className="h-full bg-zinc-400"
          style={{ width: `${neuPercent}%` }}
          title={`Neutral: ${neutral}`}
        />
        <div
          className="h-full bg-rose-500"
          style={{ width: `${negPercent}%` }}
          title={`Negative: ${negative}`}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Positive ({Math.round(posPercent)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-zinc-400" />
          <span>Neutral ({Math.round(neuPercent)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Negative ({Math.round(negPercent)}%)</span>
        </div>
      </div>
    </div>
  );
}
