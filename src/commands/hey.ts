import {CacheType, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "../types/command";

//コマンドの設定
const heyConf = new SlashCommandBuilder()
  .setName("hey") //スラッシュコマンドの名前
  .setDescription("あなたに挨拶してくれます。");

//コマンドの処理
const heyFunc = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.reply('こんにちは！！');
}

//出力
export const heyCmd: Command = {
  conf: heyConf,
  func: heyFunc
}


