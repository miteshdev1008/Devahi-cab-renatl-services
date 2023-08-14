const exp = require('express');
const app = exp();
const cors = require('cors');
const vehicleModel = require('./models/vehicleModel');

//cookieparser package for alert npm
const cookieParser = require("cookie-parser");

//allowing cross origin resourse
app.use(cors());
//defining usermodel
const usermodel = require('./models/user');

//configure the .env file
app.use(cookieParser());
require('dotenv').config();

//configure database file
require('./dbo');

//path varibale
var path = require('path');

//requiring a package bodyparser
const bp = require('body-parser');

//requiring a methods from middleware
const { createToken, isLogin } = require('./middlewares/authandtoken');

//method for getting al vehicle data
const { getData } = require('./controllers/vehicleController');

//parsing url
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//serve static file
app.use(exp.static(path.join(__dirname, 'public')));

app.use(exp.static('public/devahi'));

//for all admin sides path
const publicpath = path.join(__dirname, 'public/admin');
//for all user side path
const newResolution = path.join(__dirname, 'public');

console.log("abc" + __dirname);

//configure the dootenv
const port = process.env.PORT;
const url = process.env.URL;

//routes
app.use('/api/v1/vehicle', require('./routes/vehicleRoute'));

app.use('/api/v1/customer', require('./routes/customerRoute'));



//when user hits login api
app.get('/admin/login', (req, res) => {

    //checking cookies if it's undefined or not
    if (req.cookies.sessiontoken != undefined) {
        console.log("in if")
        res.redirect('/admin/index');
    }
    else {
        console.log("in else")
        res.sendFile(`${publicpath}/login.html`);
    }
});

//post request for login
app.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // const isEmail = /^\S+@\S+\.\S+$/;
        // //checking if this email is proper or not
        // if (!isEmail.test(email)) return res.status(200).json({ success: false, message: 'Enter valid email.' });

        //finding admin
        const finduser = await usermodel.find({ username: email });

        //if admin not found then condition
        if (finduser.length <= 0) return res.status(200).json({ success: false, message: 'Your username is wrong.' });

        //checking user password
        if (finduser[0].password == password) {
            const sessiontoken = createToken(finduser[0]._id);// Generate a secure  token
            //creating a cookie
            res.cookie('sessiontoken', sessiontoken, { maxAge: 90000000, httpOnly: false });

            //redirecting admin
            res.redirect('/admin/index');
        }
        else {

            return res.json({ success: false, message: 'Your password is wrong.' });
        }
    }
    catch (error) {
        res.status(304).json({ success: false, message: error });
    }
});

//edit-vehicle
app.get('/admin/editvehicle/:id', isLogin, (req, res) => {
    res.sendFile(`${publicpath}/editedVehicle.html`)
});

//index get request
app.get('/admin/index', isLogin, (req, res) => {
    console.log("first")
    res.sendFile(`${publicpath}/index.html`);
});

//logout
app.get('/admin/logout', (req, res) => {
    //when user loggedout clear cookies
    console.log("yes loggedout");
    res.clearCookie('sessiontoken');
    res.redirect('/admin/login');
});

//editprofilie get request
app.get('/admin/editprofile', isLogin, (req, res) => {
    res.sendFile(`${publicpath}/editProfile.html`)
});

//post request
app.post('/admin/editprofile', isLogin, async (req, res) => {

    try {
        const userid = req.user;

        await usermodel.findByIdAndUpdate(userid, { $set: req.body }, { new: true });

        res.status(200).json({ success: true });

        return;
    }
    catch (error) {
        res.status(304).json({ success: false, message: error });
    }

}
);

//get all vehicle
app.get('/admin/Vehicle', isLogin, async (req, res) => {
    res.sendFile(`${publicpath}/getAllVehicle.html`)
});

//adding a vehicle
app.get('/admin/addvehicle', isLogin, (req, res) => {
    res.sendFile(`${publicpath}/addVehicle.html`);
})

//get data for  data table
app.get('/api/data', getData);

//update a data table
app.post('/getdata', isLogin, async (req, res) => {
    try {
        const id = req.body.id;
        const finddata = await vehicleModel.findOne({ _id: id });
        res.json(finddata);
    }
    catch (error) {
        res.status(304).json({ success: false, message: error });
    }
})

//to show all userside componantss
app.get('/', (req, res) => {
    res.sendFile(`${newResolution}/index.html`)
})

//to give all data
app.get('/givedata', isLogin, async (req, res) => {
    const user = await usermodel.find().select();
    res.json({ data: user })
});

//to give a user data
app.get('/giveuserdata', async (req, res) => {
    const user = await usermodel.find().select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0 });
    res.json({ data: user })
});

//to show get request user's enquiries
app.get('/admin/getallenquiries', isLogin, (req, res) => {
    res.sendFile(`${publicpath}/getAllEnquiries.html`)
});

//to showing all paid enquiries
app.get('/admin/getallpaidenquiries', isLogin, (req, res) => {
    res.sendFile(`${publicpath}/paidEnquireyDetails.html`)
});
        
app.get('/privacyPolicy', (req, res) => {
    res.sendFile(`${newResolution}/PrivacyPolicy.html`)
});

app.get('/termsAndConditions', (req, res) => {
    res.sendFile(`${newResolution}/TermsandConditions.html`)
});

//default route when nothing is matched 
app.get('*', (req, res) => {
    res.sendFile(`${publicpath}/notfound/index.html`)
});

app.listen(port, url, () => {
    console.log(`app is live on ${url}:` + port);
});

module.exports = app;