import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { MdDangerous } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
export default function DialogWithForm({
  open,
  handleOpen,
  refresh,
  setRefresh,
}) {
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploaidng, setUploading] = useState(false);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
    setUploading(false);
  };
console.log("nihtin"
)
  const handleChange = (e) => {
    setFormData({ ...formData, Group: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/user/creategroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, userId: currentUser._id }),
      });
      setRefresh((state) => {
        return !state;
      });
      handleOpen();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Dialog size="xs" open={open} className="bg-transparent shadow-none">
        <Card className="mt-9 mx-auto w-full max-w-[24rem] bg-white">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray" onClick={handleOpen}>
              <MdDangerous className="inline bg-red-600" />
            </Typography>
            <Typography className="mb-2" variant="h6">
              Group Name
            </Typography>
            <Input size="md" className="p-2" onChange={handleChange} />

            <input
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <p className="text-sm self-center">
              {fileUploadError ? (
                <span className="text-red-700">
                  Error Image upload (image must be less than 2 mb)
                </span>
              ) : filePerc > 0 && filePerc < 100 ? (
                <span className="text-lime-700">{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (
                <span className="text-green-700">
                  Image successfully uploaded!
                </span>
              ) : (
                ""
              )}
            </p>
            <button
              className="text-red-700"
              // fullWidth
              onClick={() => fileRef.current.click()}
            >
              Upload image
            </button>
          </CardBody>
          <CardFooter className="pt-0">
            {/* <Button
              variant="filled"
              className="text-red-700"
              fullWidth
              onClick={handleOpen}
            >
              Close
            </Button> */}
            {uploaidng ? null : (
              <button
                className="text-white bg-red-600 rounded-xl w-40 ml-20"
                onClick={handleSubmit}
              >
                Create Group
              </button>
            )}
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
