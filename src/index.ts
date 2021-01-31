import { token } from "./Config";
import BotClient from "./client/BotClient";

const client: BotClient = new BotClient({ token });
client.start();
