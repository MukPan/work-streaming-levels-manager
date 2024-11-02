import {CacheType, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export type Command = {
  conf: SlashCommandBuilder,
  func: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>
}