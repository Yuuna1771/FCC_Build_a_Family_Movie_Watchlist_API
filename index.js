import express from "express";
import authRouter from "./routes/jwt.js";
import watchlistRouter from "./routes/watchlist.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/watchlist", watchlistRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
