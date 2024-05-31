import React, { useState } from "react";
import { QuestionModel } from "../../../models/question";

interface QuestionProps {
  question: QuestionModel;
  index: number;
  type: "LISTENING" | "READING";
  handleResultClick: (questionId: number, answerId: number) => void;
}

const Question: React.FunctionComponent<QuestionProps> = ({
  question,
  index,
  type,
  handleResultClick,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    answerId: number
  ) => {
    setSelectedValue(event.target.value);
    handleResultClick(question.id, answerId);
  };

  return (
    <div className="question">
      {type === "LISTENING" && (
        <audio autoPlay={false} controls src={question.resource} />
      )}
      <p>
        <span style={{ fontWeight: 600, fontSize: "16px" }}>{`Question ${
          index + 1
        }: `}</span>
        {question.question}
      </p>
      <div className="answers">
        <span style={{ fontWeight: 600 }}>Answers: </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            gap: "5px",
          }}
        >
          {question.answers.map((answer) => (
            <div
              key={`container-question-${question.id}-answer-${answer.id}`}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <input
                type="radio"
                id={`question-${question.id}-answer-${answer.id}`}
                value={`question-${question.id}-answer-${answer.id}`}
                name={`question-${question.id}`}
                onChange={(e) => handleRadioChange(e, answer.id)}
                checked={
                  selectedValue ===
                  `question-${question.id}-answer-${answer.id}`
                }
              />
              <label
                htmlFor={`question-${question.id}-answer-${answer.id}`}
                style={{ fontSize: "16px" }}
              >
                {answer.content}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Question;
