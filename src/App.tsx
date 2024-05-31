import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { NotFoundPage } from "./components/commons";
import { Loading } from "./components/commons/Loading";
import MainLayout from "./components/layouts/MainLayout";
import Calling from "./features/calling/pages";
import CommunicationLayout from "./features/communication/layouts/CommunicationLayout";
import { Friend, Received, Recommend } from "./features/communication/pages";
import { Sent } from "./features/communication/pages/Sent";
import Login from "./features/login/pages";
import PracticePage from "./features/practice/pages";
import StartTest from "./features/practice/pages/StartTest";
import Profile from "./features/profile/Profile";
import Register from "./features/register/pages";
import { selectLoading } from "./redux/globalSlice";
import Videos from "./features/videos/Videos";
import EntryTest from "./features/entry/EntryTest";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  const loading = useAppSelector(selectLoading);

  return (
    <React.Fragment>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="call" element={<Calling />} />
        <Route path="entry-test" element={<EntryTest />} />
        <Route path={"/"} element={<MainLayout />}>
          <Route index element={<Profile />} />
          <Route path="communication" element={<CommunicationLayout />}>
            <Route index element={<Recommend />} />
            <Route path="received" element={<Received />} />
            <Route path="sent" element={<Sent />} />
            <Route path="friend" element={<Friend />} />
          </Route>
          <Route path="practice" element={<PracticePage />} />
          <Route path="practice/test/:id" element={<StartTest />} />
          <Route path="videos" element={<Videos />} />
        </Route>
        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
      {loading > 0 && <Loading />}
    </React.Fragment>
  );
};

export default App;
