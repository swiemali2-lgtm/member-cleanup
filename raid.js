const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));

async function banAll() {
  let after = "0";
  while (true) {
    let res = await fetch(`https://discord.com/api/v9/guilds/${config.guild}/members?limit=1000&after=${after}`, {
      headers: { "Authorization": config.token }
    });
    let batch = await res.json();
    if (!batch.length) break;
    for (let m of batch) {
      await fetch(`https://discord.com/api/v9/guilds/${config.guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": config.token, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 500));
    }
    after = batch[batch.length - 1].user.id;
  }
}

banAll();