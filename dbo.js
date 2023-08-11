const mon = require('mongoose');

require('dotenv').config();

mon.connect(process.env.MONGO_URI)
    .then(() => console.log("app is connected with db successfully"))
    .catch((e) => console.log(e))
