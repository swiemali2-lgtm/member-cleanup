const token = "MTU2NTE4OTU2MTg5MjQ3NTAwMA.GIR000.44BI8fHRS8iFPHy-pxTvoPQav29y5N6fAXXcW0";
const guild = "1546202369073614898";

async function nuke() {
  console.log("démarrage du nuke...");
  
  // 1. supprimer les salons
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

  // 2. supprimer les rôles
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

  console.log("fini le nuke.");
}

nuke();
