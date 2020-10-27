import router from "express";
import MessagesController from "../controllers/MessagesController";

const routs = router.Router();

routs.get("/messages/:id", MessagesController.findMessage);
routs.post("/messages/all", MessagesController.findDialogMessages);
routs.post("/messages/create", MessagesController.createMessage);
routs.put("/messages/:id", MessagesController.updateMessage);
routs.delete("/messages/:id", MessagesController.deleteMessage);
routs.post("/messages/last", MessagesController.findLastMessage);
routs.post("/messages/unreaded", MessagesController.getUnreadMessages);

export default routs;
