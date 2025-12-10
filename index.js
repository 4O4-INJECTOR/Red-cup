const readline = require("readline");
const P = require("pino");
const fs = require("fs");
const path = require("path");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
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
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version,
        logger: P({level:"silent"})
    });

    sock.ev.on("creds.update", saveCreds);

    // Pairing
    if(!state.creds?.registered){
        const num = await question("\nEnter whatsapp number with country code: ");
        await sock.requestPairingCode(num);

        console.log("\n🔗 Pair this device using code:");
        console.log("   "+sock.authState.creds?.pairingCode+"\n");

        return;
    }

    console.log("\n✅ Pairing Done!\n");

    // MAIN MENU LOOP
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

start();