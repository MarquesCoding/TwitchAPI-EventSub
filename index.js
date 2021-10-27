require("dotenv").config();
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const { ApiClient } = require("twitch");

const express = require("express");
const clientID = process.env.CLIENT_ID;
const clientTOKEN = process.env.CLIENT_TOKEN;
const PORT = process.env.PORT;

//Setting up for your twitch
const authProvider = new ClientCredentialsAuthProvider(clientID, clientTOKEN);
const apiClient = new ApiClient({ authProvider });

//Set this URL to the outputted URL from ngrok

const callbackURL = process.env.CALLBACKURI;

const app = express();

async function createEventSub() {
  //Create a listener for when someone follows to giantwaffle.
  await apiClient.helix.eventSub.subscribeToChannelFollowEvents(
    "YOUR TWITCH CHANNEL NAME",
    {
      callbackUrl: callbackURL,
    }
  );
  console.log("EventSub created.");
}

//ENDPOINT FOR TWITCH FOR SETTING UP A EVENTSUB

app.post("/webhook/callback", (req, res) => {
  if (req.body.challenge) {
    res.status(200).json({ success: "Accepted." });
  } else {
    res.status(200).json(req.body);
    console.log(req.body);
  }
});

app.get("/createEvent", async (req, res) => {
  await createEventSub();
});

app.get("/eventSubs", async (req, res) => {
  //Searches TwitchAPI with your Application credientials for EventSubs
  const response = await apiClient.helix.eventSub.getSubscriptions();
  if (!response) {
    res
      .status(200)
      .json({ message: `There are no event subscriptions setup.` });
  } else {
    res.status(200).json(response);
  }
});

app.listen(PORT, () => {
  console.log("RUNNING ON PORT 80");
});
