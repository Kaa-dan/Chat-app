import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
    },

    avatar: {
      type: String,
      default:
        "https://www.bing.com/images/search?view=detailV2&ccid=0CZd1ESL&id=23EDA8F031EF0AE78DAC70253D79F6F0CADE07B8&thid=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&mediaurl=https%3a%2f%2fwww.pngitem.com%2fpimgs%2fm%2f504-5040528_empty-profile-picture-png-transparent-png.png&exph=706&expw=860&q=Blank+Profile&simid=608004289781921627&FORM=IRPRST&ck=EF0A45B5866CA814C786FBB26A6833FB&selectedIndex=0",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GroupModel = mongoose.model("Group", groupSchema);

export default GroupModel;
