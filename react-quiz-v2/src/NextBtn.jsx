import { RiArrowRightLine, RiFlagLine } from "react-icons/ri";

export default function NextBtn({ dispatch, answer, numOfQuestions, index }) {
  if (answer === null) return null;

  if (index < numOfQuestions - 1) {
    return (
      <button
        onClick={() => dispatch({ type: "newQuestion" })}
        className="btn h-12 border-0 bg-brand px-6 text-white hover:bg-[#194b49]"
      >
        Next Question
        <RiArrowRightLine size={19} />
      </button>
    );
  }

  if (index === numOfQuestions - 1) {
    return (
      <button
        onClick={() => dispatch({ type: "finish" })}
        className="btn h-12 border-0 bg-[#d9b77e] px-6 text-[#45351d] hover:bg-[#cba96f]"
      >
        Finish Quiz
        <RiFlagLine size={19} />
      </button>
    );
  }
}
