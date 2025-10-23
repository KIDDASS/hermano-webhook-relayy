export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, imageUrl, time, type } = req.body;

  const webhook = process.env.DISCORD_WEBHOOK;

  if (!webhook) {
    return res.status(500).json({ error: 'Missing DISCORD_WEBHOOK environment variable' });
  }

  const content = `**Username:** ${username}\n**Type:** ${type}\n**Time:** ${time}`;
  
  const data = {
    content,
    embeds: imageUrl ? [
      {
        image: { url: imageUrl }
      }
    ] : []
  };

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Discord error: ${response.status}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
