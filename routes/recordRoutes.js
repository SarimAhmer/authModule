const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Role = require('../model/role');
const Records = require('../model/record');
const recordController = require('../controllers/recordController');


router.get("/listrecord", async(req, res) => {
	const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.view){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		recordController.getRecords(req, res);
	}
});

router.get("/addrecord", async (req, res) => {
    const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.add){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		res.render("Record/AddRecord", {Title: "Add A New Record"});
	}
	
})

router.post("/addrecord", (req, res)=>{
    recordController.addRecord(req,res);
});

router.post("/deleterecord", async(req, res)=>{
	const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.delete){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		recordController.deleteRecord(req,res);	
	}
    
});


router.get("/updaterecord",async (req,res)=>{
    const user = await User.findOne({ username: req.session.user.username });
	const role = await Role.findOne({rolename: user.userrole});
	if(!role.update){
		res.render("secret", { Title: "You are not an admin" });
	}
	else{
		const RecordToUpdate = req.query.username;
		const Record = await Records.findOne({ username: RecordToUpdate });
		res.render('Record/UpdateRecord', { Record });
	}
	
});

router.post("/updaterecord", (req, res) => {
    recordController.editRecord(req,res);
});



module.exports = router;
