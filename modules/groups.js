module.exports = async (sock)=>{
    let groups = Object.values(await sock.groupFetchAllParticipating());

    console.log("\nYour Groups:\n");

    groups.forEach(g=>{
        console.log(`\x1b[34m${g.subject}\x1b[0m → \x1b[33m${g.id}\x1b[0m`);
    });

    console.log("");
};