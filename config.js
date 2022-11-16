const doctor_data = {
  email: 'marco@gmail.com',
  password: '123456',
};

const patient_data = {
  email: 'sallam1@gmail.com',
  password: '123456',
};

module.exports = (role) => {
  const creds = role === 'patient' ? patient_data : doctor_data;

  return {
    ...creds,
    API_URL: 'http://localhost:9000/api/v1',
    SOCKET_URL: 'http://localhost:9000',
    FILE_NAME: '/testo.txt',
    FILE_PATH: __dirname,
  };
};
