const readline = require("readline");
const P = require("pino");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    makeCacheableSignalKeyStore // Stability ke liye zaroori
} = require("@whiskeysockets/baileys");

// =========================
// GLOBAL INPUT
// =========================
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (q) =>
    new Promise(res => rl.question(q, ans => res(ans.trim())));

// =========================
// BANNER
// =========================
function showBanner(){
    console.clear();
    console.log(`
\x1b[31m██████╗ ██╗   ██╗██████╗ 
██╔══██╗██║   ██║██╔══██╗
██.   ╔╝██║   ██║██████╔╝
██╔══. ╗██║   ██║██╔═══╝ 
██████╔╝╚██████╔╝██║     
╚═════╝  ╚═════╝ ╚═╝     \x1b[0m

        \x1b[33m𝐂𝐔𝐏 𝐓𝐎𝐎𝐋\x1b[0m
   created by \x1b[36m404 Injector (𝗧𝗔𝗬𝗬𝗔𝗕)\x1b[0m
`);
}

// =========================
// MENU
// =========================
function showMenu(){
    console.log(`
\x1b[32m1.\x1b[0m 𝗕𝗔𝗡 𝗩𝗜𝗖𝗧𝗜𝗠 𝗡𝗨𝗠𝗕𝗘𝗥 😈
\x1b[32m2.\x1b[0m 𝗖𝗛𝗘𝗖𝗞 𝗜𝗡/𝗢𝗨𝗧 𝗠𝗦𝗚𝗦 😈
\x1b[32m3.\x1b[0m 𝗖𝗛𝗘𝗖𝗞 𝗚𝗥𝗢𝗨𝗣𝗦 😈
\x1b[32m4.\x1b[0m 𝗚𝗘𝗧 𝗔𝗗𝗠𝗜𝗡𝗜𝗦𝗧𝗥𝗔𝗧𝗜𝗢𝗡 😈
\x1b[32m5.\x1b[0m 𝗢𝗪𝗡𝗘𝗥 / 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 😈
\x1b[32m6.\x1b[0m 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 😈
\x1b[32m7.\x1b[0m 𝗘𝗫𝗜𝗧 🫠
`);
}

// =========================
// RUN MODULE SAFE
// =========================
async function runModule(name, sock){
    const file = path.join(__dirname,"modules",`${name}.js`);
    if(!fs.existsSync(file)){
        console.log("❌ Module not found:", name);
        return;
    }
    try{
        delete require.cache[require.resolve(file)];
        await require(file)(sock, question); 
    }catch(e){
        console.log("❌ Module Error:", e.message);
    }
}

// =========================
// MAIN
// =========================
async function start(){
    showBanner();

    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    
    // 🔥 Version Fetch Logic
    let version = [2, 3000, 1015901307]; 
    try {
        const res = await axios.get('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json');
        version = res.data.version;
    } catch (e) {
        console.log("Using default version...");
    }

    // 🚀 Sock Configuration (Aapka Upar wala code yahan replace kar diya hai)
    const sock = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
        },
        printQRInTerminal: false, // Kyunke pairing code use ho raha hai
        syncFullHistory: true,
        markOnlineOnConnect: true,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        generateHighQualityLinkPreview: true,
        version,
        browser: ["Windows", "Chrome", "20.0.04"],
        logger: P({ level: 'fatal' }),

        // 🔥 Aapki IMPORTANT Button Patching Logic
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                (message.buttonsMessage || message.templateMessage || message.listMessage) &&
                !message.interactiveMessage
            );

            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
    });

    sock.ev.on("creds.update", saveCreds);

    // Pairing Logic
    if(!state.creds?.registered){
        const num = await question("\nEnter whatsapp number with country code (e.g. 923xxxxxxxx): ");
        
        console.log("⏳ Requesting Pairing Code...");
        await new Promise(r => setTimeout(r, 3000));
        
        let code = await sock.requestPairingCode(num.replace(/[^0-9]/g, ''));

        console.log("\n🔗 Pair this device using code:");
        console.log(`   \x1b[1m\x1b[32m${code}\x1b[0m\n`);
        console.log("Please wait for the connection to complete...");
    }

    // Connection Monitor
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === "open") {
            console.log("\x1b[32m\n✅ Pairing Done & Connected!\n\x1b[0m");
            
            while(true){
                showMenu();
                let choice = await question("CHOOSE NUMBER: ");
                switch(choice){
                    case "1": await runModule("broadcast", sock); break;
                    case "2": await runModule("msgs", sock); break;
                    case "3": await runModule("groups", sock); break;
                    case "4": await runModule("adminship", sock); break;
                    case "5": await runModule("owner", sock); break;
                    case "6": await runModule("details", sock); break;
                    case "7":
                        console.log("Bye!");
                        process.exit(0);
                    default:
                        console.log("Invalid option!");
                }
                console.log("\n"); 
            }
        }
        
        if (connection === "close") {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log("🔄 Connection lost. Reconnecting...");
                start();
            } else {
                console.log("❌ Logged out. Delete 'auth_info' and try again.");
                process.exit(0);
            }
        }
    });
}

start();
