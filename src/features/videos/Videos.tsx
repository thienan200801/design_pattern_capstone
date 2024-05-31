import { Modal, Pagination, Table, Tag } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useHandleResponseError } from "../../hooks/useHandleResponseError";
import {
  showErrorModal,
  showSuccessModal,
} from "../../components/modals/CommonModals";
import { selectUserId, setLoading } from "../../redux/globalSlice";
import postApi from "../../api/postApi";
import { BaseRequestQueryParam } from "../../models/http";
import { PostModel } from "../../models/post";
import type { ColumnsType } from "antd/es/table";
import { formatDate } from "../../utils/commonUtils";

interface VideosProps {}

interface DataProps {
  posts: PostModel[];
  total: number;
}

interface FilterProps {
  userId: number;
  page: number;
}

const getFilter = (filter: FilterProps): BaseRequestQueryParam => ({
  size: 10,
  page: filter.page,
  sort: "createdDate,desc",
  "userId.equals": filter.userId,
});

const Videos: React.FunctionComponent<VideosProps> = () => {
  const dispatch = useAppDispatch();
  const handlResponseError = useHandleResponseError();
  const userId = useAppSelector(selectUserId);

  const inputVideoRef = useRef<HTMLInputElement>(null);
  const [isOpenUploadVideoModal, setOpenUploadVideoModal] =
    useState<boolean>(false);
  const [filter, setFilter] = useState<FilterProps>({
    userId,
    page: 0,
  });
  const [data, setData] = useState<DataProps>({ total: 0, posts: [] });

  const handleUploadVideo = async () => {
    const formData = new FormData();

    if (
      inputVideoRef.current &&
      inputVideoRef.current.files &&
      inputVideoRef.current.files[0]
    ) {
      formData.append("video", inputVideoRef.current.files[0]);
    } else {
      showErrorModal({
        content: "Please choose video to upload",
        title: "Error",
        onOk: () => {},
      });
      return;
    }

    formData.append("name", "dasdsa");
    dispatch(setLoading("ADD"));
    const { ok, error } = await postApi.uploadVideo(formData);
    dispatch(setLoading("REMOVE"));

    if (ok) {
      showSuccessModal({
        title: "Notification",
        onOk: () => {},
        content: "Upload practice video successfully!",
      });
      setOpenUploadVideoModal(false);
      fetchData(getFilter(filter));
      return;
    }

    handlResponseError(error);
  };

  const onPageChange = (page: number) => {
    setFilter((prev) => {
      fetchData(getFilter({ ...prev, page }));
      return { ...prev, page };
    });
  };

  const columns: ColumnsType<PostModel> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: "VALID" | "INVALID" | "PENDING") => (
        <Tag
          color={
            value === "VALID"
              ? "success"
              : value === "INVALID"
              ? "error"
              : "warning"
          }
          style={{ fontWeight: 600, fontSize: "15px" }}
        >
          {value === "VALID"
            ? "Valid"
            : value === "INVALID"
            ? "Invalid"
            : "Pending"}
        </Tag>
      ),
    },
    {
      title: "Link",
      dataIndex: "url",
      key: "url",
      render: (value) => (
        <a className="link-video" target={"_blank"} href={value}>
          Link video
        </a>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (value) => {
        const m = Math.floor(value / 60);
        return <span>{`${m} ${m > 1 ? "minutes" : "minute"}`}</span>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (value) => <span>{formatDate(value)}</span>,
    },
  ];

  const fetchData = async (params: BaseRequestQueryParam) => {
    dispatch(setLoading("ADD"));
    const { ok, error, body, pagination } = await postApi.getPosts(params);
    dispatch(setLoading("REMOVE"));

    if (ok && body && pagination) {
      setData({
        total: pagination.total,
        posts: body,
      });
      return;
    }

    handlResponseError(error);
  };

  useEffect(() => {
    fetchData(getFilter(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.page]);

  return (
    <Fragment>
      <div className="videos-page">
        <div className="videos-page__header">
          <h3>Videos</h3>
          <button onClick={() => setOpenUploadVideoModal(true)}>
            Upload video
          </button>
        </div>
        <div className="videos-page__content">
          <Table columns={columns} dataSource={data.posts} pagination={false} />
          {data.total !== 0 && (
            <div className="pagination">
              <Pagination
                total={data.total}
                pageSize={10}
                onChange={onPageChange}
                current={filter.page}
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Upload video"
        open={isOpenUploadVideoModal}
        centered
        onCancel={() => setOpenUploadVideoModal(false)}
        footer={null}
        maskClosable={false}
        width={600}
        destroyOnClose
      >
        <div className="upload-video-modal">
          <div className="row__input">
            <label htmlFor="input_video">Select image</label>
            <input
              type="file"
              id="input_video"
              name="input_video"
              accept="video/mp4"
              ref={inputVideoRef}
            />
          </div>
          <div className="row__input">
            <label htmlFor="input_video__name">Name</label>
            <input
              type="text"
              id="input_video__name"
              name="input_video__name"
              placeholder="Enter video name"
            />
          </div>
          <div className="upload-video-modal__footer">
            <button onClick={handleUploadVideo}>Save</button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Videos;
