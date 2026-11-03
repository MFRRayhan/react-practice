import { RiCheckboxCircleFill, RiCloseCircleFill } from "react-icons/ri";

export default function Options({ question, dispatch, answer }) {
  const hasAnswered = answer !== null;

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option, index) => {
        const isCorrect = index === question.correctOption;
        const isSelected = index === answer;

        let answerStyle =
          "border-[#e3eae5] bg-white text-ink hover:border-brand hover:bg-brand-light";

        if (hasAnswered && isCorrect) {
          answerStyle = "correct border";
        } else if (hasAnswered && isSelected && !isCorrect) {
          answerStyle = "wrong border";
        } else if (hasAnswered) {
          answerStyle = "border-[#e3eae5] bg-[#f8faf8] text-muted opacity-60";
        }

        return (
          <button
            key={option}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
            disabled={hasAnswered}
            className={`group flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 sm:px-5 ${answerStyle} ${
              !hasAnswered ? "hover:translate-x-1" : ""
            }`}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#edf2ee] text-xs font-bold text-brand group-hover:bg-white">
              {String.fromCharCode(65 + index)}
            </span>

            <span className="flex-1 text-sm font-medium sm:text-base">
              {option}
            </span>

            {hasAnswered && isCorrect && (
              <RiCheckboxCircleFill
                className="shrink-0 text-[#3b8054]"
                size={22}
              />
            )}

            {hasAnswered && isSelected && !isCorrect && (
              <RiCloseCircleFill
                className="shrink-0 text-[#b65b48]"
                size={22}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
