import { RiTrophyLine, RiRestartLine, RiMedalLine } from "react-icons/ri";

export default function FinishScreen({ maxPossiblePoints, points, highScore }) {
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);

  return (
    <div className="py-5 text-center sm:py-8">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-[#f5eddb] text-[#b18a43]">
        <RiTrophyLine size={42} />
      </div>

      <p className="mb-3 text-xs font-bold tracking-widest text-brand">
        QUIZ COMPLETED
      </p>

      <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Well Done!
      </h2>

      <p className="mt-3 text-sm text-muted">
        You've completed the React Quiz. Here's your result.
      </p>

      <div className="my-8 rounded-2xl bg-[#f3f6f3] p-6">
        <p className="text-xs font-bold tracking-widest text-muted">
          YOUR FINAL SCORE
        </p>

        <p className="mt-3 text-5xl font-bold tracking-tight text-brand">
          {percentage}%
        </p>

        <p className="mt-2 text-sm text-muted">
          {points} out of {maxPossiblePoints} points
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl border border-[#e3eae5] p-4">
        <RiMedalLine size={23} className="text-amber-600" />

        <span className="text-sm text-muted">High Score:</span>

        <strong className="text-ink">{highScore} points</strong>
      </div>
    </div>
  );
}
