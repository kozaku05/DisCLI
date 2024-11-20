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
        "Available commands: exit , loop(loop message), change (change discord-webhookURL,url)"
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
        await axios.post(url, JSON.stringify(body), config);
        console.log("Message sent successfully");
        sendMessage();
      } catch (error) {
        console.log("Error sending message:", error.message);
        sendMessage();
        return;
      }
    };
    if (message) {
      if (message !== "loop") {
        send();
      }
    } else {
      console.log("Please enter a valid message");
      sendMessage();
    }
    if (message === "loop") {
      rl.question("message :", (message) => {
        if (!message) {
          console.log("Please enter a valid message");
          sendMessage();
          return;
        }
        rl.question("number :", async (num) => {
          parseInt(num);
          if (num === NaN) {
            console.log("Please enter a valid number");
            sendMessage();
            return;
          }
          let i = 0;
          while (i < num) {
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
            await send();
            if (i < num) {
              await new Promise((resolve) => setTimeout(resolve, 600)); // 3秒の遅延
            }
            i++;
          }
          sendMessage();
        });
      });
    }
  });
}
