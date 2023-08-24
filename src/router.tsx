// router.js
import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./shared/header";
import Leaderboard from "./leaderboard/leaderboard";
const Lobby = lazy(() => import("./lobby/Lobby"));
const DropDown = lazy(() => import("./lobby/DropDown"));
const Login = lazy(() => import("./auth/login"));
const SignUp = lazy(() => import("./auth/signup"));
const Game = lazy(() => import("./in-game-experinence/game"));
const Dashboard = lazy(() => import("./auth/Dashboard"));
const EditUser = lazy(() => import("./auth/EditUser"));
const TeamPage = lazy(() => import("./team_management/teamPage"));
const Accepted = lazy(() => import("./team_management/accepted"));
const RejectInvite = lazy(() => import("./team_management/rejected"));
const AcceptInvite = lazy(() => import("./team_management/acceptInvite"));
const TeamDashboard = lazy(() => import("./team_management/teamcreation"));
const QuestionTagging = lazy(
  () => import("./question-tagging/QuestionTagging")
);

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" Component={Login} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/game" Component={Game} />
          <Route path="/editUser" Component={EditUser} />
          <Route path="/leaderboard" Component={Leaderboard} />
          <Route path="/exploreGame" Component={DropDown} />
          <Route
            path="/acceptInvite/:teamName/:sender/:subscribee/:uuid"
            Component={AcceptInvite}
          />
          <Route path="/accepted" Component={Accepted} />
          <Route path="/rejected" Component={RejectInvite} />
          <Route path="/editUser" Component={EditUser} />
          <Route path="/teamDashboard" Component={TeamDashboard} />
          <Route path="/team/:teamId" Component={TeamPage} />{" "}
          <Route path="/lobby" Component={Lobby} />
          <Route path="/tagQuestion" Component={QuestionTagging} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
