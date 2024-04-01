import ChatMessage from "../model/chat.model.js";

const saveMessage = async (message) => {
//   console.log(message);
  try {
    const responseMessage = ChatMessage({
      user: message.userId,
      message: message.message,
      groupId: message.groupId,
    });

    await responseMessage.save();
  } catch (error) {
    console.log(error.message)
  }
};

export default saveMessage;
