const { Console } = require('console');
const User = require('../model/User');
const Role = require('../model/role');
const crypto = require('crypto');

	async function addUser(request, response){
		try{
			const users = await User.findOne({username:request.body.username});
			const email = await User.findOne({email: request.body.email});
			if(users){
				throw new Error("Username already exists");
			}
			if(email){
				throw new Error("Email already in use");
			}
			if(request.body.username.trim() === ''){
				throw new Error("Username can not be blank");	
			}
			var salt = crypto.randomBytes(16).toString('hex');
			let newusers = new User();
			newusers.username = request.body.username;
			newusers.salt = salt;
			newusers.fullname = request.body.fullname;
			newusers.email = request.body.email;
			newusers.userrole = request.body.userrole;
			newusers.password = crypto.pbkdf2Sync(request.body.password, salt, 500, 32, 'sha512').toString('hex');
			try{
				await newusers.save();
				return response.redirect("/users/userslist");
			}
			catch(error){
				throw new Error("Error while saving"+error);	
			}
		}
		catch (error){
			const roles = await Role.find({}, 'rolename');
			response.render("User/adduser", {error: error, roles});
		}
	};

	async function registerUser(request, response){
		try{
			const user = await User.findOne({username:request.body.username});
			const email = await User.findOne({email: request.body.email});
			if(user){
				throw new Error("Username already exists!");
			}
			if(email){
				throw new Error("Email already inuse!");
			}
			if(request.body.username.trim() === ''){
				throw new Error("can not be blank");	
			}
			var salt = crypto.randomBytes(16).toString('hex');
			let newuser = new User();
			newuser.username = request.body.username;
			newuser.salt = salt;
			newuser.fullname = request.body.fullname;
			newuser.email = request.body.email;
			newuser.password = crypto.pbkdf2Sync(request.body.password, salt, 500, 32, 'sha512').toString('hex');
			try{
				await newuser.save();
				request.session.user = {
					id : 1,
					username: request.body.username
				};
				response.redirect("/secret");
			}
			catch(error){
				throw new Error("Usercould not be saved"+error);
			}
		}
		catch(error){
			response.render("register", {error: error});
		}
	};

	async function login(request, response){
		try{
			const user = await User.findOne({username:request.body.username}).select("+salt");
			const hashed = crypto.pbkdf2Sync(request.body.password, user.salt, 500, 32, 'sha512').toString('hex');
			const result = user.password === hashed;
			if(!user){
				throw new Error("Incorrect username");
			}
			if (!result) {
				throw new Error("Incorrect Password");
			}
			request.session.user = {
			id : 1,
			username: request.body.username
			};
			response.redirect("/secret");	
		}
		catch(error){
			response.render("login", {Title: "Login in to continue",error:error});
		}
		
	};

	async function deleteUser(request, response){
		try{
			const usernameToDelete = request.body.username;
			await User.findOneAndDelete({ username: usernameToDelete });
			response.redirect("/users/userslist");
		}
		catch(error){
			console.log("error when deleting"+error);
		}
	};

	async function editUser(request, response){
		const userToUpdate = request.body.username;
		const user = await User.findOne({ username: userToUpdate });
		try{
			const username = request.body.username;
			const user1 = await User.findOne({ username: username });	
			var fullname = request.body.fullname;
			var email = request.body.email;
			const mailcheck = user1.email;
			if(email !== mailcheck ){
				const mail = await User.findOne({email: email});
				if(mail){
					throw new Error("Email already exists");
				}
			}
			const userrole = request.body.userrole;
			if (!username && (!fullname || !email)) {
				throw new Error("Please enter email or fullname");
			}
			try {
				const filter = { username: request.body.username };
				const update = { $set: {} };
				update.$set.fullname = fullname;
				update.$set.email = email;
				update.$set.userrole = userrole;
				const result = await User.updateOne(filter, update);
				if (!result) {
					throw new Error("User could not be updated");
				} else {
					response.redirect("/users/userslist");
				}
			} catch (error) {
				throw new Error(error);
			}
		}
		catch(error){
			const roles = await Role.find({}, 'rolename');
			response.render("User/updateuser", {error: error, user,roles });
		}
	};

	async function getUser(request,response){
		try{
			const user = await User.findOne({ username: request.session.user.username });
			const role = await Role.findOne({ rolename: user.userrole });	
			const users = await User.find({}, 'username fullname email userrole');
			response.render("User/userlist", {users, role, error:""});
		}
		catch(error){
			console.log("error when fetching usernames"+error);
		}
	};

	function signout(request, response){
		request.session.destroy((err) => {
					if(err){
						return next(err);
					}
					else{
						request.logout(function(err1){
							if(err){
								return next(err1);
							}
							else{
								response.render("home", { Title: "You have logged out" });
							}
						});
					}
				});
	};

	module.exports = {
		registerUser,
		deleteUser,
		editUser,
		addUser,
		login,
		getUser,
		signout,
	  };