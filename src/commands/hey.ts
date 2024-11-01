import {CacheType, ChatInputCommandInteraction, Interaction, SlashCommandBuilder} from "discord.js";

export const heyCmd = new SlashCommandBuilder()
  .setName("hey") //スラッシュコマンドの名前
  .setDescription("あなたに挨拶してくれます。");

export const heyFunc = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  await interaction.reply('こんにちは！！');
}


  // async function(interaction) {
  //   await interaction.reply('Fuck.');
  // }