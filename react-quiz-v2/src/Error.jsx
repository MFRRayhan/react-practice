import { RiErrorWarningLine } from "react-icons/ri";

export default function Error() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f5e7e2] text-[#a34c39]">
        <RiErrorWarningLine size={32} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink">Something went wrong!</h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
        We couldn't load the quiz questions. Please check your connection and
        try again.
      </p>
    </div>
  );
}
