import MessagesController from "../controllers/MessagesController.js";
import { onlineChanger } from "../utils/onlineChanger.js";
import { Router } from "express";

const routes = Router();

routes.get("/messages/:id", onlineChanger, MessagesController.findMessage);
routes.post("/messages/all", onlineChanger, MessagesController.findDialogMessages);
routes.post("/messages/create", onlineChanger, MessagesController.createMessage);
routes.post("/messages/createAudio", onlineChanger, MessagesController.createAudioMessage);
routes.put("/messages/:id", onlineChanger, MessagesController.updateMessage);
routes.delete("/messages/:id", onlineChanger, MessagesController.deleteMessage);
routes.post("/messages/unreadedWithData", onlineChanger, MessagesController.getUnreadMessagesWithData);

export default routes;
