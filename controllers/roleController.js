const Role = require('../model/role');
const User = require('../model/User');


async function addRole(request, response){
    try{
		const newRole = new Role();
		const role = await Role.findOne({ rolename: request.body.rolename });
		if(role){
			throw new Error("Role already exists");
		}
		newRole.rolename = request.body.rolename;
		if(!request.body.add){
			newRole.add = false;
		}
		if(!request.body.delete){
			newRole.delete = false;
		}
		if(!request.body.update){
			newRole.update = false;
		}
		if(!request.body.view){
			newRole.view = false;
		}
		newRole.add = request.body.add;
		newRole.update = request.body.update;
		newRole.delete = request.body.delete;
		newRole.view = request.body.view;
		await newRole.save();
		response.redirect("/roles/rolelist");
	}
	catch (error) {
    	response.render("Role/addrole", { Title: error });
    }
};

async function viewRoles(request, response){
	const user = await User.findOne({ username: request.session.user.username });	
	const role = await Role.findOne({ rolename: user.userrole });
    const roles = await Role.find({}, 'rolename add update delete view');
	response.render("Role/rolelist", {roles, role}); 
};


async function deleteRole(request, response){
    const RoleToDelete = request.body.rolename;
	await Role.findOneAndDelete({ rolename: RoleToDelete });
	response.redirect('/roles/rolelist');
};


async function updateRole(request, response){
	const editrole = await Role.find({rolename: request.body.rolename});
	try {
		if(!request.body.add){
			var add = false;
		}
		if(!request.body.delete){
			var dodelete = false;
		}
		if(!request.body.update){
			var doupdate = false;
		}
		if(!request.body.view){
			var view = false;
		}
		var add = Boolean(request.body.add);
		var doupdate = Boolean(request.body.update);
		var dodelete = Boolean(request.body.delete);
		var view = Boolean(request.body.view);
		const filter = { rolename: request.body.rolename };
		const update = { $set: {} };
		update.$set.add = add;
		update.$set.update = doupdate;
		update.$set.delete = dodelete;
		update.$set.view = view;
		const result = await Role.updateOne(filter, update);
		if (!result) {
		  response.render("Role/editrole", { Title: "Role does not exist" });
		} else {
		  response.redirect('/roles/rolelist');
		}
	  } catch (error) {
		console.error('Error updating role:', error);
		return response.render("Role/editrole", { role: editrole });
	  }
}


module.exports = {
	addRole,
	updateRole,
	deleteRole,
	viewRoles,
  };