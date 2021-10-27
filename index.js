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
  await apiClient.helix.eventSub.subscribeToChannelFollowEvents("giantwaffle", {
    callbackUrl: callbackURL,
  });
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

app.listen(PORT, () => {
  console.log("RUNNING ON PORT 80");
});
