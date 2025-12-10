// modules/owner.js

module.exports = async (sock, question) => {

    const config = {
        ownerName: "🝗 𝙈𝙪𝙝𝙖𝙢𝙢𝙖𝙙 𝙏𝙖𝙮𝙮𝙖𝙗 🝗",
        ownerNumber: "923XXXXXXXXX",
        github: "https://github.com/4O4-INJECTOR",
        youtube: "https://www.youtube.com/@404-Injector",
        whatsappChannel1: "https://whatsapp.com/channel/0029VbBu0ULJP21Bq5OFVo43",
        whatsappChannel2: "https://whatsapp.com/channel/0029VanMDac05MUliOn3T52n",
        botName: "⚡ 𝙏𝘼𝙔𝙔𝘼𝘽 - 𝙈𝘿 ⚡",
        developer: "『 𝙏𝙖𝙮𝙮𝙖𝙗 』",
        theme: "⫷ 𝙃𝙖𝙘𝙠𝙚𝙧 𝙈𝙤𝙙𝙚 ⫸",
        wm: "⦿ 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝙏𝙖𝙮𝙮𝙖𝙗 ⦿",
        footer: "⚠️ 𝙏𝙖𝙮𝙮𝙖𝙗-𝙈𝘿 | 404 𝙄𝙣𝙟𝙚𝙘𝙩𝙤𝙧 ⚠️",
        version: "7.7.7",
        signature: "🜸 𝙏𝙖𝙮𝙮𝙖𝙗 𝙃𝙚𝙭 𝙎𝙩𝙪𝙙𝙞𝙤𝙨 🜸"
    };

    console.clear();
    console.log(`
    ╔══════════════╗
      𝐓𝐀𝐘𝐘𝐀𝐁 - 𝐌𝐃 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔
    ╚══════════════╝

Owner: ${config.ownerName}
Number: +${config.ownerNumber}

Github: ${config.github}
YouTube: ${config.youtube}
Channel 1: ${config.whatsappChannel1}
Channel 2: ${config.whatsappChannel2}

Bot: ${config.botName}
Theme: ${config.theme}

Version: ${config.version}
Signature: ${config.signature}

${config.footer}
    `);

    await question("\nPress ENTER to go back...");
};