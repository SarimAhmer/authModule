const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Role = require('../model/role');
const roleController = require('../controllers/roleController');

router.get("/rolelist", async(req, res) => {
	const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.view){
        res.render("secret", { Title: "You are not authorized!" });
	}
    else{
		roleController.viewRoles(req, res);
    }
});

router.get("/addrole", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.add){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		res.render("Role/addrole", {Title: "Add A New Role"});
	}
})

router.post("/addrole", (req,res) => {
    roleController.addRole(req,res);
});

router.post("/deleterole", async(req, res)=>{
	const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.delete){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		roleController.deleteRole(req,res);
	}
});

router.get("/updaterole", async (req, res) =>{
    const user = await User.findOne({ username: req.session.user.username });
	const roles = await Role.findOne({rolename: user.userrole});
	if(!roles.update){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		const roleToUpdate = req.query.rolename;
		const role = await Role.findOne({ rolename: roleToUpdate });
		res.render('Role/editrole', { role });
	}
});

router.post("/updaterole", (req, res) => {
    roleController.updateRole(req,res);
});



module.exports = router;
