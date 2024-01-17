const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Role = require('../model/role');
const userController = require('../controllers/userController');


router.post("/deleteuser", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.delete){
        res.render("secret", { Title: "You are not authorized!" });
	}
    else{
        userController.deleteUser(req, res);
    }
    
});

router.get("/updateuser", async (req, res) => {
    const users = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: users.userrole});
	if(!role.update){
        res.render("secret", { Title: "You are not authorized!" });
	}
    else{
        const roles = await Role.find({}, 'rolename');
        const userToUpdate = req.query.username;
        const user = await User.findOne({ username: userToUpdate });
        res.render('User/updateuser', {error: '', user, roles });
    }
});

router.post("/updateuser", (req, res) => {
    userController.editUser(req, res);
});

router.get("/adduser", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
    const roles = await Role.find({}, 'rolename');
	if(!role.add){
	    res.render("secret", { Title: "You are not authorized!" });
	}
    else{
        res.render("User/adduser", { error: "", roles});
    }
})

router.post("/adduser", (req, res) => {
    userController.addUser(req, res);
});

router.get("/userslist",async (req, res)=> {
    const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.view){
        res.render("secret", { Title: "You are not authorized!" });
	}
    else{
        userController.getUser(req,res);
    }	
});

router.get("/signout" ,(req, res) => {
   userController.signout(req,res);
});


module.exports = router;
