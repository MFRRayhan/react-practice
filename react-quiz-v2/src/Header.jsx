import { RiGraduationCapLine } from "react-icons/ri";

export default function Header() {
  return (
    <header className="mb-10 flex items-center justify-center gap-3 sm:mb-12">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
        <RiGraduationCapLine size={27} />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          React Quiz
        </h1>
        <p className="text-xs font-medium tracking-wider text-muted">
          TEST YOUR KNOWLEDGE
        </p>
      </div>
    </header>
  );
}
