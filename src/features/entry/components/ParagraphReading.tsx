import React from "react";
import { Question } from "../../../models/test";
import QuestionOfPara from "./QuestionOfPara";

interface ParagraphReadingProps {
  question: Question;
  handleAnswerClick: (answerId: number, questionId: number) => void;
  result: { [key: number]: number };
}

const ParagraphReading: React.FunctionComponent<ParagraphReadingProps> = ({
  question,
  handleAnswerClick,
  result,
}) => {
  return (
    <div className="paragraph-reading">
      <div className="paragraph">
        <p>{question.paragraph}</p>
      </div>
      <div className="questions">
        {question.questionDetails.map((questionDetail) => (
          <QuestionOfPara
            questionDetail={questionDetail}
            handleAnswerClick={handleAnswerClick}
            active={result[questionDetail.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default ParagraphReading;
