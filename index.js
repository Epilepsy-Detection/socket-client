const { io } = require('socket.io-client');
const axios = require('axios');

// Read from config file
const readFileAsStream = require('./readFileAsStream');

const args = process.argv.slice(2);
const role = args[0] ?? 'doctor';
const config = require('./config')(role);

const authenticateSocket = async () => {
  try {
    // authenticate using auth API (email, password)
    const response = await axios.post(config.API_URL + '/auth/login', {
      email: config.email,
      password: config.password,
    });

    const token = response.data.data.token;

    if (response.status !== 200) {
      throw new Error('Invalid Status code');
    }

    // Open connection to the server
    const socket = io(config.SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.log('connected successfully!');

      // Send EEG data through the socket connection
      if (role === 'patient') {
        const fileName = config.FILE_PATH + config.FILE_NAME;
        readFileAsStream(fileName, (chunk) => {
          socket.emit('new-eeg-batch-message', chunk);
        });
      } else if (role === 'doctor') {
        socket.emit("get_active_patients")
      }
    });

    socket.on("active_patients_result", (patientsIds) => {
      if (patientsIds && patientsIds.length > 0) {
        const patientId = patientsIds[0];
        socket.emit("associate_patient", patientId);
      }
    });

    socket.on('new-patient-message', (msg) => {
      console.log(msg);
    });

    socket.on('disconnect', () => {
      console.log('disconnected successfully!');
    });

    socket.on('connect_error', (err) => {
      console.log('Failed to connect', err);
    });
  } catch (err) {
    console.error(err);
  }
};

authenticateSocket();
