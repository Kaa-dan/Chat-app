import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:"https://www.bing.com/images/search?view=detailV2&ccid=0CZd1ESL&id=23EDA8F031EF0AE78DAC70253D79F6F0CADE07B8&thid=OIP.0CZd1ESLnyWIHdO38nyJDAHaGF&mediaurl=https%3a%2f%2fwww.pngitem.com%2fpimgs%2fm%2f504-5040528_empty-profile-picture-png-transparent-png.png&exph=706&expw=860&q=Blank+Profile&simid=608004289781921627&FORM=IRPRST&ck=EF0A45B5866CA814C786FBB26A6833FB&selectedIndex=0"
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
