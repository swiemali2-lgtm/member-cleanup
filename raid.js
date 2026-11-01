const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";

async function banAll() {
  console.log("démarrage du ban all...");
  let after = "0";
  let count = 0;

  while (true) {
    let res = await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000&after=${after}`, {
      headers: { "Authorization": `Bot ${botToken}` }
    });
    let batch = await res.json();
    
    if (batch.message) {
      console.log("erreur discord :", batch.message);
      break;
    }
    
    if (!batch.length) {
      console.log("plus de membres.");
      break;
    }
    
    // On ban tout le monde en même temps pour aller vite
    let bans = batch.map(m => {
      if (m.user.bot) return Promise.resolve(); // on skip les bots
      return fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
    });
    
    await Promise.all(bans);
    count += batch.length;
    console.log(`membres bannis : ${count}`);
    
    after = batch[batch.length - 1].user.id;
    await new Promise(r => setTimeout(r, 1000)); // pause anti rate-limit
  }
  
  console.log("fini, total :", count);
}

banAll();