/**
 * ChannelsController
 *
 * @description :: Server-side logic for managing channels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUnassignedChannels: function(req, res){
		Channels.find({group_id: null})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	},

	assignChannels: function(req, res){
		Channels.update({id: req.param("channels")}, {group_id: req.param("group")})
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
		Channels.findOne({id: req.param("channel")})
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
		ChannelUsers.destroy({user_id: req.param("users"), channel: req.param("channel")})
		.then(function(result){
			res.ok(result);
		})
		.catch(res.serverError);
	}

};
