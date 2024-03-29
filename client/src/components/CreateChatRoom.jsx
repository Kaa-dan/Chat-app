import React from "react";
import { CgAdd } from "react-icons/cg";
import Modal from "./Modal";
export const CreateChatRoom = ({refresh,setRefresh}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <>
      {" "}
      <div className="flex flex-row items-center justify-between text-xs mt-6">
        <span className="font-bold">Create Room</span>
        {/* <span className="flex items-center justify-center bg-red-300 h-4 w-4 rounded-full">
          7
        </span> */}
      </div>
      <div className="flex flex-col space-y-1 mt-4 -mx-2">
        <button
          onClick={handleOpen}
          className="flex flex-row items-center bg-red-300 hover:bg-red-700 rounded-xl p-2"
        >
          <div className="flex items-center justify-center h-8 w-8 bg-red-200 rounded-full">
            <CgAdd />
          </div>
          <div className="ml-2 text-sm font-semibold">Create Room</div>
        </button>
        <Modal open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
      </div>
    </>
  );
};
