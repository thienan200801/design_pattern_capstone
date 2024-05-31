import classNames from "classnames";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

interface CommunicationLayoutProps {}

const CommunicationLayout: React.FunctionComponent<
  CommunicationLayoutProps
> = () => {
  return (
    <div className="communication-layout">
      <div className="communication-layout__header">
        <NavLink to={"/communication"} className={classNames("tab")} end>
          Recommend
        </NavLink>
        <NavLink
          to={"/communication/received"}
          className={classNames("tab")}
          end
        >
          Received
        </NavLink>
        <NavLink to={"/communication/sent"} className={classNames("tab")} end>
          Sent
        </NavLink>
        <NavLink to={"/communication/friend"} className={classNames("tab")} end>
          Friend
        </NavLink>
      </div>
      <div className="communication-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default CommunicationLayout;
