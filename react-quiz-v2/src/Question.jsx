import Options from "./Options";
import { RiQuestionLine } from "react-icons/ri";

export default function Question({ question, dispatch, answer }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <RiQuestionLine className="text-brand" size={21} />

        <span className="text-xs font-bold tracking-widest text-brand">
          CHOOSE YOUR ANSWER
        </span>
      </div>

      <h2 className="text-xl leading-relaxed font-bold text-ink sm:text-2xl">
        {question.question}
      </h2>

      <Options question={question} dispatch={dispatch} answer={answer} />
    </section>
  );
}
