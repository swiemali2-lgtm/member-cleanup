const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const guild = "1566222855522488401";

async function nuke() {
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {headers: {"Authorization": `Bot ${config.token}`}})).json();
  for (let c of channels) {
    await fetch(`https://discord.com/api/v9/channels/${c.id}`, {method: "DELETE", headers: {"Authorization": `Bot ${config.token}`}}).catch(()=>{});
    await new Promise(r => setTimeout(r, 150));
  }
}
nuke();