import { RiTrophyLine, RiCheckboxCircleLine } from "react-icons/ri";

export default function Progress({
  index,
  numOfQuestions,
  points,
  maxPossiblePoints,
  answer,
}) {
  const progress = index + Number(answer !== null);

  return (
    <div className="mb-9 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted">
            YOUR PROGRESS
          </p>

          <p className="mt-1 text-lg font-bold text-ink">
            Question {index + 1}
            <span className="font-medium text-muted"> / {numOfQuestions}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#f5f7f5] px-3 py-2">
          <RiTrophyLine className="text-amber-600" size={19} />

          <span className="text-sm font-bold text-ink">
            {points}
            <span className="font-medium text-muted">
              {" "}
              / {maxPossiblePoints}
            </span>
          </span>
        </div>
      </div>

      <progress
        value={progress}
        max={numOfQuestions}
        className="progress h-2 w-full bg-[#e7eee9] [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-brand"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted">
          {Math.round((progress / numOfQuestions) * 100)}% completed
        </span>

        <span className="flex items-center gap-1 text-xs font-medium text-muted">
          <RiCheckboxCircleLine size={15} />
          {progress} answered
        </span>
      </div>
    </div>
  );
}
