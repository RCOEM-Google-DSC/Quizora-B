export type Difficulty = "easy" | "medium" | "hard";
export type QuizStatus = "upcoming" | "live" | "finished";

export type Question = {
  q: string;
  options: [string, string, string, string];
  answer: number; // index of the correct option
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  // TODO: compute from startsAt / endsAt with server time once the backend is connected.
  status: QuizStatus;
  startsAt: string;
  endsAt: string;
  marksPerQuestion: number;
  secondsPerQuestion: number;
  featured?: boolean;
  questions: Question[];
};

const q = (text: string, options: [string, string, string, string], answer: number): Question => ({ q: text, options, answer });

export const totalMarks = (quiz: Quiz) => quiz.questions.length * quiz.marksPerQuestion;
export const totalSeconds = (quiz: Quiz) => quiz.questions.length * quiz.secondsPerQuestion;
export function formatTime(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

export const quizzes: Quiz[] = [
  {
    id: "react-hooks", title: "react hooks", description: "Check how well you know the hooks every React developer uses daily.",
    category: "tech", difficulty: "easy", status: "live", featured: true,
    startsAt: "Nov 5, 9:00 AM", endsAt: "Nov 12, 11:59 PM", marksPerQuestion: 2, secondsPerQuestion: 20,
    questions: [
      q("Which hook runs after every render by default?", ["useMemo", "useEffect", "useRef", "useId"], 1),
      q("Which hook keeps a value between renders without causing a re-render?", ["useState", "useRef", "useEffect", "useContext"], 1),
      q("Which hook adds state to a function component?", ["useState", "useMemo", "useId", "useRef"], 0),
      q("Which hook reads a React context value?", ["useContext", "useReducer", "useCallback", "useLayoutEffect"], 0),
    ],
  },
  {
    id: "world-capitals", title: "world capitals", description: "Capitals people mix up all the time. Do you know them?",
    category: "geography", difficulty: "medium", status: "live",
    startsAt: "Nov 4, 10:00 AM", endsAt: "Nov 10, 6:00 PM", marksPerQuestion: 2, secondsPerQuestion: 20,
    questions: [
      q("What is the capital of Australia?", ["Sydney", "Melbourne", "Canberra", "Perth"], 2),
      q("What is the capital of Canada?", ["Toronto", "Ottawa", "Vancouver", "Montreal"], 1),
      q("What is the capital of Brazil?", ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], 2),
      q("What is the capital of Japan?", ["Kyoto", "Osaka", "Tokyo", "Nagoya"], 2),
    ],
  },
  {
    id: "space-and-planets", title: "space and planets", description: "A quick tour of our solar system.",
    category: "science", difficulty: "medium", status: "upcoming",
    startsAt: "Nov 8, 10:00 AM", endsAt: "Nov 15, 10:00 PM", marksPerQuestion: 3, secondsPerQuestion: 25,
    questions: [
      q("Which planet is closest to the Sun?", ["Venus", "Mercury", "Mars", "Earth"], 1),
      q("Which is the largest planet in our solar system?", ["Saturn", "Neptune", "Jupiter", "Uranus"], 2),
      q("Which planet is known as the Red Planet?", ["Mars", "Venus", "Jupiter", "Mercury"], 0),
      q("Which planet has the most famous rings?", ["Saturn", "Mars", "Mercury", "Venus"], 0),
    ],
  },
  {
    id: "web-security", title: "web security", description: "Common attacks and the habits that stop them.",
    category: "tech", difficulty: "hard", status: "live",
    startsAt: "Nov 3, 8:00 AM", endsAt: "Nov 9, 8:00 PM", marksPerQuestion: 4, secondsPerQuestion: 30,
    questions: [
      q("What does XSS stand for?", ["Cross-Site Scripting", "Extra Secure Sockets", "XML Style Sheets", "Cross-Server Sync"], 0),
      q("Which header tells browsers to only use HTTPS?", ["X-Frame-Options", "Strict-Transport-Security", "Content-Length", "Accept"], 1),
      q("What is the safest way to store passwords?", ["Plain text", "Reversible encryption", "A salted hash (bcrypt or argon2)", "Base64"], 2),
      q("What does HTTPS add to HTTP?", ["Faster pages", "Encryption with TLS", "Bigger images", "Free hosting"], 1),
    ],
  },
  {
    id: "cricket-legends", title: "cricket legends", description: "Players, records and moments from the game.",
    category: "sports", difficulty: "easy", status: "finished",
    startsAt: "Oct 28, 9:00 AM", endsAt: "Nov 2, 9:00 PM", marksPerQuestion: 2, secondsPerQuestion: 20,
    questions: [
      q("Which country won the 2011 Cricket World Cup?", ["Australia", "India", "Sri Lanka", "England"], 1),
      q("How many players does one cricket team field?", ["9", "10", "11", "12"], 2),
      q("Which batter is nicknamed the Master Blaster?", ["Rahul Dravid", "Sachin Tendulkar", "Virat Kohli", "MS Dhoni"], 1),
      q("How many runs is a six?", ["4", "5", "6", "8"], 2),
    ],
  },
  {
    id: "indian-history", title: "indian history", description: "From the freedom movement to the first government.",
    category: "history", difficulty: "hard", status: "upcoming",
    startsAt: "Nov 10, 11:00 AM", endsAt: "Nov 20, 11:00 PM", marksPerQuestion: 4, secondsPerQuestion: 30,
    questions: [
      q("Who was the first Prime Minister of independent India?", ["Jawaharlal Nehru", "Sardar Patel", "B. R. Ambedkar", "Rajendra Prasad"], 0),
      q("In which year did India gain independence?", ["1942", "1947", "1950", "1952"], 1),
      q("Who led the Dandi Salt March in 1930?", ["Subhas Chandra Bose", "Bhagat Singh", "Mahatma Gandhi", "Lala Lajpat Rai"], 2),
      q("Which movement did Gandhi launch in 1942?", ["Quit India Movement", "Non-Cooperation Movement", "Civil Disobedience Movement", "Swadeshi Movement"], 0),
    ],
  },
];

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}