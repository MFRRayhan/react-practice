import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

const depositAmount = 150;
const withdrawAmount = 50;
const loanAmount = 5000;

const reducer = (state, action) => {
  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        isActive: true,
        balance: 500,
      };

    case "deposit":
      return {
        ...state,
        balance: state.balance + depositAmount,
      };

    case "withdraw":
      return { ...state, balance: state.balance - withdrawAmount };

    case "loanRequest":
      return { ...state, loan: state.loan + loanAmount };

    case "payLoan":
      return { ...state, loan: state.loan - loanAmount };

    case "closeAccount":
      if (state.loan === 0 && state.balance === 0) return initialState;
      return state;

    default:
      throw new Error("Unknown Action");
  }
};

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-5">
      <header>
        <h1>Bank Account</h1>
        <h2>Balance - {balance}</h2>
        <h3>Loan - {loan}</h3>
      </header>

      <main className="flex flex-col space-y-3">
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch({ type: "openAccount" });
          }}
          disabled={isActive}
        >
          Open Account
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch({ type: "deposit" });
          }}
          disabled={!isActive}
        >
          Deposit - 150
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch({ type: "withdraw" });
          }}
          disabled={!isActive || balance === 0}
        >
          Withdraw - 50
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch({ type: "loanRequest" });
          }}
          disabled={!isActive || loan > 0}
        >
          Request a loan of 5000
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch({ type: "payLoan" });
          }}
          disabled={!isActive}
        >
          Pay Loan
        </button>
        <button
          className="btn btn-outline"
          onClick={() => {
            dispatch({ type: "closeAccount" });
            alert("Account Closed");
          }}
          disabled={!isActive}
        >
          Close Account
        </button>
      </main>
    </div>
  );
}
