import { useReducer } from "react";
import { AiFillWallet } from "react-icons/ai";
import {
  FiActivity,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiCreditCard,
  FiDollarSign,
  FiPlus,
  FiShield,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";
import Swal from "sweetalert2";

// Initial State
const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

// Transaction Amounts
const depositAmount = 150;
const withdrawAmount = 50;
const loanAmount = 5000;

// Reducer
const reducer = (state, action) => {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount":
      if (state.isActive) return state;

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
      if (state.balance - withdrawAmount >= state.loan) {
        return {
          ...state,
          balance: state.balance - withdrawAmount,
        };
      }
      return state;

    case "loanRequest":
      if (state.loan > 0) return state;

      return {
        ...state,
        loan: loanAmount,
        balance: state.balance + loanAmount,
      };

    case "payLoan":
      if (state.balance < state.loan || state.loan === 0) return state;

      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0,
      };

    case "closeAccount":
      if (state.balance === 0 && state.loan === 0) {
        return { ...initialState };
      }
      return state;

    default:
      throw new Error("Unknown Action");
  }
};

// Currency Formatter
const formatMoney = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

// Toast Notification
const showToast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const availableBalance = Math.max(balance - loan, 0);

  const canWithdraw = isActive && balance - withdrawAmount >= loan;

  const canPayLoan = isActive && loan > 0 && balance >= loan;

  const canCloseAccount = isActive && balance === 0 && loan === 0;

  // Deposit
  const handleDeposit = () => {
    dispatch({ type: "deposit" });
    showToast("success", "৳150 deposited successfully!");
  };

  // Withdraw
  const handleWithdraw = () => {
    if (!canWithdraw) return;

    dispatch({ type: "withdraw" });
    showToast("success", "৳50 withdrawn successfully!");
  };

  // Loan Request
  const handleLoanRequest = () => {
    dispatch({ type: "loanRequest" });
    showToast("success", "Loan of ৳5,000 approved!");
  };

  // Pay Loan
  const handlePayLoan = async () => {
    if (!canPayLoan) {
      Swal.fire({
        icon: "warning",
        title: "Insufficient Balance",
        text: "You don't have enough available funds to repay your loan.",
        confirmButtonColor: "#059669",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Repay Your Loan?",
      text: `Are you sure you want to repay ${formatMoney(loan)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Pay Loan",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      dispatch({ type: "payLoan" });

      Swal.fire({
        icon: "success",
        title: "Loan Repaid!",
        text: "Your outstanding loan has been fully paid.",
        confirmButtonColor: "#059669",
      });
    }
  };

  // Open Account
  const handleOpenAccount = () => {
    dispatch({ type: "openAccount" });
    showToast("success", "Your bank account is now active!");
  };

  // Close Account
  const handleCloseAccount = async () => {
    if (!canCloseAccount) return;

    const result = await Swal.fire({
      title: "Close Your Account?",
      text: "This action will permanently close your bank account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Close Account",
      cancelButtonText: "Keep Account",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
    });

    if (result.isConfirmed) {
      dispatch({ type: "closeAccount" });

      Swal.fire({
        icon: "success",
        title: "Account Closed",
        text: "Your bank account has been successfully closed.",
        confirmButtonColor: "#059669",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <FiDollarSign size={24} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                FinBank
              </h1>
              <p className="text-xs font-medium tracking-wider text-slate-400">
                PERSONAL BANKING
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
            <FiShield className="text-emerald-600" size={16} />
            <span className="text-xs font-semibold text-slate-600">
              Secure Banking
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10 lg:px-8">
        {/* Welcome Section */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-600">
              YOUR FINANCIAL OVERVIEW
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Dashboard
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Manage your money with confidence and simplicity.
            </p>
          </div>

          <div
            className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isActive ? "animate-pulse bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {isActive ? "Account Active" : "Account Inactive"}
          </div>
        </section>

        {/* Balance Cards */}
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Main Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-7 text-white shadow-xl shadow-slate-900/10 lg:col-span-2">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
            <div className="absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <AiFillWallet size={18} />
                Total Account Balance
              </div>

              <FiCreditCard size={25} className="text-emerald-400" />
            </div>

            <div className="relative z-10 mt-8">
              <p className="text-sm text-slate-400">Available Balance</p>

              <h3 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {formatMoney(balance)}
              </h3>

              <p className="mt-3 text-xs text-slate-400">
                {isActive
                  ? "Your current account balance"
                  : "Open an account to get started"}
              </p>
            </div>

            <div className="relative z-10 mt-9 flex items-center justify-between border-t border-white/10 pt-5">
              <div>
                <p className="text-xs text-slate-400">Account Type</p>
                <p className="mt-1 text-sm font-semibold">Personal Savings</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Account Status</p>
                <p className="mt-1 text-sm font-semibold text-emerald-400">
                  {isActive ? "Active" : "Not Opened"}
                </p>
              </div>
            </div>
          </div>

          {/* Available Balance */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiTrendingUp size={23} />
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                Available
              </span>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-slate-500">
                Withdrawable Funds
              </p>

              <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {formatMoney(availableBalance)}
              </h3>

              <p className="mt-3 text-xs text-slate-400">
                Balance excluding outstanding loan reserves
              </p>
            </div>
          </div>

          {/* Loan Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FiCreditCard size={22} />
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Outstanding
              </span>
            </div>

            <p className="mt-6 text-sm font-medium text-slate-500">
              Outstanding Loan
            </p>

            <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
              {formatMoney(loan)}
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              {loan > 0 ? "Repayment pending" : "No outstanding loan"}
            </p>
          </div>

          {/* Account Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiActivity size={22} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Account Overview</h3>
                <p className="text-xs text-slate-400">
                  Your current banking status
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Account Balance
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {formatMoney(balance)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Loan Liability
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {formatMoney(loan)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Banking Actions */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Banking Operations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your account and perform transactions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Open Account */}
            <button
              onClick={handleOpenAccount}
              disabled={isActive}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                <FiPlus size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Open Account</h3>
                <p className="mt-1 text-xs text-slate-500">Start with ৳500</p>
              </div>
            </button>

            {/* Deposit */}
            <button
              onClick={handleDeposit}
              disabled={!isActive}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <FiArrowDownLeft size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Deposit Funds</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Add ৳150 to balance
                </p>
              </div>
            </button>

            {/* Withdraw */}
            <button
              onClick={handleWithdraw}
              disabled={!canWithdraw}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition group-hover:bg-rose-600 group-hover:text-white">
                <FiArrowUpRight size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Withdraw Funds</h3>
                <p className="mt-1 text-xs text-slate-500">Withdraw ৳50</p>
              </div>
            </button>

            {/* Request Loan */}
            <button
              onClick={handleLoanRequest}
              disabled={!isActive || loan > 0}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                <FiDollarSign size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Request a Loan</h3>
                <p className="mt-1 text-xs text-slate-500">Get ৳5,000 loan</p>
              </div>
            </button>

            {/* Pay Loan */}
            <button
              onClick={handlePayLoan}
              disabled={!canPayLoan}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                <FiCheckCircle size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Repay Loan</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {loan > 0 ? formatMoney(loan) : "No loan to repay"}
                </p>
              </div>
            </button>

            {/* Close Account */}
            <button
              onClick={handleCloseAccount}
              disabled={!canCloseAccount}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-rose-600 group-hover:text-white">
                <FiXCircle size={24} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">Close Account</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Permanently close account
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Security Notice */}
        <section className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <FiShield size={23} />
          </div>

          <div>
            <h3 className="font-bold text-emerald-900">
              Your money, your control.
            </h3>
            <p className="mt-1 text-sm text-emerald-800/70">
              Loan reserves are protected. Withdrawals are restricted to your
              available balance, ensuring your outstanding loan remains covered.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-center sm:flex-row sm:text-left lg:px-8">
          <p className="text-sm font-semibold text-slate-600">
            FinBank{" "}
            <span className="font-normal text-slate-400">&copy; 2026</span>
          </p>

          <p className="text-xs text-slate-400">
            Built with React, Tailwind CSS & DaisyUI
          </p>
        </div>
      </footer>
    </div>
  );
}
