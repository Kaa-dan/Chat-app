import GroupModel from "../model/group.model.js";

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
    // console.log(error.message);
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
export { createGroup, getGroupData };
