const { json } = require("body-parser");
const express = require("express");
const db = require("./db");

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const results = await db.all();
    res.json(results);
  } catch(e) {
    console.error(e);
    res.sendStatus(500)
  } 
})

router.get('/:username', async (req, res, next) => {
  console.log("req.params.username", req.params.username);
  try {
    const results = await db.oneByUsername(req.params.username);
    console.log("results", results);
    res.json(results);
  } catch(e) {
    console.error(e);
    res.sendStatus(500)
  } 
})

router.post('/login', async (req, res) => {
  try {
    console.log("eto", "User" in req.cookies);
    const data = req.body;
    console.log("data", data);    
    if ("User" in req.cookies) {
        // User is logged in 
        const user = await db.oneByUsername(data.id);
        if (user !== "undefined") {
            // RETURN USER PLUS OTHER NEEDED INFO
            res.json(user);
        }
    } else {
        // Will create cookie, but first, check if username exists
        // Check if username exists
        let return_data = null;
        const user = await db.oneByUsername(data.id);

        let user_id = null;
        if (user !== undefined) {
            // RETURN USER PLUS OTHER NEEDED INFO
            user_id = user.id;
            return_data = user;
        } else {
            const create_res = await db.createUser({
                username: data.id, 
                name: data.name, 
                password:""
            });
            console.log("create_res", create_res);
            user_id = create_res.id;
            return_data = create_res
        }

        res.status(202).cookie('User', user_id,{
            sameSite: true,
            path: '/',
            expires: new Date(new Date().getTime() + data.expiresIn * 1000),
            httpOnly: true
        }).json(return_data.insertId);
    }
  } catch (e) {
      console.error(e);
      res.sendStatus(500);
  }

});

router.get('/logout/removeCookie', (req, res, next) => {
  try {
    res.status(202).clearCookie('User').send("cookie cleared");
  } catch (e) {
      console.error(e);
      res.sendStatus(500);
  }
});

module.exports = router;