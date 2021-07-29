import { launchTelegramBot } from "./Models/TelegramBot.js";
import dotnet from "dotenv"

dotnet.config();

launchTelegramBot(process.env.TELEGRAM_BOT_TOKEN);