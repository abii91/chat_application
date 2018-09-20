/**
 * ChathistoryController
 *
 * @description :: Server-side logic for managing chathistories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	sendChat: function (req, res){
		var chat = req.allParams();
		chat.sender = req.user.id;
		Chathistory.create(chat)
		.then(function(chat){
			res.ok(chat);
		})
		.catch(function(err){
			res.serverError;
		})
	},

	getUserChat: function(req, res){
		Chathistory.find({
			or: [
				{
					sender: req.user.id,
					recipient: req.param("recipient")
				},
				{
					recipient: req.user.id,
					sender: req.param("recipient")
				}
			]
		})
		.populate("sender")
		.populate("recipient")
		.then(function(chats){
			res.ok(chats);
		})
		.catch(function(err){
			res.serverError;
		})
	},

};
