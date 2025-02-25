export async function sendAlertToTeam(message: string): Promise<void> {
  // Implement your notification logic here.
  // This could involve sending an email, a Slack message, or any other form of notification.
  console.log(`Sending alert to team: ${message}`)
  // Placeholder implementation:
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      console.warn("DISCORD_WEBHOOK_URL is not set. Skipping Discord notification.")
      return
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Alert: ${message}`,
      }),
    })

    if (!response.ok) {
      console.error(`Failed to send Discord notification. Status: ${response.status}, Text: ${await response.text()}`)
    } else {
      console.log("Discord notification sent successfully.")
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error)
  }
}

