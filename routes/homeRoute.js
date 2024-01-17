const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/", (req, res) => {
    if(req.session.user){
        res.redirect("/secret");
    }
    else{
        res.render('home', {Title: 'Welcome'});
    }
    
});

router.get("/login", (req,res) => {
    if(req.session.user){
        res.redirect("/secret");
    }
    else{
        res.render("login", {error: " "});
    }
});

router.post("/login", (req, res) => {
    userController.login(req,res);
});

router.get("/register", (req,res) => {
    if(req.session.user){
        res.redirect("/secret");
    }
    else{
        res.render("register", {error: " "});
    }
});

router.post("/register",  (req, res) => {
    userController.registerUser(req,res);
});

router.get("/secret", (req, res) => {
    if(req.session.user){
        res.render("secret", {Title: " "});
    }
    else{
        res.redirect("/");
    }
});



module.exports = router;