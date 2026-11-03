import { RiBookOpenLine, RiArrowRightLine } from "react-icons/ri";

export default function StartScreen({ dispatch, numOfQuestions }) {
  return (
    <div className="py-5 text-center sm:py-8">
      <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-brand-light text-brand">
        <RiBookOpenLine size={38} />
      </div>

      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-brand">
        WELCOME TO REACT QUIZ
      </p>

      <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Ready to test your skills?
      </h2>

      <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-muted sm:text-base">
        Challenge yourself and see how much you know about React. Take your time
        and enjoy learning.
      </p>

      <div className="mx-auto my-8 inline-flex items-center gap-3 rounded-2xl bg-[#f3f6f3] px-5 py-3">
        <RiBookOpenLine className="text-brand" size={22} />

        <span className="text-sm font-semibold text-ink">
          {numOfQuestions} Questions
        </span>
      </div>

      <div>
        <button
          onClick={() => dispatch({ type: "start" })}
          className="btn h-12 border-0 bg-brand px-8 text-white shadow-sm hover:bg-[#194b49] hover:shadow-md"
        >
          Let's Start
          <RiArrowRightLine size={20} />
        </button>
      </div>
    </div>
  );
}
