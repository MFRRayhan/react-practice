import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "openAccount":
      return "";

    case "deposit":
      return "";

    case "withdraw":
      return "";

    case "loanRequest":
      return "";

    case "payLoan":
      return "";

    case "closeAccount":
      return "";

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
        <h2>Balance - X</h2>
        <h3>Loan - X</h3>
      </header>

      <main className="flex flex-col space-y-3">
        <button className="btn btn-outline" onClick={() => {}} disabled={false}>
          Open Account
        </button>
        <button className="btn btn-outline" onClick={() => {}} disabled={false}>
          Deposit
        </button>
        <button className="btn btn-outline" onClick={() => {}} disabled={false}>
          Withdraw
        </button>
        <button className="btn btn-outline" onClick={() => {}} disabled={false}>
          Request a loan of 5000
        </button>
        <button className="btn btn-outline" onClick={() => {}} disabled={false}>
          Pay Loan
        </button>
        <button className="btn btn-outline" onClick={() => {}} disabled={false}>
          Close Account
        </button>
      </main>
    </div>
  );
}
