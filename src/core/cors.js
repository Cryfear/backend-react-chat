export const corsFunction = (app) => (
  _,
  res,
  next
) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
  app.options("*", (_, res) => {
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
    res.send();
  });
};

export const corsSettings = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  optionsSuccessStatus: 200,
  options: "*",
  "Access-Control-Allow-Credentials": true,
};
