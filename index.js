require('dotenv').config()
var express = require('express');
var app = express();
var cors = require('cors');
// var bodyParser = require('body-parser')

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '550467040202-papd023rtkrv64nkq62s6t4l9gshsr1t.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload);
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}
// verify().catch(console.error);

app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }));

// app.use(bodyParser.json());

app.get('/', (req, res) => {
    // verify(token);
    console.log(req.query);
    // res.set('Content-Type', 'text/xml');
    res.send('Hello');
    
})

app.listen(process.env.PORT);
