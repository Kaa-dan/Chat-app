import React from "react";

import { ChatDashBoard } from "../components/ChatDashBoard";
import { Chat } from "../components/Chat";
import { Outlet } from "react-router-dom";
export const Home = () => {
  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatDashBoard />

        <Outlet />
      </div>
    </div>
  );
};
