const { io } = require("socket.io-client");
const axios = require('axios');

// Read from config file
const config = require("./config");
const readFileAsStream = require("./readFileAsStream");

const authenticateSocket = async () => {
  try {
    // authenticate using auth API (email, password)
    const response = await axios.post(config.API_URL + '/auth/login', {
      email: config.email,
      password: config.password,
    });
    const token = response.data.data.token;

    if (response.status !== 200) {
      throw new Error("Invalid Status code")
    }

    // Open connection to the server
    const socket = io(config.SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      }
    });

    socket.on("connect", () => {
      console.log("connected successfully!");

      // Send EEG data through the socket connection
      const fileName = config.FILE_PATH + config.FILE_NAME;
      readFileAsStream(fileName, (chunk) => {
        socket.emit("new-message", chunk);
      });
    });

    socket.on("disconnect", () => {
      console.log("disconnected successfully!");
    });

  } catch (err) {
    console.error(err);
  }
};

authenticateSocket();

