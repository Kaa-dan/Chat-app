import React, { useEffect, useState } from "react";

import { ChatDashBoard } from "../components/ChatDashBoard";
import { Outlet, useNavigate,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export const Home = () => {
  const [refresh, setRefresh] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate("/sign-in");
  }, [currentUser]);

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatDashBoard refresh={refresh} setRefresh={setRefresh} />

        <Outlet />
      </div>
    </div>
  );
};
