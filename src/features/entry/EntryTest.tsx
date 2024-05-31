import React, { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { useAppDispatch } from "../../app/hooks";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";
import { setLoading } from "../../redux/globalSlice";
import testApi from "../../api/testApi";
import { TestDetail } from "../../models/test";
import logo from "../../assets/images/logo.png";
import SentenseReading from "./components/SentenseReading";
import { showSuccessModal } from "../../components/modals/CommonModals";
import { useNavigate } from "react-router-dom";

interface EntryTestProps {}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const getLevel = (points: number) => {
  if (points <= 5) {
    return "A1";
  } else if (points > 5 && points <= 15) {
    return "A2";
  } else if (points > 15 && points <= 30) {
    return "B1";
  } else if (points > 30 && points <= 50) {
    return "B2";
  } else if (points > 50 && points <= 75) {
    return "C1";
  } else {
    return "C2";
  }
};

const EntryTest: React.FunctionComponent<EntryTestProps> = () => {
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();
  const navigate = useNavigate();

  const [test, setTest] = useState<TestDetail | null>(null);
  const [isStarted, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const handlSubmit = async () => {
    if (!test) return;

    dispatch(setLoading("ADD"));
    const { ok, error, body } = await testApi.submitEntry({
      testId: test.id,
      answerIds: Object.values(answers),
    });
    dispatch(setLoading("REMOVE"));

    if (ok && body) {
      showSuccessModal({
        title: "Notification",
        content: `You got ${body.correctQuestions} out of a total of ${
          body.totalQuestions
        } questions correct and get ${getLevel(body.totalPoints)} level.`,
        onOk: () => navigate("/"),
      });

      return;
    }

    handleResponseError(error);
  };

  const handleAnswerClick = (answerId: number, questionId: number) => {
    if (!test) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleNext = () => {
    if (!test) return;
    if (currentQuestion === test.questions.length - 1) {
      handlSubmit();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    setStarted(true);
    setCount(2700);
    setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
  };

  const fetchData = async () => {
    dispatch(setLoading("ADD"));
    const { ok, error, body } = await testApi.getEntryTest();
    dispatch(setLoading("REMOVE"));

    if (ok && body) {
      setTest(body);
      return;
    }

    handleResponseError(error);
  };

  useEffectOnce(() => {
    fetchData();
  });

  return test ? (
    <div className="entry-test">
      <div className="entry-test__header">
        <div className="flex-row items-center gap-2">
          <img className="logo" src={logo} alt="logo" />
          <div className="website-name">
            <p>Ielts Tinder</p>
            <p>Communication</p>
          </div>
        </div>
        <span className="count-down">{formatTime(count)}</span>
      </div>
      <div className="entry-test__content">
        {isStarted ? (
          <div className="questions-area">
            {test.questions[currentQuestion].type === "SENTENCE_READING" && (
              <SentenseReading
                handleAnswerClick={handleAnswerClick}
                question={test.questions[currentQuestion]}
                active={
                  answers[test.questions[currentQuestion].questionDetails[0].id]
                }
              />
            )}
            <div className="entry-test__content__footer">
              <button onClick={handleNext}>
                {currentQuestion === test.questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </div>
        ) : (
          <div className="notification-entry">
            <span>You have 45 minutes to complete this test.</span>
            <button onClick={handleStart}>Start</button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>Something error</div>
  );
};

export default EntryTest;
