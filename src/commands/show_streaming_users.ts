import {CacheType, Channel, ChannelType, ChatInputCommandInteraction, SlashCommandBuilder,} from "discord.js";
import {Command} from "../types/command";

//コマンドの設定
const showStreamingUsersConf = new SlashCommandBuilder()
  .setName("show_streaming_users") //スラッシュコマンドの名前
  .setDescription("配信中のユーザを表示します。");

//コマンドの処理
const showStreamingUsersFunc = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  //スラッシュコマンドを入力したUserIDを取得
  const targetUserId = interaction.user.id;
  //ユーザが接続しているボイスチャンネルのIDを取得
  const voiceChannelId = await getVoiceChannelId(interaction, targetUserId);
  if (!voiceChannelId) {
    console.log("ユーザがボイスチャンネルに接続していません。");
    return;
  }
  // 指定したチャンネルIDからボイスチャンネルを取得
  const client = interaction.client; //main.tsのclientと同一
  const channel = await client.channels.fetch(voiceChannelId);

  //ボイスチャンネルに接続しているユーザー一覧を取得
  const streamingUsers = await getStreamingUsers(channel);
  //配信中のユーザーがいない場合は処理を中断
  if (streamingUsers.length === 0) {
    await interaction.reply("現在、誰も配信していません。");
    return;
  }
  //配信中のユーザー名を出力
  const streamingUserNames = streamingUsers
    .map(member => member.user.tag)
    .join(", ");
  await interaction.reply(`配信中のユーザ: ${streamingUserNames}`);
}


//指定したUserIDを持つユーザが接続しているVoiceChannelIDを取得する関数
const getVoiceChannelId = async (interaction: ChatInputCommandInteraction<CacheType>, targetUserId: string)=> {
  //指定したIDを持つユーザを取得
  const guildMember = await interaction
    .guild?.members
    .fetch(targetUserId);

  //ユーザが接続しているボイスチャンネルのIDを取得
  return guildMember?.voice.channelId ?? undefined;
}


//指定したIDを持つボイスチャンネルで配信中しているユーザーを確認する関数
const getStreamingUsers = async (voiceChannel: Channel | null)=> {
  //ボイスチャンネルでない場合は処理を中断
  if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
    console.log("指定されたIDはボイスチャンネルではありません。");
    return [];
  }
  // 現在配信中のユーザーをリストアップ
  const streamingUsersIte =  voiceChannel
    .members
    .filter(member => member.voice.streaming) //配信中のユーザーをフィルタリング
    .values();

  return Array.from(streamingUsersIte);
}

//出力
export const showStreamingUsersCmd: Command = {
  conf: showStreamingUsersConf,
  func: showStreamingUsersFunc
}





