const jwt = require('jsonwebtoken');
//seckey
require('dotenv').config();

const seckey = process.env.SECKEY

//creatng a token
const createToken = (id) => {
    const token = jwt.sign({ id: id }, seckey)
    return token;
}

//cheks that user is login and if login then verify
const isLogin = (req, res, next) => {
    // //if cookie is avilable then extract token and checks token
    const token = req.cookies.sessiontoken;
    if (req.cookies.sessiontoken == undefined) {
        res.redirect('/');
        console.log("inlogin")
        return;
    }
    //if cookie is avilable then extract token and checks token
    if (token) {
        const verify = jwt.verify(token, seckey);
        //asigiining the id to req.user
        req.user = verify.id;
        next();
    }
    else {
        console.log("a")
        res.redirect('/admin/login');
    }
}
module.exports = { createToken, isLogin }