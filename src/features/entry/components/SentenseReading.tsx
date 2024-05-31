import classNames from "classnames";
import React from "react";
import { Question } from "../../../models/test";
import { getQuestion } from "../../../utils/questionUtils";

interface SentenseReadingProps {
  question: Question;
  handleAnswerClick: (answerId: number, questionId: number) => void;
  active: number | null;
}

const SentenseReading: React.FunctionComponent<SentenseReadingProps> = ({
  question,
  active,
  handleAnswerClick,
}) => {
  return (
    <div className="sentense-reading">
      <span className="text">
        {getQuestion(question.questionDetails[0].text)}
      </span>
      <div className="answers">
        {question.questionDetails[0].answers.map((answer) => (
          <button
            key={`sentense-reading-question-${question.id}-${answer.id}`}
            className={classNames("answer", { active: active === answer.id })}
            onClick={() =>
              handleAnswerClick(answer.id, question.questionDetails[0].id)
            }
          >
            {answer.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SentenseReading;
