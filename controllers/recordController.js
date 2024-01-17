const User = require('../model/User');
const Record = require('../model/record');
const Role = require('../model/role');



async function addRecord(request, response){
    try{
		const newRecord = new Record();
		newRecord.username = request.body.username;
		newRecord.fullname = request.body.fullname;
		await newRecord.save();
		response.redirect("/records/listrecord");
	}
	catch (error) {
    	response.render("Record/AddModule", { Title: "Error adding Record" });
    }
};


async function getRecords(request, response){
	const user = await User.findOne({ username: request.session.user.username });
	const role = await Role.findOne({ rolename: user.userrole });
	const newRecords = await Record.find({}, 'username fullname');
	response.render("Record/ListRecord", {newRecords, role}); 
};


async function deleteRecord(request, response){
	const RecordToDelete = request.body.username;
	await Record.findOneAndDelete({ username: RecordToDelete });
	response.redirect('/records/listrecord');
};


async function editRecord(request, response){
	try {
		const Records = await Record.findOne({username: request.body.username});
		const filter = { username: request.body.username };
		const update = { $set: {} };
		if(request.body.fullname.trim() == ''){
			var fullname = Records.fullname;
		}else{
			var fullname = request.body.fullname;
		}
		update.$set.fullname = fullname;
		const result = await Record.updateOne(filter, update);
		if (!result) {
		  response.render("Record/UpdateModule", { Title: "Record does not exist" });
		} else {
		  response.redirect('/records/listrecord');
		}
	  } catch (error) {
		console.error('Error updating role:', error);
		return response.status(500).json({ error: 'Internal server error.' });
	  }
};

module.exports = {
	addRecord,
	editRecord,
	deleteRecord,
	getRecords,
  };