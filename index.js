const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// سيرفر خفيف لإبقاء البوت شغالاً على الاستضافات مثل Replit أو Render
http.createServer((req, res) => {
    res.write("Bot is alive!");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const CHANNEL_ID = '1559104968894578749';
const GUILD_ID = '1543168935036330085';

// الدالة المحدثة مع async/await و fetch
async function connectToVoice() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        if (!guild) return;

        const channel = await guild.channels.fetch(CHANNEL_ID);
        if (!channel) return;

        joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true
        });
        console.log("تم الاتصال بالروم الصوتية بنجاح!");
    } catch (error) {
        console.error("خطأ في الاتصال:", error);
    }
}

client.once('ready', () => {
    console.log(`تم تسجيل الدخول باسم: ${client.user.tag}`);
    connectToVoice();
    setInterval(connectToVoice, 300000); // إعاده الاتصال كل 5 دقائق لضمان البقاء
});

client.login(process.env.DISCORD_TOKEN);
