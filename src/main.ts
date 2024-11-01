import {GatewayIntentBits, Client, Partials, Events} from 'discord.js'
import dotenv from 'dotenv'
import {heyCmd, heyFunc} from "./commands/hey";

//.envファイルを読み込む
dotenv.config()

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
})

//Botがきちんと起動したか確認
client.once(Events.ClientReady, () => {
  console.log('bot: Ready!')
  if (client.user) {
    console.log(client.user.tag)
  }
})

//スラッシュコマンドに応答するためには、
//InteractionCreateのイベントリスナー使う必要がある
client.on(Events.InteractionCreate, async interaction => {
  // スラッシュコマンドかチェック
  if (!interaction.isChatInputCommand()) return;

  // heyコマンドに対する処理
  if (interaction.commandName === heyCmd.name) {
    try {
      await heyFunc(interaction);
    } catch (error) {
      //エラー
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({content: 'コマンド実行時にエラーになりました。', ephemeral: true});
      } else {
        await interaction.reply({content: 'コマンド実行時にエラーになりました。', ephemeral: true});
      }
    }
  } else if (interaction.commandName === "rec") {
    try {
      await interaction.reply('recコマンドが実行されました。');
    } catch (error) {
      //エラー
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({content: 'コマンド実行時にエラーになりました。', ephemeral: true});
      } else {
        await interaction.reply({content: 'コマンド実行時にエラーになりました。', ephemeral: true});
      }
    }

  // else if (こまんどー) {}
  //未対応のコマンド
  } else {
    console.error(`${interaction.commandName}というコマンドには対応していません。。。。。`);
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
