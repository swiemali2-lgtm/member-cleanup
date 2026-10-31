const token = "MTU2NTE4OTU2MTg5MjQ3NTAwMA.GIR000.44BI8fHRS8iFPHy-pxTvoPQav29y5N6fAXXcW0";
const guild = "1546202369073614898";

async function banAll() {
  console.log("démarrage...");
  let after = "0";
  let count = 0;
  while (true) {
    let res = await fetch(`https://discord.com/api/v9/guilds/${guild}/members?limit=1000&after=${after}`, {
      headers: { "Authorization": `Bot ${token}` }
    });
    let batch = await res.json();
    
    if (batch.message) {
      console.log("erreur discord :", batch.message);
      break;
    }
    
    if (!batch.length) {
      console.log("plus de membres.");
      break;
    }
    
    for (let m of batch) {
      await fetch(`https://discord.com/api/v9/guilds/${guild}/bans/${m.user.id}`, {
        method: "PUT",
        headers: { "Authorization": `Bot ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ delete_message_seconds: 604800 })
      }).catch(() => {});
      count++;
      console.log(`ban : ${count}`);
      await new Promise(r => setTimeout(r, 500));
    }
    after = batch[batch.length - 1].user.id;
  }
  console.log("fini, total :", count);
}

banAll();
