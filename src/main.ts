import {GatewayIntentBits, Client, Partials, Events, Snowflake, ChannelType} from 'discord.js';
import dotenv from 'dotenv';
import {heyCmd} from "./commands/hey";
import {Command} from "./types/command";
import {showStreamingUsersCmd} from "./commands/show_streaming_users";

//コマンドデータを配列に格納
const commands: Command[] = [
  heyCmd,
  showStreamingUsersCmd,
];

//.envファイルを読み込む
dotenv.config();

//Discordのクライアントを作成
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, //ボイスチャンネルの状態
  ],
  partials: [Partials.Message, Partials.Channel],
});

//Botがきちんと起動したか確認
client.once(Events.ClientReady, () => {
  console.log('bot: Ready!')
  if (client.user) {
    console.log(client.user.tag)
  }
});

//スラッシュコマンドに応答するためには、
//InteractionCreateのイベントリスナー使う必要がある
client.on(Events.InteractionCreate, async interaction => {
  // スラッシュコマンドかチェック
  if (!interaction.isChatInputCommand()) return;

  //一致コマンドチェック
  for (const command of commands) {
    if (interaction.commandName === command.conf.name) {
      //実行
      try {
        await command.func(interaction);
        //エラー
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({content: 'コマンド実行時にエラーになりました。', ephemeral: true});
        } else {
          await interaction.reply({content: 'コマンド実行時にエラーになりました。', ephemeral: true});
        }
      }
    }
  }
});

//配信開始、終了時のイベントリスナー
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  // oldStateとnewStateでユーザーのボイスチャンネルの状態が更新されたか確認
  if (oldState.streaming !== newState.streaming) {
    if (newState.streaming) {
      console.log(`ユーザ(ID:${newState.id})がチャンネル(ID:${newState.channelId})で配信を開始しました！`);
    } else {
      console.log(`ユーザ(ID:${newState.id})がチャンネル(ID:${newState.channelId})で配信を終了しました。`);
    }
  }
});





//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);

