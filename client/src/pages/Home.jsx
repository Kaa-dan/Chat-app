import React, { useState } from "react";

import { ChatDashBoard } from "../components/ChatDashBoard";
import { Chat } from "../components/Chat";
import { Outlet } from "react-router-dom";
export const Home = () => {

  const [refresh,setRefresh]=useState(false)
  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <ChatDashBoard refresh={refresh} setRefresh={setRefresh}/>

        <Outlet nithin={'nithin'} refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};
