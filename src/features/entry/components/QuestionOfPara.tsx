import React from "react";
import { QuestionDetail } from "../../../models/test";
import classNames from "classnames";

interface QuestionOfParaProps {
  questionDetail: QuestionDetail;
  handleAnswerClick: (anserId: number, questionId: number) => void;
  active: number | null;
}

const QuestionOfPara: React.FunctionComponent<QuestionOfParaProps> = ({
  questionDetail,
  handleAnswerClick,
  active,
}) => {
  return (
    <div className="quetion-of-para">
      <p style={{ whiteSpace: "pre-line" }}>{questionDetail.text}</p>
      <div className="answers">
        {questionDetail.answers.map((answer) => (
          <button
            key={`sentense-reading-question-${questionDetail.id}-${answer.id}`}
            className={classNames("answer", { active: active === answer.id })}
            onClick={() => handleAnswerClick(answer.id, questionDetail.id)}
          >
            {answer.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionOfPara;
