# React Quiz App

An interactive quiz application built with React to practice and explore React fundamentals, component-based architecture, state management, and React Hooks.

The application allows users to answer multiple-choice questions, track their scores, and complete the quiz within a limited time.

## ✨ Features

- Interactive multiple-choice quiz.
- Dynamic question and answer navigation.
- Countdown timer for each question.
- Real-time score calculation.
- High score tracking.
- Progress indicator to track quiz completion.
- Answer selection with visual feedback.
- Final score summary after completing the quiz.
- Restart functionality to play again.
- Loading and error handling.
- Responsive and user-friendly interface.

## 🛠️ Technologies Used

- React
- JavaScript (ES6+)
- React Hooks:
  - `useEffect`
  - `useReducer`
- Tailwind CSS v4
- DaisyUI
- React Icons
- JSON Server

## 🧠 React Concepts Practiced

- Component-based architecture
- Props and state management
- Conditional rendering
- Event handling
- State management with `useReducer`
- Side effects and cleanup with `useEffect`
- Fetching data from a local API
- Immutable state updates
- Component mounting and unmounting
- Managing intervals with `setInterval` and `clearInterval`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd React-Practice/01-react-quiz
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start JSON Server

```bash
npm run server
```

### 5. Start the Development Server

Open another terminal and run:

```bash
npm run dev
```

## 📁 Project Structure

```text
01-react-quiz/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── data/
│   └── questions.json
│
├── package.json
└── README.md
```

## 🎮 How It Works

1. Start the quiz.
2. Read each question and select an answer.
3. Move through the questions using the navigation controls.
4. Complete each question before the timer runs out.
5. View your final score and high score.
6. Restart the quiz to try again.

---

**Built with React. Practiced with purpose.**
