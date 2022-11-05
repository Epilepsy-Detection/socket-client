const { io } = require("socket.io-client");
const fs = require("fs");
const config = require("./config");
const axios = require('axios');


// Read from config file
// authenticate using auth API (email, password)
// Open connection to the server
// Send EEG data through the socket connection

const getToken = async () => {
  try {
      const resp = await axios.post('http://localhost:9000/api/v1/auth/login', {
        email: config.email,
        password: config.password,
      });
      const token = resp.data.data.token;

      if(resp.status === 200){

        const socket = io("http://localhost:9000", {auth: {
          token: token
      }});

        socket.on("connect", () => {
          console.log("connected successfulyl!");
        
          const reader = fs.createReadStream(__dirname + "/testo.txt");
        
          reader.on("data", (chunk) => {
            socket.emit("new-message", chunk);
          });
        });
        
        socket.on("disconnect", () => {
          console.log("disconnected successfully!");
        });
      }
  } catch (err) {
      console.error(err);
  }
};


getToken();

