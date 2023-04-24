import axios from "axios";
import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";

import User from "./models/User.js";
import Meme from "./models/Memes.js";
import db from "./database/MongoConnection.js";
import { createUser, createMemes, findUser } from "./utils/MongoRequests.js";
import {
  JOKE_API,
  SEND_MESSAGE_URI,
  TELEGRAM_GET_FILE,
  TELEGRAM_GET_FILE_PATH,
  SEND_PHOTO_URI,
} from "./utils/EnvVarialbes.js";

config();
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/new-message", async (req, res) => {
  const { message } = req.body;

  const chatId = message?.chat?.id;

  if (!chatId) {
    return res.sendStatus(400);
  }

  const username = message.from.username;
  const userId = message.from.id;

  const foundedUser = await findUser(userId);

  if (!foundedUser) {
    const foundedUser = await createUser(username, userId, false);
  }

  if (message.photo && message.photo.length > 0) {
    const fileId = message.photo[message.photo.length - 1].file_id;

    try {
      // const response = await axios.get(`${TELEGRAM_GET_FILE_PATH}`, {
      //   params: { file_id: fileId }
      // })

      // const fileUrl = `${TELEGRAM_GET_FILE}/${response.data.result.file_path}`

      // const imageResponse = await axios.get(fileUrl, {
      //   responseType: 'arraybuffer'
      // })
      const createdMeme = await createMemes(foundedUser, false, fileId);
      // const sendPhotoResponse = await axios.post(`${SEND_PHOTO_URI}`, {
      //   chat_id: chatId,
      //   photo: fileId,
      //   caption: 'Here is your photo!'
      // })
      const responseText =
        "Congratulations! Your meme was added to the database!";
      await axios.post(`${SEND_MESSAGE_URI}`, {
        chat_id: chatId,
        text: responseText,
      });

      res.send("Done");
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  } else {
    const messageText = message?.text?.toLowerCase()?.trim();

    let responseText =
      "Do you want joke or meme? Write what you want. Send your own meme, if you want to add it to the database";

    if (messageText === "joke") {
      try {
        const response = await axios(JOKE_API);
        responseText = response.data.joke;
      } catch (e) {
        return res.sendStatus(500);
      }
    }

    if (messageText === "meme") {
      try {
        const memes = await Meme.find({ isApproved: true });
        if (!memes) {
          const responseText = "У меня мемов нет, отправь свои плиз";
          await axios.post(`${SEND_MESSAGE_URI}`, {
            chat_id: chatId,
            text: responseText,
          });
          return res.send("Done");
        }
        const randomIndex = Math.floor(Math.random() * memes.length);
        const randomMeme = memes[randomIndex];
        const sendPhotoResponse = await axios.post(`${SEND_PHOTO_URI}`, {
          chat_id: chatId,
          photo: randomMeme.fileId,
          caption: "Here is your random meme!",
        });
        return res.send("Done");
      } catch (e) {
        return res.sendStatus(500);
      }
    }

    try {
      await axios.post(`${SEND_MESSAGE_URI}`, {
        chat_id: chatId,
        text: responseText,
      });
      return res.send("Done");
    } catch (e) {
      return res.sendStatus(500);
    }
  }
});

app.get("/memes", async (req, res) => {
  try {
    const memes = await Meme.find();
    res.send(memes);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get("/memes/not-approved", async (req, res) => {
  try {
    const memes = await Meme.find({ isApproved: false });
    res.send(memes);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get("/memes/approved", async (req, res) => {
  try {
    const memes = await Meme.find({ isApproved: true });
    res.send(memes);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/meme/:id", async (req, res) => {
  const { id } = req.params;

  const { isApproved } = req.body;
  console.log(isApproved);
  try {
    const meme = await Meme.findById(id);
    if (!meme) {
      res.status(404).send("Meme not found");
    } else {
      meme.isApproved = isApproved;
      await meme.save();
      console.log(meme);
      // res.sendStatus(200);
      res.send(meme);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
