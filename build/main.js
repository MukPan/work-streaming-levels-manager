"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
//.envファイルを読み込む
dotenv_1.default.config();
//Discordのクライアントを作成
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel],
});
//Botがきちんと起動したか確認
client.once(discord_js_1.Events.ClientReady, () => {
    console.log('bot: Ready!');
    if (client.user) {
        console.log(client.user.tag);
    }
});
//スラッシュコマンドに応答するためには、
//InteractionCreateのイベントリスナー使う必要がある
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // スラッシュコマンドかチェック
    if (!interaction.isChatInputCommand())
        return;
    // heyコマンドに対する処理
    if (interaction.commandName === "hey") {
        try {
            yield interaction.reply('こんにちは！');
        }
        catch (error) {
            //エラー
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                yield interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
            }
            else {
                yield interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
            }
        }
        // else if (こまんどー) {}
        //未対応のコマンド
    }
    else {
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
    }
}));
//配信開始、終了時のイベントリスナー
client.on(discord_js_1.Events.VoiceStateUpdate, (oldState, newState) => {
    // oldStateとnewStateでユーザーのボイスチャンネルの状態が更新されたか確認
    if (oldState.streaming !== newState.streaming) {
        if (newState.streaming) {
            console.log(`ユーザ(ID:${newState.id})がチャンネル(ID:${newState.channelId})で配信を開始しました！`);
        }
        else {
            console.log(`ユーザ(ID:${newState.id})がチャンネル(ID:${newState.channelId})で配信を終了しました。`);
        }
    }
});
//ボット作成時のトークンでDiscordと接続
client.login(process.env.TOKEN);
