import { Pagination } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import requestApi from "../../../api/requestApi";
import { useAppDispatch } from "../../../app/hooks";
import { Empty } from "../../../components/commons";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { RequestModel } from "../../../models/request";
import { setLoading } from "../../../redux/globalSlice";
import UserCart from "../components/UserCart";

interface ReceivedProps {}

interface DataProps {
  requests: RequestModel[];
  totalUsers: number;
}

const Received: React.FunctionComponent<ReceivedProps> = () => {
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();

  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<DataProps>({ requests: [], totalUsers: 0 });

  const onChangePage = (value: number) => {
    setPage(value);
  };

  const fetchData = async (page: number) => {
    dispatch(setLoading("ADD"));
    const { ok, body, error, pagination } =
      await requestApi.getReceivedRequests({
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
                user={request.user}
                key={`received-${request.user.id}`}
                index={index}
                statusButtons={[false, false, false]}
                updateStatusButtons={() => {}}
                type={"ACCEPT_REJECT"}
                afterUnfriend={() => fetchData(page)}
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

export { Received };
