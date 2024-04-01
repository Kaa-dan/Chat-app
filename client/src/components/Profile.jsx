import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GrEdit } from "react-icons/gr";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
const Profile = () => {
  let { currentUser } = useSelector((state) => state.user);
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(currentUser?.userName);
  const [file, setFile] = useState(undefined);
  const [fileLink, setFileLink] = useState(undefined);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setFilePerc(Math.round(progress));
      },
      (error) => {
        // setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFileLink(downloadURL)
        );
      }
    );
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   dispatch(updateUserStart());
      const res = await fetch(`/api/user/updateprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: currentUser?._id, link: fileLink, username }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      //   setUpdateSuccess(true);
      setEdit(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
      <div className="h-20 w-20 rounded-full border overflow-hidden">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        {edit ? (
          <img
            src={fileLink || currentUser?.avatar}
            alt="Avatar"
            className="h-full w-full"
            onClick={() => fileRef.current.click()}
          />
        ) : (
          <img
            src={currentUser?.avatar}
            alt="Avatar"
            className="h-full w-full"
          />
        )}
      </div>

      {edit ? (
        <input
          defaultValue={currentUser?.userName}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="rounded-md pl-6 w-40 bg-indigo-50"
        />
      ) : (
        <div className="text-sm font-semibold mt-2">
          {currentUser?.userName}
        </div>
      )}
      <div className="text-xs text-gray-500">{currentUser?.email}</div>
      <div className="flex flex-row items-center mt-3">
        {/* <div className="flex flex-col justify-center h-4 w-8 bg-indigo-500 rounded-full"> */}
        {!edit ? (
          <div
            className="h-3 w-3 bg-indigoo rounded-full self-end mr-1"
            onClick={() => {
              setEdit(true);
            }}
          >
            <GrEdit />
          </div>
        ) : (
          <button
            className=" bg-indigo-500 text-white rounded-md text-l p-1 self-end mr-1"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}

        {/* </div> */}
        {/* {currentUser?.active && (
            <div className="leading-none ml-1 text-xs">Online</div>
            )} */}
      </div>
    </div>
  );
};

export default Profile;
