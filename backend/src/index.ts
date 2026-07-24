import { createApp } from "./app.js";
import { startReminderScheduler } from "./services/reminderScheduler.js";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  console.log(`Geriatric Grooves API listening on http://localhost:${port}`);
});

startReminderScheduler();
