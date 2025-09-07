import router from "express";
import MessagesController from "../controllers/MessagesController.ts";
import onlineChanger from "../utils/onlineChanger.ts";

const routs = router.Router();

routs.get("/messages/:id", onlineChanger, MessagesController.findMessage);
routs.post("/messages/all", onlineChanger, MessagesController.findDialogMessages);
routs.post("/messages/create", onlineChanger, MessagesController.createMessage);
routs.put("/messages/:id", onlineChanger, MessagesController.updateMessage);
routs.delete("/messages/:id", onlineChanger, MessagesController.deleteMessage);
routs.post("/messages/last", onlineChanger, MessagesController.findLastMessage);
routs.post("/messages/unreadedCount", onlineChanger, MessagesController.getUnreadMessages);
routs.post(
  "/messages/unreadedWithData",
  onlineChanger,
  MessagesController.getUnreadMessagesWithData
);

export default routs;
