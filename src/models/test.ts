import { QuestionModel } from "./question";

export interface TestModel {
  key: string;
  id: number;
  name: string;
  level: "EASY" | "MEDIUM";
}

export interface TestDetailModel {
  id: number;
  name: string;
  level: "EASY" | "MEDIUM";
  questions: QuestionModel[];
  image: string | null;
  paragraph: string | null;
}

export interface SubmitTestRequest {
  userId: number;
  testId: number;
  result: number;
  time: number;
}

export interface TestDetail {
  id: number;
  title: string;
  difficultyLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ENTRY_TEST";
  questions: Question[];
}

export interface Question {
  id: number;
  paragraph: string | null;
  audioUrl: string | null;
  type:
    | "MULTIPLE_LISTENING"
    | "SINGLE_LISTENING"
    | "PARAGRAPH_READING"
    | "SENTENCE_READING";
  questionDetails: QuestionDetail[];
}

export interface QuestionDetail {
  id: number;
  text: string;
  explain: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface EntryTestSubmitResponse {
  totalQuestions: number;
  correctQuestions: number;
  totalPoints: number;
}

export interface EntryTestSubmitRequest {
  testId: number;
  answerIds: number[];
}
