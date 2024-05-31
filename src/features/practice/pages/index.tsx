import { Pagination, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import testApi from "../../../api/testApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { showConfirmModal } from "../../../components/modals/CommonModals";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { TestModel } from "../../../models/test";
import { selectProfile, setLoading } from "../../../redux/globalSlice";

interface PracticePageProps {}

const getLevels = (level: string | undefined) => {
  if (!level) return "A1,A2,B1,B2,C1,C2";
  if (level === "A1") return "A1";
  if (level === "A2") return "A1,A2";
  if (level === "B1") return "A1,A2,B1";
  if (level === "B2") return "A1,A2,B1,B2";
  if (level === "C1") return "A1,A2,B1,B2,C1";
  if (level === "C2") return "A1,A2,B1,B2,C1,C2";
};

interface DataProps {
  tests: TestModel[];
  totalUsers: number;
}

const PracticePage: React.FunctionComponent<PracticePageProps> = () => {
  const dispatch = useAppDispatch();
  const handlResponseError = useHandleResponseError();
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);

  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<DataProps>({ tests: [], totalUsers: 0 });

  const onChangePage = (value: number) => {
    setPage(value);
  };

  const onOk = (testId: number) => {
    navigate(`/practice/test/${testId}`);
  };

  const handleStart = (testId: number) => {
    showConfirmModal({
      title: "Notification",
      content: "Do you want to start this test?",
      onOk: () => onOk(testId),
    });
  };

  const fetchData = async (page: number) => {
    dispatch(setLoading("ADD"));
    const { ok, body, error, pagination } = await testApi.getTests({
      size: 3,
      page: page - 1,
      "level.in": getLevels(profile?.level),
    });
    dispatch(setLoading("REMOVE"));

    if (ok && body && pagination) {
      setData({ tests: body, totalUsers: pagination.total });
    } else {
      handlResponseError(error);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="test-page">
      <div className="tests">
        {data.tests.map((test) => (
          <div key={test.key} className="test">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p className="test-name">{test.name}</p>
              <p className="test-level">
                <span>Level: </span>
                <Tag
                  className="tag"
                  color={
                    ["A1", "A2"].includes(test.level)
                      ? "success"
                      : ["B1", "B2"].includes(test.level)
                      ? "warning"
                      : "error"
                  }
                >
                  {test.level}
                </Tag>
              </p>
              {/* <div className="amount-participant">
                <FaUserEdit />
                <span>123</span>
              </div> */}
            </div>
            <button className="btn-start" onClick={() => handleStart(test.id)}>
              Start
            </button>
          </div>
        ))}
      </div>
      <div className="control-buttons">
        <Pagination
          current={page}
          total={data.totalUsers}
          pageSize={3}
          hideOnSinglePage
          onChange={onChangePage}
        />
      </div>
    </div>
  );
};

export default PracticePage;
