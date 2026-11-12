export default function App() {
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
