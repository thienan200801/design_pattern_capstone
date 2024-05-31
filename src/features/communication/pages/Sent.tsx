import { Pagination } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import requestApi from "../../../api/requestApi";
import { useAppDispatch } from "../../../app/hooks";
import { Empty } from "../../../components/commons";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { RequestModel } from "../../../models/request";
import { setLoading } from "../../../redux/globalSlice";
import UserCart from "../components/UserCart";

interface SentProps {}

interface DataProps {
  requests: RequestModel[];
  totalUsers: number;
}

const Sent: React.FunctionComponent<SentProps> = () => {
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();

  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<DataProps>({ requests: [], totalUsers: 0 });
  const [statusButtons, setStatusButtons] = useState<boolean[]>([
    true,
    true,
    true,
  ]);

  const onChangePage = (value: number) => {
    setPage(value);
  };

  const updateStatusButtons = (index: number) => {
    setStatusButtons((prev) => {
      const temp = [...prev];
      temp[index] = !prev[index];
      return temp;
    });
  };

  const fetchData = async (page: number) => {
    setStatusButtons([true, true, true]);
    dispatch(setLoading("ADD"));
    const { ok, body, error, pagination } = await requestApi.getSentRequests({
      size: 3,
      page: page - 1,
    });
    dispatch(setLoading("REMOVE"));

    if (ok && body && pagination) {
      setData({ requests: body, totalUsers: pagination.total });
    } else {
      handleResponseError(error);
    }
  };

  useEffect(() => {
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Fragment>
      {data.totalUsers ? (
        <Fragment>
          <div className="user-list">
            {data.requests.map((request, index) => (
              <UserCart
                user={request.targetUser}
                key={`user-${request.targetUser.id}`}
                index={index}
                statusButtons={statusButtons}
                updateStatusButtons={updateStatusButtons}
                type={"SEND_CANCEL"}
                afterUnfriend={() => {}}
              />
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
        </Fragment>
      ) : (
        <Empty />
      )}
    </Fragment>
  );
};

export { Sent };
