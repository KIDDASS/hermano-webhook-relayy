export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, type, time, imageUrl } = req.body;

    // ✅ Your Discord Webhook (from environment variable)
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhook) {
      return res.status(500).json({ error: 'Missing Discord webhook URL' });
    }

    // ✅ Format the message to send to Discord
    const message = {
      embeds: [
        {
          title: `📋 Attendance Log`,
          color: type === "Time Out" ? 0xff0000 : 0x00ff00,
          fields: [
            { name: "👤 Username", value: username || "Unknown", inline: true },
            { name: "🕒 Type", value: type || "N/A", inline: true },
            { name: "📅 Time", value: time || "N/A", inline: false }
          ],
          image: { url: imageUrl || null },
          timestamp: new Date().toISOString()
        }
      ]
    };

    // ✅ Send to Discord
    const discordResponse = await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();
      throw new Error(`Discord error: ${errorText}`);
    }

    return res.status(200).json({ success: true, message: 'Sent to Discord!' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
