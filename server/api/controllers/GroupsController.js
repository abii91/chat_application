/**
 * GroupsController
 *
 * @description :: Server-side logic for managing groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getUserGroups: function(req, res){
		ChannelUsers.find({user_id: Number(req.param("user_id"))})
		.populate("channel")
		.then(function(channel_users){
			var group_ids = [];
			channel_users.forEach(function(channel_user){
				group_ids.push(channel_user.channel.group_id);
			});

			Groups.find({id: group_ids})
			.then(function(groups){
				res.ok(groups);
			})
			.catch(function(err){
				res.serverError;
			});
		})
		.catch(function(err){
			res.serverError;
		});
	},
};
