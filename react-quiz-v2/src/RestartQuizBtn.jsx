import { RiRestartLine } from "react-icons/ri";

export default function RestartQuizBtn({ dispatch }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={() => dispatch({ type: "restart" })}
        className="btn h-12 border border-[#dce6df] bg-white px-7 text-brand hover:border-brand hover:bg-brand-light"
      >
        <RiRestartLine size={19} />
        Try Again
      </button>
    </div>
  );
}
