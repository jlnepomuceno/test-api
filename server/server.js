const express = require("express");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const bodyParser = require("body-parser");

const { CreateUser, GetUser } = require('./src/appModel');

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
// app.use(bodyParser)
app.use(express.json());
app.use(cookieParser());

app.post('/login', (req, res) => {
    console.log("eto", "User" in req.cookies);
    const data = req.body;
    
    if ("User" in req.cookies) {
        // User is logged in 
        const resp = GetUser(data.id);

        let return_data = {user_id: null};
        if (resp.length > 0) return_data = {user_id: resp[0].id}

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(return_data));
    } else {
        const get_res = GetUser(data.id)
        console.log("get_res", get_res);
        let id = null;
        if (get_res.length === 0) {
            // user exists, return user data
            const create_res = CreateUser(data.id, data.name, "");
            id = create_res.id
        } else {
            id = get_res[0].id
        }
        res.status(202).cookie('User', id,{
            sameSite: true,
            path: '/',
            expires: new Date(new Date().getTime() + data.expiresIn * 1000),
            httpOnly: true
        }).send("cookie being initialized");
    }
});

app.get('/logout', (req, res) => {
    res.status(202).clearCookie('User').send("cookie cleared");
});

const port = 4000;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
})