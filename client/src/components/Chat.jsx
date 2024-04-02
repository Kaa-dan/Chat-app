import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../socket";

export const Chat = ({ refresh }) => {
  const { id } = useParams();

  const scrollRef = useRef();
  const containerRef = useRef();

  const { currentUser } = useSelector((state) => state.user);

  const [groupMessages, setGroupMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  console.log(messages);
  const [message, setMessage] = useState("");
  const handleMessageChange = (e) => {
    try {
      setMessage(e.target.value);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessageHandler = async () => {
    try {
      const res = await fetch(`/api/user/getmessages/${id}`);
      const data = await res.json();
      setGroupMessages(data);
    } catch (error) {}
  };

  const submitHandler = async (e) => {
    try {
      if (message.trim() !== "") {
        // Check if message is not empty
        e.preventDefault();
        socket.emit("sendMessage", {
          message,
          userId: currentUser._id,
          groupId: id,
          avatar: currentUser.avatar,
          online: currentUser.online,
          username: currentUser.userName,
        });
        setMessage("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getMessageHandler();
    setMessages([]);
  }, [id]);
  useEffect(() => {
    // Subscribe to messages for the current group
    socket.emit("subscribeToGroupMessages", { groupId: id });

    // Event listener for receiving messages
    socket.on("groupMessage", (msg) => {
      if (msg.groupId === id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      } else {
        // setMessages([])
      }
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      socket.emit("unsubscribeFromGroupMessages", { groupId: id });
      socket.off("groupMessage");
    };
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupMessages]);

  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        <div className="flex flex-col h-full overflow-x-auto mb-4 ">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">
              {groupMessages.map((value, index) => {
                // console.log(value)
                return value?.user?._id === currentUser?._id ? (
                  <div
                    key={index}
                    className="col-start-6 col-end-13 p-3 rounded-lg"
                    ref={containerRef}
                  >
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        <img src={currentUser?.avatar} />
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>{value?.message}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="col-start-1 col-end-8 p-3 rounded-lg"
                    ref={containerRef}
                  >
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        <img src={value?.user?.avatar} />
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>{value?.message}</div>
                        {value?.user?.online ? (
                          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-green-500">
                            {value?.user?.userName}
                          </div>
                        ) : (
                          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-red-500">
                            {value?.user?.userName}
                          </div>
                        )}{" "}
                      </div>
                    </div>
                  </div>
                );
              })}

              {messages.map((value, index) => {
                // console.log(value);
                return value?.userId === currentUser?._id ? (
                  <div
                    key={index}
                    className="col-start-6 col-end-13 p-3 rounded-lg"
                    ref={scrollRef}
                  >
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10  bg-indigo-500  rounded-full flex-shrink-0">
                        <img src={currentUser?.avatar} />
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>{value?.message}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="col-start-1 col-end-8 p-3 rounded-lg"
                    ref={scrollRef}
                  >
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        <img src={value?.avatar} />
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>{value?.message}</div>
                        {value?.online ? (
                          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-green-500">
                            {value?.username}
                          </div>
                        ) : (
                          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-red-500">
                            {value?.username}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div></div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                onChange={handleMessageChange}
                value={message}
              />
            </div>
          </div>
          <div className="ml-4">
            <button
              onClick={submitHandler}
              className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
            >
              <span>Send</span>
              <span className="ml-2">
                <svg
                  className="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
