import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectOnce } from "usehooks-ts";
import testApi from "../../../api/testApi";
import { useAppDispatch } from "../../../app/hooks";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { TestDetail } from "../../../models/test";
import { setLoading } from "../../../redux/globalSlice";
import SentenseReading from "../../entry/components/SentenseReading";
import ParagraphReading from "../../entry/components/ParagraphReading";

interface StartTestProps {}

const StartTest: React.FunctionComponent<StartTestProps> = () => {
  const dispatch = useAppDispatch();
  const handlResponseError = useHandleResponseError();
  const navigate = useNavigate();
  const { id } = useParams();
  const [test, setTest] = useState<TestDetail | null>(null);
  const [seconds, setSeconds] = useState<number>(3600);
  const [result, setResult] = useState<{ [key: number]: number }>({});

  const handleAnswerClick = (answerId: number, questionId: number) => {
    if (!test) return;
    setResult((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = async () => {
    // if (!test) return;
    // dispatch(setLoading("ADD"));
    // const { ok, error } = await testApi.submitTest({
    //   userId,
    //   testId: test.id,
    //   result: amountRight / test.questions.length,
    //   time: seconds,
    // });
    // dispatch(setLoading("REMOVE"));
    // if (ok) {
    //   showSuccessModal({
    //     title: "Notification",
    //     content: `You get right ${(amountRight / test.questions.length).toFixed(
    //       2
    //     )}% of this test.`,
    //     onOk: () => {},
    //   });
    // } else {
    //   handlResponseError(error);
    // }
    // navigate("/practice");
  };

  const fetchData = async () => {
    if (isNaN(Number(id))) {
      navigate("/practice");
      return;
    }

    dispatch(setLoading("ADD"));
    const { ok, body, error } = await testApi.getTest(Number(id));
    dispatch(setLoading("REMOVE"));

    if (ok && body) {
      setTest(body);
    } else {
      handlResponseError(error);
    }
  };

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffectOnce(() => {
    fetchData();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return test ? (
    <div className="test-detail">
      <div className="test-detail__header">
        <h3>{test.title}</h3>
      </div>
      <div className="test-detail__content">
        {test.questions.map((q) =>
          q.type === "SENTENCE_READING" ? (
            <SentenseReading
              question={q}
              handleAnswerClick={handleAnswerClick}
              active={result[q.questionDetails[0].id]}
            />
          ) : (
            <Fragment>
              {q.type === "PARAGRAPH_READING" ? (
                <ParagraphReading
                  question={q}
                  handleAnswerClick={handleAnswerClick}
                  result={result}
                />
              ) : null}
            </Fragment>
          )
        )}
      </div>

      <div className="test-detail__footer">
        <div className="card-submit">
          <span>{`Time: ${formatTime(seconds)}`}</span>
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default StartTest;
