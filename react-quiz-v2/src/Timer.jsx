import { useEffect } from "react";
import { RiTimeLine } from "react-icons/ri";

export default function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch]);

  const isUrgent = secondsRemaining <= 60;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
        isUrgent
          ? "border-[#ecd0c5] bg-[#f5e7e2] text-[#a34c39]"
          : "border-[#e3eae5] bg-[#f5f7f5] text-ink"
      }`}
    >
      <RiTimeLine size={20} />

      <span className="font-mono text-lg font-bold tabular-nums">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}
