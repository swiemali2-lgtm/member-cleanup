const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const token = config.token;

const guildId = "1566873776073998358"; // L'ID de ton serveur
const message = "Tiens, regarde ce truc : https://bit.ly/4z3f03v"; // Le message avec le lien

async function dmAll() {
  console.log("Démarrage du DM ALL...");
  let after = "0";
  let count = 0;

  while (true) {
    // Récupère la liste des membres
    let res = await fetch(`https://discord.com/api/v9/guilds/${guildId}/members?limit=1000&after=${after}`, {
      headers: { "Authorization": `Bot ${token}` }
    });
    let batch = await res.json();
    
    if (batch.message) { 
      console.log("Erreur :", batch.message); 
      break; 
    }
    if (!batch.length) { 
      console.log("Plus de membres à qui envoyer."); 
      break; 
    }
    
    for (let m of batch) {
      if (m.user.bot) continue; // On ne s'envoie pas de DM aux bots
      
      // Créer le salon DM
      let dm = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, {
        method: "POST", 
        headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" }, 
        body: JSON.stringify({ recipient_id: m.user.id })
      })).json();
      
      // Si le salon DM est créé, on envoie le message
      if (dm.id) {
        await fetch(`https://discord.com/api/v9/channels/${dm.id}/messages`, {
          method: "POST",
          headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ content: message })
        }).catch(() => {});
        
        count++;
        console.log(`Message envoyé à ${m.user.username} (${count})`);
      } else {
        console.log(`Impossible d'envoyer un DM à ${m.user.username} (MP fermés)`);
      }
      
      // Pause de 1 seconde pour ne pas se faire bannir par discord
      await new Promise(r => setTimeout(r, 1000));
    }
    
    after = batch[batch.length - 1].user.id;
  }
  
  console.log("Fin du DM ALL. Total envoyés :", count);
}

dmAll();
