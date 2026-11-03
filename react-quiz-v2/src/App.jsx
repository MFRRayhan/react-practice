import { useEffect, useReducer } from "react";
import Header from "./Header";
import Primary from "./Primary";
import StartScreen from "./StartScreen";
import Loader from "./Loader";
import Question from "./Question";
import NextBtn from "./NextBtn";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import RestartQuizBtn from "./RestartQuizBtn";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: "loading", // loading, error, ready, active, finished
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  // console.log(state, action);

  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer": {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }

    case "newQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  const numOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0,
  );

  return (
    <div className="min-h-screen bg-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-2xl flex-col">
        <Header />

        <Primary>
          {status === "loading" && <Loader />}

          {status === "error" && <Error />}

          {status === "ready" && (
            <StartScreen dispatch={dispatch} numOfQuestions={numOfQuestions} />
          )}

          {status === "active" && (
            <>
              <Progress
                index={index}
                numOfQuestions={numOfQuestions}
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              />

              <Question
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />

              <div className="mt-8 flex items-center justify-between gap-4">
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />

                <NextBtn
                  dispatch={dispatch}
                  answer={answer}
                  numOfQuestions={numOfQuestions}
                  index={index}
                />
              </div>
            </>
          )}

          {status === "finished" && (
            <>
              <FinishScreen
                maxPossiblePoints={maxPossiblePoints}
                points={points}
                highScore={highScore}
              />

              <RestartQuizBtn dispatch={dispatch} />
            </>
          )}
        </Primary>
      </div>
    </div>
  );
}
