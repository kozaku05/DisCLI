const readline = require("readline");
const axios = require("axios");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let url = "";
let name = "";
let iconURL = "";
function setURL() {
  rl.question("discord-webhookURL: ", (webhook) => {
    if (!webhook) {
      console.log("Please enter a valid URL");
      setURL();
      return;
    }
    url = webhook;
    console.log("URL set successfully url:" + url);
    setUsername();
  });
}
function setUsername() {
  rl.question("Username: ", (username) => {
    if (!username) {
      console.log("Please enter a valid username");
      setUsername();
      return;
    }
    console.log("Username set successfully username:" + username);
    name = username;
    setIconurl();
  });
}
function setIconurl() {
  rl.question("Icon URL: ", (icon) => {
    iconURL = icon;
    sendMessage();
  });
}
setURL();
function sendMessage() {
  rl.question("Enter your message :(command: help): ", (message) => {
    if (message === "exit") {
      rl.close();
      return;
    }
    if (message === "change") {
      setURL();
      return;
    }
    if (message === "help") {
      console.log(
        "Available commands: exit , change (change discord-webhookURL,url)"
      );
      sendMessage();
      return;
    }
    const send = async () => {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      };
      let body = {
        username: name,
        content: message,
        avatar_url: iconURL,
      };
      try {
        let post = await axios.post(url, JSON.stringify(body), config);
        console.log("Message sent successfully:", post.data);
        sendMessage();
      } catch (error) {
        console.log("Error sending message:", error.message);
        sendMessage();
        return;
      }
    };
    if (message) {
      send();
    } else {
      console.log("Please enter a valid message");
      sendMessage();
    }
  });
}
