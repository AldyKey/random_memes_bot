import { config } from "dotenv";

export const JOKE_API = "https://v2.jokeapi.dev/joke/Programming?type=single";
export const SEND_MESSAGE_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`;
export const TELEGRAM_GET_FILE = `https://api.telegram.org/file/bot${process.env.TELEGRAM_API_TOKEN}`;
export const TELEGRAM_GET_FILE_PATH = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/getFile`;
export const SEND_PHOTO_URI = `https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendPhoto`;
