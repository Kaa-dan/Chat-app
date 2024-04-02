import { AiOutlineUserAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function ListingItem({ listing }) {
  const { currentUser } = useSelector((state) => state.user);

  console.log(listing.groupMembers.indexOf(currentUser._id));
  const NAVIGATE = useNavigate();
  let handleJoin = async () => {
    try {
      // console.log(listing);
      // console.log(currentUser);
      const res = await fetch(`/api/user/joingroup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: listing._id, userID: currentUser._id }),
      });
      const data = await res.json();

      if (data) {
        NAVIGATE(`/chat/${listing._id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[200px]">
      <img
        src={listing.avatar}
        alt="listing cover"
        className="h-[220px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
      />
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="truncate text-lg font-semibold text-red-700">
          {listing.groupName}
        </p>
        {listing.groupMembers.indexOf(currentUser._id) === -1 ? (
          <div
            onClick={() => {
              handleJoin();
            }}
            className="flex items-center gap-1"
          >
            <AiOutlineUserAdd className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full cursor-pointer">
              {"Join Group"}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <AiOutlineUserAdd className="h-4 w-4 text-red-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {"You are already in this group"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
