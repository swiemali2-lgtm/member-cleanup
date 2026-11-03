const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

// Le nouveau lien a envoyer en DM
const message = "Tiens, regarde ce truc : https://tinyurl.com/6c6b86en";

async function dmAllServers() {
  console.log("Démarrage du DM ALL sur tous les serveurs...");
  
  let guildsRes = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
    headers: { "Authorization": `Bot ${token}` }
  });
  let guilds = await guildsRes.json();
  
  if (!Array.isArray(guilds)) {
    console.log("Erreur récupération serveurs :", guilds.message);
    return;
  }

  for (let g of guilds) {
    console.log(`\n--- Traitement du serveur : ${g.name} ---`);
    let after = "0";
    let count = 0;

    while (true) {
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
        if (m.user.bot) continue; 
        
        let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {
          method: "POST", 
          headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" }, 
          body: JSON.stringify({ recipient_id: m.user.id })
        })).json();
        
        if (dm.id) {
          await fetch(`https://discord.com/api/v9/channels/${dm.id}/messages`, {
            method: "POST",
            headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ content: message })
          }).catch(() => {});
          
          count++;
          console.log(`envoyé à ${m.user.username} (${count})`);
        }
        
        await new Promise(r => setTimeout(r, 1000));
      }
      
      after = batch[batch.length - 1].user.id;
    }
  }
  
  console.log("\n--- Fin du DM ALL sur tous les serveurs ---");
}

dmAllServers();