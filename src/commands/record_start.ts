import {CacheType, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "../types/command";

//コマンドの設定
const recordStartConf = new SlashCommandBuilder()
  .setName("record_start") //スラッシュコマンドの名前
  .setDescription("作業配信の記録を開始します。");

//コマンドの処理
const recordStartFunc = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.reply("作業配信の記録を開始します。");
}

//出力
export const recordStartCmd: Command = {
  conf: recordStartConf,
  func: recordStartFunc
}


