import ChatMessage from "../model/chat.model.js";
import GroupModel from "../model/group.model.js";
import User from "../model/user.model.js";

const createGroup = async (req, res, next) => {
  try {
    let { Group, avatar } = req.body.formData;
    let id = req.body.userId;
    console.log(Group, avatar, id);
    if (Group && avatar && id) {
      const group = await GroupModel.create({
        groupName: Group,
        avatar,
        createdBy: id,
        groupMembers: [id],
      });
      if (group) {
        console.log("group created");
        return res.status(201).json({ success: true });
      } else {
        throw new Error("Cant create group right now");
      }
    } else {
      throw new Error("Details missing");
    }
  } catch (error) {
    next(error);
  }
};

const getGroupData = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      // Find documents where groupMembers array contains the specified id
      const groupData = await GroupModel.find({ groupMembers: id });
      if (groupData) {
        res.status(200).json(groupData);
      }
    }
  } catch (error) {
    next(error);
  }
};





const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (id) {
      let message = await ChatMessage.find({ groupId: id }).populate('user');;
      // console.log(message);
      res.status(200).json(message);

    }
  } catch (error) {
    console.log(error.message);
  }
};



const search = async (req, res, next) => {
  try {
    console.log("nithin");
    let { regi } = req.params;
    const filter = await GroupModel.find({
      groupName: { $regex: regi, $options: "i" },
    });
    res.status(200).json(filter);
  } catch (error) {
    // next(error);
    console.log(error.message);
  }
};





const allSearch = async (req, res, next) => {
  try {
    const filter = await GroupModel.find();
    res.status(200).json(filter);
  } catch (error) {
    console.log(error.message);
  }
};




const joinGroup = async (req, res, next) => {
  try {
    console.log(req.body);
    const { groupId, userID } = req.body;
    const group = await GroupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    group.groupMembers.push(userID);

    // Save the updated group document
    const updatedGroup = await group.save();

    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
};




const updatProfile = async (req, res, next) => {
  try {
    const { id, link, username } = req.body;
    if (!link) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            userName: username,
          },
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          $set: {
            userName: username,
            avatar: link,
          },
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    }
  } catch (error) {
    next(error);
  }
};




export {
  createGroup,
  getGroupData,
  getMessages,
  search,
  allSearch,
  joinGroup,
  updatProfile,
};
