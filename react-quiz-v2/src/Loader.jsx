import { RiLoader4Line } from "react-icons/ri";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <RiLoader4Line size={38} className="animate-spin text-brand" />

      <p className="mt-5 font-semibold text-ink">Preparing your quiz...</p>

      <p className="mt-2 text-sm text-muted">Getting your questions ready.</p>
    </div>
  );
}
