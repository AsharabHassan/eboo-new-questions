import { QuizProvider } from "@/lib/quiz-store";
import { QuizFlow } from "@/components/quiz/quiz-flow";

export const metadata = {
  title: "Assessment · HSW EBOO",
};

export default function QuizPage() {
  return (
    <QuizProvider>
      <QuizFlow />
    </QuizProvider>
  );
}
