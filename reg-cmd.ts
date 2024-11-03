import {REST, Routes} from "discord.js";
import dotenv from "dotenv";
import {heyCmd} from "./src/commands/hey";
import {showStreamingUsersCmd} from "./src/commands/show_streaming_users";

dotenv.config();

const commands = [
  heyCmd.conf.toJSON(),
  showStreamingUsersCmd.conf.toJSON(),
];

const rest = new REST({ version: "10" })
  .setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log("スラッシュコマンドの更新を開始します。");
    console.log(commands);

    //グローバル
    // await rest.put(
    //   Routes.applicationCommands(
    //     process.env.APPLICATION_ID!),
    //     { body: commands },
    // );

    //ギルド
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APPLICATION_ID!, process.env.GUILD_ID!),
      { body: commands },
    );

    console.log("コマンドの更新に成功しました！");
  } catch (error) {
    console.error(error);
  }
})();