/**
* ChannelsController
*
* @description :: Server-side logic for managing channels
* @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
*/

module.exports = {
	getGroupChannels: function(req, res){
		Channels.find({group_id: Number(req.param("group_id"))})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	getUnassignedChannels: function(req, res){
		Channels.find({group_id: null})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	assignChannels: function(req, res){
		Channels.update({id: req.param("channels")}, {group_id: Number(req.param("group"))})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	removeGroupChannels: function(req, res){
		Channels.update({id: req.param("channels")}, {group_id: null})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	getChannelUsers: function(req, res){
		Channels.findOne({id: Number(req.param("channel"))})
		.populate("channel_users")
		.then(function(result){
			res.ok(result.channel_users);
		})
		.catch(res.serverError);
	},

	assignUsers: function(req, res){
		ChannelUsers.create(req.param("users"))
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	removeChannelUsers: function(req, res){
		ChannelUsers.destroy({user_id: req.param("users"), channel: Number(req.param("channel"))})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	getUserChannels: function(req, res){
		if(req.user.role_id.role_name == "users"){

			ChannelUsers.find({user_id: Number(req.param("user_id"))})
			.then(function(channel_users){
				var channel_ids = [];
				channel_users.forEach(function(channel_user){
					channel_ids.push(channel_user.channel);
				});

				Channels.find({id: channel_ids, group_id: Number(req.param("group_id"))})
				.then(function(channels){
					res.ok(channels);
				})
				.catch(function(err){
					res.serverError;
				});
			})
			.catch(function(err){
				res.serverError;
			});
		}
		else{
			Channels.find()
			.then(function(channels){
				res.ok(channels);
			})
			.catch(function(err){
				res.serverError;
			});
		}
	},

};
