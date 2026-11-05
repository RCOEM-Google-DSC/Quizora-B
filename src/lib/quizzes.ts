export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  q: string;
  options: [string, string, string, string];
  answer: number; // index of the correct option
};

export type Quiz = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  questions: Question[];
};

// Seconds allowed for each question.
export const QUESTION_SECONDS = 20;

export const quizzes: Quiz[] = [
  {
    id: "react-hooks",
    title: "react hooks",
    category: "tech",
    difficulty: "easy",
    questions: [
      { q: "Which hook runs after every render by default?", options: ["useMemo", "useEffect", "useRef", "useId"], answer: 1 },
      { q: "Which hook keeps a value between renders without causing a re-render?", options: ["useState", "useRef", "useEffect", "useContext"], answer: 1 },
      { q: "Which hook adds state to a function component?", options: ["useState", "useMemo", "useId", "useRef"], answer: 0 },
    ],
  },
  {
    id: "world-capitals",
    title: "world capitals",
    category: "geography",
    difficulty: "medium",
    questions: [
      { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
      { q: "What is the capital of Canada?", options: ["Toronto", "Ottawa", "Vancouver", "Montreal"], answer: 1 },
      { q: "What is the capital of Brazil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], answer: 2 },
    ],
  },
  {
    id: "space-and-planets",
    title: "space and planets",
    category: "science",
    difficulty: "medium",
    questions: [
      { q: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Mars", "Earth"], answer: 1 },
      { q: "Which is the largest planet in our solar system?", options: ["Saturn", "Neptune", "Jupiter", "Uranus"], answer: 2 },
      { q: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Mercury"], answer: 0 },
    ],
  },
  {
    id: "web-security",
    title: "web security",
    category: "tech",
    difficulty: "hard",
    questions: [
      { q: "What does XSS stand for?", options: ["Cross-Site Scripting", "Extra Secure Sockets", "XML Style Sheets", "Cross-Server Sync"], answer: 0 },
      { q: "Which header tells browsers to only use HTTPS?", options: ["X-Frame-Options", "Strict-Transport-Security", "Content-Length", "Accept"], answer: 1 },
      { q: "What is the safest way to store passwords?", options: ["Plain text", "Reversible encryption", "A salted hash (bcrypt or argon2)", "Base64"], answer: 2 },
    ],
  },
  {
    id: "cricket-legends",
    title: "cricket legends",
    category: "sports",
    difficulty: "easy",
    questions: [
      { q: "Which country won the 2011 Cricket World Cup?", options: ["Australia", "India", "Sri Lanka", "England"], answer: 1 },
      { q: "How many players does one cricket team field?", options: ["9", "10", "11", "12"], answer: 2 },
      { q: "Which batter is nicknamed the Master Blaster?", options: ["Rahul Dravid", "Sachin Tendulkar", "Virat Kohli", "MS Dhoni"], answer: 1 },
    ],
  },
  {
    id: "indian-history",
    title: "indian history",
    category: "history",
    difficulty: "hard",
    questions: [
      { q: "Who was the first Prime Minister of independent India?", options: ["Jawaharlal Nehru", "Sardar Patel", "B. R. Ambedkar", "Rajendra Prasad"], answer: 0 },
      { q: "In which year did India gain independence?", options: ["1942", "1947", "1950", "1952"], answer: 1 },
      { q: "Who led the Dandi Salt March in 1930?", options: ["Subhas Chandra Bose", "Bhagat Singh", "Mahatma Gandhi", "Lala Lajpat Rai"], answer: 2 },
    ],
  },
];

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id);
}