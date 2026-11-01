const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;

const targetId = "1556690613540233374";
const message = "teste";

async function spam() {
  console.log("démarrage du spam...");
  
  // 1. créer le salon privé (dm)
  let dm = await fetch(`https://discord.com/api/v9/users/@me/channels`, {
    method: "POST",
    headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ recipient_id: targetId })
  });
  let dmData = await dm.json();
  
  if (!dmData.id) {
    console.log("erreur création dm :", dmData.message);
    return;
  }
  
  const channelId = dmData.id;
  console.log("salon dm créé :", channelId);

  // 2. boucle de spam
  for (let i = 0; i < 1000; i++) {
    await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
      method: "POST",
      headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content: `${message}` })
    }).catch(() => {});
    
    console.log(`message envoyé : ${i}`);
    await new Promise(r => setTimeout(r, 1000)); // pause de 1s
  }
  
  console.log("spam terminé.");
}

spam();
