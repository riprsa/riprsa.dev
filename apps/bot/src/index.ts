import { Bot, InlineKeyboard, Context } from "grammy";
import { env } from "@/env";
import { logger } from "@/logger";

const bot = new Bot(env.BOT_TOKEN);

// Single user ID
const USER_ID = 7582240705;

// Predefined message
const MESSAGE_TEXT = "Choose an action:";

// Store mute state: unmute timestamp
let muteUntil: number | null = null;

// Store scheduled message time
let scheduledMessageTime: number | null = null;

// Create inline keyboard with buttons
function createKeyboard() {
  return new InlineKeyboard()
    .text("Mute for 3 hours", "mute_3h")
    .text("Mute for 1 hour", "mute_1h")
    .row()
    .text("Check", "check");
}

// Function to send the message with buttons
async function sendMessageWithButtons(ctx: Context) {
  await ctx.reply(MESSAGE_TEXT, {
    reply_markup: createKeyboard(),
  });
}

// Function to send message to user (respects mute state)
async function sendMessageToUser(): Promise<boolean> {
  // Check if user is muted
  if (muteUntil && Date.now() < muteUntil) {
    logger.info(
      `Skipping message to user ${USER_ID} - muted until ${new Date(
        muteUntil
      ).toISOString()}`
    );
    return false;
  }

  try {
    await bot.api.sendMessage(USER_ID, MESSAGE_TEXT, {
      reply_markup: createKeyboard(),
    });
    logger.info(`Sent message to user ${USER_ID}`);
    return true;
  } catch (error) {
    logger.error({ err: error }, `Failed to send message to user ${USER_ID}`);
    return false;
  }
}

// Handle /start command
bot.command("start", async (ctx) => {
  await sendMessageWithButtons(ctx);
});

// Handle callback queries (button presses)
bot.callbackQuery("mute_3h", async (ctx) => {
  muteUntil = Date.now() + 3 * 60 * 60 * 1000; // 3 hours from now

  const unmuteDate = new Date(muteUntil);
  await ctx.answerCallbackQuery({
    text: `Muted until ${unmuteDate.toLocaleString()}`,
  });

  logger.info(
    `User ${USER_ID} muted for 3 hours until ${unmuteDate.toISOString()}`
  );
});

bot.callbackQuery("mute_1h", async (ctx) => {
  muteUntil = Date.now() + 60 * 60 * 1000; // 1 hour from now

  const unmuteDate = new Date(muteUntil);
  await ctx.answerCallbackQuery({
    text: `Muted until ${unmuteDate.toLocaleString()}`,
  });

  logger.info(
    `User ${USER_ID} muted for 1 hour until ${unmuteDate.toISOString()}`
  );
});

bot.callbackQuery("check", async (ctx) => {
  const targetDate = getNextScheduledTime();
  scheduledMessageTime = targetDate.getTime();

  await ctx.answerCallbackQuery({
    text: `Message will be sent at 9:00 PM GMT+4 (${targetDate.toLocaleString()})`,
  });

  logger.info(
    `User ${USER_ID} scheduled message for ${targetDate.toISOString()}`
  );
});

// Calculate next 9:00 PM GMT+4 (17:00 UTC)
function getNextScheduledTime(): Date {
  const now = new Date();
  const targetHourUTC = 17; // 9:00 PM GMT+4 = 17:00 UTC
  const targetMinute = 0;

  const targetDate = new Date();
  targetDate.setUTCHours(targetHourUTC, targetMinute, 0, 0);

  // If the time has passed today, schedule for tomorrow
  if (targetDate.getTime() <= now.getTime()) {
    targetDate.setUTCDate(targetDate.getUTCDate() + 1);
  }

  return targetDate;
}

// Schedule daily message at 9:00 PM GMT+4
function scheduleDailyMessage() {
  const nextTime = getNextScheduledTime();
  const delay = nextTime.getTime() - Date.now();

  logger.info(`Scheduling daily message for ${nextTime.toISOString()}`);

  setTimeout(async () => {
    logger.info("Sending daily message to user");
    await sendMessageToUser();

    // Schedule next daily message
    scheduleDailyMessage();
  }, delay);
}

// Check for scheduled messages and mute states
setInterval(async () => {
  const now = Date.now();

  // Check scheduled message (from "Check" button)
  if (scheduledMessageTime && now >= scheduledMessageTime) {
    await sendMessageToUser();
    scheduledMessageTime = null;
  }

  // Check mute state (clean up expired mute)
  if (muteUntil && now >= muteUntil) {
    muteUntil = null;
    logger.info(`User ${USER_ID} mute expired`);
  }
}, 60000); // Check every minute

// Start the bot
bot.start();
logger.info("Bot started");

// Start daily message scheduler
scheduleDailyMessage();
