import { Pagination } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import friendApi from "../../../api/friendApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Empty } from "../../../components/commons";
import { useHandleResponseError } from "../../../hooks/useHandleResponseError";
import { FriendModel } from "../../../models/friend";
import { selectUserId, setLoading } from "../../../redux/globalSlice";
import UserCart from "../components/UserCart";

interface FriendProps {}

interface DataProps {
  friends: FriendModel[];
  totalUsers: number;
}

const Friend: React.FunctionComponent<FriendProps> = () => {
  const dispatch = useAppDispatch();
  const handleResponseError = useHandleResponseError();
  const userId = useAppSelector(selectUserId);

  const [data, setData] = useState<DataProps>({ friends: [], totalUsers: 0 });
  const [page, setPage] = useState<number>(1);

  const onChangePage = (value: number) => {
    setPage(value);
  };

  const fetchData = async (page: number) => {
    dispatch(setLoading("ADD"));
    const { ok, body, error, pagination } = await friendApi.getFriends({
      size: 3,
      page: page - 1,
    });
    dispatch(setLoading("REMOVE"));

    if (ok && body && pagination) {
      setData({ friends: body, totalUsers: pagination.total });
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
            {data.friends.map((friend, index) => (
              <UserCart
                user={friend.user.id !== userId ? friend.user : friend.friend}
                key={`friend-${friend.id}`}
                index={index}
                statusButtons={[false, false, false]}
                updateStatusButtons={() => {}}
                type={"UNFRIEND"}
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

export { Friend };
