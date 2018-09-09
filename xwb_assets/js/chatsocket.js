/**
 * Library Name: CI Chatsocket
 * Description: “CI Chatsocket” a CodeIgniter Chat application that uses Node JS and socket.io
 * to communicate real-time to each user.
 * This library can be used in any existing CodeIgniter website or web application.
 * Author: Jay-r Simpron
 * 
 */


/* global variable declaration */
var csDropzone = null;
var varSCPath;
var is_recieved = 0;
var socketUser;
var socket;
var bootbox;
var Dropzone;
var jQuery;
(function ( $ ) {

	'use strict';

	/**
	 * This jQuery script support for IE 9 and above
	 */
	/* =============================================================================== */


	/* =============================================================================== */
	/* Start jQuery functions */

	$(document).ready(function(){

		var audioHTML;
		var csrf_name, csrf_key;

		/**
		 * Get messages for the user clicked
		 *
		 * @return mixed
		 */
		
		$(document).on("click","#cs-ul-users li.cs-list-users",function(){
			var user_to, ci, args;
			user_to = $(this).data('user');
			ci = $(this).data('ci'); //conversation id
			$('.ci',$("#message-container")).val(ci);
			args = {'ci':ci, 'user_to':user_to,'start_from':'',elContainer: $("#message-container")};
			get_messages(args);

		});


		/**
		 * Load previous messages when scroll
		 * 
		 * @return mixed
		 */
		$( "#message-inner" ).scroll(function() {
			var $message_row, message_inner_position, message_row, ci, user_to, args;
			$message_row = $("div.message-row",this); // message row container
		
			message_inner_position = $(this).offset().top + 2; // plus 2 for the margin of message_row

			if($message_row.first().offset() != undefined){
				message_row = $message_row.first().offset().top; //get the first message row top position
				ci = $(this).parent('.xwb-message-container').attr('data-cnid');

				if(message_inner_position == message_row){ // trigger load previous messages when top position reached
					console.log('loading next message...');
					$(this).prepend('<div class="row loading_container"><h3 class="text-center">Loading more messages...</h3></div>');
					
					user_to = $(".user_to",'#message-container').val();

					args = {'ci':ci,'user_to':user_to, start_from: ($message_row.length), elContainer: $("#message-container")};
					get_messages(args, true);
				}
			}
		});

		// initialize pretty photo plugin after scroll
		$("a[rel^='prettyPhoto']").prettyPhoto({
			deeplinking:false, 
			social_tools:false
		});


		/*if users list is empty, disable input for message*/
		var initUsersList = function(){
			var cle, elem;
			if($("#cs-ul-users li").length==0){
				$("#message-input").prop('disabled',true);
				return false;
			}

			/* trigger click event for the first user */
			cle = document.createEvent("MouseEvent");
		    cle.initEvent("click", true, true);
		    elem = $("#cs-ul-users li")[0];
		    elem.dispatchEvent(cle);
		};


		initUsersList();

		
		/**
		 * Send message button
		 * 
		 * @return {[Void]}
		 */
		$("#send-message").click(function(){
			var el = {};
			el.container = $("#message-container");
			sendMessage(el);
		});


		/**
		 * HTML for audio player.
		 * This is for the sound notifications
		 */
		audioHTML = '<audio controls class="cs-audio">'+
	            '<source src="'+varSCPath+'/audio/Messenger_mp3.mp3'+'" type="audio/mpeg">'+
	            '<source src="'+varSCPath+'/audio/Messenger_mp3.oog'+'" type="audio/ogg">'+
	            '<source src="'+varSCPath+'/audio/Messenger_mp3.wav'+'" type="audio/wav">'+
	        'Your browser does not support the audio element.'+
	        '</audio>';

	    $('body').prepend(audioHTML); //prepend the audio player to the body
		

	    /**
	     * EmojiOneArea for the main message input
	     * This will add emoticons in the message
	     */
		$("#message-input").emojioneArea({
			pickerPosition: "bottom",
	    	tonesStyle: "radio",
	    	saveEmojisAs: "shortname",
	    	events: {
			    keypress: function (editor, event) {
					
			        if(event.which == 13 && !event.shiftKey){ // send message if enter is pressed
			          	event.preventDefault();
			          	$('#message-input').val($("#message-input").data("emojioneArea").getText());
						var el = {};
						el.container = $("#message-container");
						sendMessage(el);
			        }


			    }
		    }
	  	});



	/*start chatbox functions*/
		/**
		 * It will open and close the tray of the chatbox
		 */
		$(document).on('click','.chatbox-title-tray, .xwb-chat .title h5', function(){
			var $sideuserTitle, state, $csrf;
			$sideuserTitle = $(this).parents('.xwb-contact-sidebar');

			if($sideuserTitle.find('h5.xwb-sideuser-title').length == 1){
				state = 'close';
				if($sideuserTitle.hasClass('chatbox-tray'))
					state = 'open';

				var postData = {
						'cs_key' : 'xwb_open_close_sideuser',
						'state'	: state
					};

				$csrf = $('.csrf_key');
				csrf_name = $csrf.attr('name');
				csrf_key = $csrf.val();
				postData[csrf_name] = csrf_key;

				$.ajax({
					url: window.location.pathname,
					type: "get",
					data: postData,
					dataType: 'JSON',
					success: function(data){
						$('input[name="'+csrf_name+'"]').val(data.csrf_key);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						console.log(XMLHttpRequest);
						console.log(textStatus);
						console.log(errorThrown);
					}
				});
			}
	        $(this).parents('.xwb-chat').toggleClass('chatbox-tray');
	    });

	    /* It removes the chatbox */
	    $(document).on('click','.chatbox-title-close', function(){
	        $(this).parents('.xwb-chat').remove();
	    });

	    /* open a chatbox tray when clicked in the list of users/conversation */
	    $(document).on("click","#cs-ul-sideusers li",function(){
	    	var user_to, ci, user_name, online, textarea_profix, args, chatbox;
	    	var $xwbChat, $conversationArea, $conversationContainer, textArea;
	    	user_to = $(this).attr('data-user');
	    	ci = $(this).data('ci');
	    	user_name = $('a span.xwb-display-name',this).text();
	    	online = $(this).hasClass('online');
	    	online = online?'online':'offline';

	    	if(ci!="") // if group conversation no status display
	    		online = '';

	    	user_name = $.trim(user_name);

	    	textarea_profix = user_to;
	    	if(ci!="")
	    		textarea_profix = 'g_'+ci; // profix `g_` for the group conversation to avoid conflicts

			args = {'user_to':user_to,'start_from':''};


			if($("div.xwb-chat[data-user='" + user_to + "']").length > 0) // return false if the chatbox already open
				return false;

			/*Chatbox HTML*/
	    	chatbox  = '<div class="xwb-chat xwb-cb-chat '+online+'" data-user="'+user_to+'">'+
		        '<div class="title">'+
		        	'<h5 class="conversation-title"><a href="javascript:;">'+user_name+'</a></h5>'+
			        '<button class="chatbox-title-tray">'+
			            '<span></span>'+
			        '</button>'+
			        '<button class="chatbox-title-close">'+
			            '<span>'+
			                '<svg viewBox="0 0 12 12" width="12px" height="12px">'+
			                    '<line stroke="#FFFFFF" x1="11.75" y1="0.25" x2="0.25" y2="11.75"></line>'+
			                    '<line stroke="#FFFFFF" x1="11.75" y1="11.75" x2="0.25" y2="0.25"></line>'+
			                '</svg>'+
			            '</span>'+
			        '</button>'+
		        '</div>'+
		        '<div class="cb-conversation-container">'+
			        '<div class="conversation-container message-inner">'+
			        '</div>'+
			        '<div class="chatbox">'+
			            '<textarea id="xwb_cb_input_'+textarea_profix+'" class="form-control message-input" style="resize:none;" rows="1" name="message-input" placeholder="Enter your message here ..."></textarea>'+
			            '<input type="hidden" name="user_id" class="user_id" id="user_id" value="">'+
			            '<input name="ci" class="ci" id="ci" value="'+ci+'" type="hidden" />'+
			        '</div>'+
		        '</div>'+
		    '</div>';

		    $("#xwb-bottom-chat-container").append(chatbox);

		    $xwbChat = $('#xwb-bottom-chat-container').find('div.xwb-chat[data-user="'+user_to+'"]');
		    $conversationArea = $xwbChat.find('.cb-conversation-container');
		    $conversationContainer = $xwbChat.find('.conversation-container');
		    textArea = $xwbChat.find('textarea');
			args = {'ci':ci, 'user_to':user_to,'start_from':'', elContainer: $conversationArea};

		    get_messages(args); // get messages of the newly opened chatbox tray


		    /**
		     * Scroll function on every chatbox tray to view previous messages
		     */
			$conversationContainer.scroll(function() {
				var $message_row, message_inner_position, message_row, ci, user_to, args;
				$message_row = $("div.message-row",this);

				message_inner_position = $(this).offset().top + 2; // plus 2 for the margin of message_row

				if($message_row.first().offset() != undefined){
					message_row = $message_row.first().offset().top; //get the first message row top position
					ci = $(this).parent('.cb-conversation-container').attr('data-cnid');

					// trigger load previous messages when top position reached
					if(message_inner_position == message_row){ 
						console.log('loading next message...');
						$(this).prepend('<div class="row loading_container"><h5 class="text-center">Loading more messages...</h5></div>');
						
						user_to = $(this).next(".chatbox").find('.user_to').val();
						args = {'ci':ci, 'user_to':user_to, start_from: ($message_row.length), elContainer: $conversationArea};
						get_messages(args, true);
					}
				}
			});


			/**
			 * EmojioneArea plugin on each chatbox tray input to enable the emoticons/icons
			 */
			$('#xwb_cb_input_'+textarea_profix).emojioneArea({
				pickerPosition: "top",
		    	tonesStyle: "radio",
		    	saveEmojisAs: "shortname",
		    	events: {
				    keypress: function (editor, event) {
						var editorID, el;
				        if(event.which == 13 && !event.shiftKey){ // send message if enter is pressed
				          	event.preventDefault();
				          	$(textArea).val($(textArea).data("emojioneArea").getText());
				          	editorID = $(editor).parents('.chatbox').find('textarea').prop('id');
							el = {};
							el.container = $(editor).parents('.xwb-cb-chat');
							el.editorID = editorID;

							sendMessage(el);
				        }


				    }
			    }
		  	});


			/*Append the attach button beside the emojionearea icon*/
			var $chatboxDivEmoji = $('#xwb_cb_input_'+textarea_profix);
			$chatboxDivEmoji.appendAttachment();
				
	    });

		/**
		 * Append attachment button to chatbox tray emojione area
		 * 
		 * @return null
		 */
		$.fn.appendAttachment = function(){
			if($(this).next('div.emojionearea').length === 0){
				var el = this;
				setTimeout(function(){
					$(el).appendAttachment();
				},50);
			}else{
				$(this).next('div.emojionearea').append('<a href="javascript:;" class="emojionearea-button xwb-attach-btn" onclick="uploadAttachment(this)"><i class="fa fa-paperclip"></i></a>');
			}
		};


		/**
		 * Append userTo hidden field to chatbox when open
		 * 
		 * @param  {Number} v User ID
		 * @return Null
		 */
		$.fn.appendUsertoCB = function(v){
			
			if($(this).find('div.message-input').length === 0){
				var el = this;
				setTimeout(function(){
					$(el).appendUsertoCB(v);
				},50);
			}else{
				$(this).find('div.message-input').append('<input type="hidden" name="user_to[]" class="user_to" id="user_to" value="'+v+'" />');
			}
		};

		/**
		 * Append userTo hidden field to main message box
		 * 
		 * @param  {Number} v [User ID]
		 * @return {Null}
		 */
		$.fn.appendUsertoMain = function(v){
			if($(this).find('div.msg-input').length === 0){
				var el = this;
				setTimeout(function(){
					$(el).appendUsertoMain(v);
				},50);
			}else{
				$(this).find('div.msg-input').append('<input type="hidden" name="user_to[]" class="user_to" id="user_to" value="'+v+'" />');
			}
		};



		/**
		 * Mark message as read when clicked on the message container
		 * 
		 * @return null
		 */
		$(document).on('click',".xwb-message-container, .xwb-cb-chat .cb-conversation-container",function(){
			var cn_id, users;
			cn_id = $(this).attr('data-cnid');
			users = $(this).attr('data-users');
			markConversationRead(cn_id,users);

		});

	/*end chatbox functions*/

	});



	/**
	 * Ask to leave the page when there are unsend attachment that need to send 
	 * 
	 * @return string
	 */	
	$(window).on('beforeunload', function() {
		if(csDropzone != null){
			if(csDropzone.files.length>0){
				return "You have pending attachment that you need to send, Are you sure you want to exit?";
			}
		}
	}); 


	/**
	 * Process remove all uploaded files
	 * 
	 * @return void
	 */
	$(window).on('unload', function() {
	  if(csDropzone != null){
			if(csDropzone.files.length>0){
				csDropzone.removeAllFiles();
			}
		}
	});

}( jQuery ));
/* End jQuery functions */
/* =============================================================================== */



/* =============================================================================== */
/* Start JavaScript functions */
var $ = jQuery.noConflict(); // no conflict
var $csrf, csrf_name, csrf_key;
/**
 * Get the messages and append to message container
 *
 * @param array args 
 * @param string prepend_message 
 * @return mixed
 */
function get_messages(args, prepend_message){
	var users_to, ci, conversation_name, mid, scroll_to;
	prepend_message = prepend_message || false; // default value for IE compatibility
	ci = "";
	if(args.ci!=undefined)
		ci = args.ci;

	var postData = {
			'user_to': args.user_to,
			'ci': ci,
			'start_from': args.start_from,
			'is_recieved': is_recieved,
			'cs_key' : 'xwb_show_message'
		};

	$csrf = $('.csrf_key');
	csrf_name = $csrf.attr('name');
	csrf_key = $csrf.val();
	postData[csrf_name] = csrf_key;

	$.ajax({
		url: window.location.pathname,
		type: "post",
		data: postData,
		success: function(data){
			data = $.parseJSON(data);
			users_to = data.user_to;

			$('input[name="'+csrf_name+'"]').val(data.csrf_key);

			$(args.elContainer).attr('data-users', users_to.join('|'));
			$(args.elContainer).attr('data-cnid', ci);

			$('.user_to',args.elContainer).remove();

			/* add hidden inputs for the recipient */
			$.each(users_to,function(i,v){
				$('.msg-input',args.elContainer).append('<input type="hidden" name="user_to[]" class="user_to" id="user_to" value="'+v+'" />');
				$('.chatbox',args.elContainer).append('<input type="hidden" name="user_to[]" class="user_to" id="user_to" value="'+v+'" />');
			});

			$('.user_id',args.elContainer).val(data.user_id); // set the sender
			
			conversation_name = data.conversation_name;
			if(ci) // if group conversation, add onclick event in the conversation title to be able the user can manage it
				conversation_name ='<a href="javascript:;" onClick="conversationOption('+ci+')"><i class="fa fa-cog"></i> '+data.conversation_name+'</a>';

			$(".conversation-name",args.elContainer).html(conversation_name);

			if(prepend_message != true){ //this will prepend single message
				$(".message-inner",args.elContainer).html(data.row);
				$(".message-inner",args.elContainer).scrollTop($(".message-inner",args.elContainer)[0].scrollHeight);

				if(is_recieved==0){
					if(data.ci!=''){
						$("li[data-ci='"+data.ci+"']").find('span.unread').remove();
					}else{
						$("li[data-user='"+users_to[0]+"']").find('span.unread').remove();
					}

				}
			}else{ // This will load all the messages
				$(".loading_container",args.elContainer).remove();
				mid = $(".message-inner div.message-row",args.elContainer).data('mid');

				$(".message-inner",args.elContainer).prepend(data.row);

				scroll_to = $(".message-inner",args.elContainer).find("[data-mid='" + mid + "']").offset().top;

				$(".message-inner",args.elContainer).scrollTop(scroll_to);
			}

			updateGroupConversation(data);

			$("a[rel^='prettyPhoto']").prettyPhoto({
				deeplinking:false,
				social_tools:false
			});
			is_recieved = 0;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}


/**
 * Get single message
 * @param array data 
 * @return mixed
 */
function get_single_message(data){
	var $message_container, $unread_l_contacts, $unread_r_contacts, 
		focused, $chatbox, $mainInbox, cn_id, user_to;

	is_recieved = 1;
	var postData = {
			'message_id': data.message_id,
			'user_id': data.emit_to,
			'user_to': data.emit_from,
			'ci': data.ci,
			'cs_key': 'xwb_get_single_message'
		};
	$csrf = $('.csrf_key');
	csrf_name = $csrf.attr('name');
	csrf_key = $csrf.val();
	postData[csrf_name] = csrf_key;

	$.ajax({
		url: window.location.pathname,
		type: "post",
		data: postData,
		success: function(srcData){
			srcData = $.parseJSON(srcData);
			$('input[name="'+csrf_name+'"]').val(srcData.csrf_key);

			if(srcData.cn_id == null){
				// if private conversation
				$message_container = $('#message-container[data-users="'+data.emit_from+'"], .cb-conversation-container[data-users="'+data.emit_from+'"]').find('.message-inner');
				$unread_l_contacts = $('#cs-ul-users li[data-user="'+data.emit_from+'"]'); // select left contacts
				$unread_r_contacts = $('#cs-ul-sideusers li[data-user="'+data.emit_from+'"]'); // select right contacts
			}else{
				// if group conversation
				$message_container = $('#message-container[data-cnid="'+srcData.cn_id+'"], .cb-conversation-container[data-cnid="'+srcData.cn_id+'"]').find('.message-inner');
				$unread_l_contacts = $('#cs-ul-users li[data-ci="'+srcData.cn_id+'"]'); // select left contacts
				$unread_r_contacts = $('#cs-ul-sideusers li[data-ci="'+srcData.cn_id+'"]'); // select right contacts

			}

			$.each($message_container,function(i,v){
				$(v).append(srcData.row);
				$(v).scrollTop($(v)[0].scrollHeight);
			});


			if (($unread_l_contacts.length == 0 && $unread_r_contacts.length == 0) || ($unread_l_contacts.length == 0 && $unread_r_contacts.length == 1)){
				if($unread_r_contacts.length == 0)
					$("#cs-ul-sideusers").append(srcData.li_sideuser_html);
				if($unread_l_contacts.length == 0)
					$("#cs-ul-users").append(srcData.li_main_contact_html);
				if(srcData.cn_id != null)
					$('#cs-ul-sideusers li[data-ci="'+srcData.cn_id+'"]').trigger('click');
				else
					$('#cs-ul-sideusers li[data-user="'+srcData.user_to+'"]').trigger('click');

			}

			if(srcData.cn_id == null){
				$unread_l_contacts = $('#cs-ul-users li[data-user="'+data.emit_from+'"]'); // select left contacts
				$unread_r_contacts = $('#cs-ul-sideusers li[data-user="'+data.emit_from+'"]'); // select right contacts
			}else{
				$unread_l_contacts = $('#cs-ul-users li[data-ci="'+srcData.cn_id+'"]'); // select left contacts
				$unread_r_contacts = $('#cs-ul-sideusers li[data-ci="'+srcData.cn_id+'"]'); // select right contacts
			}

			$.each([$unread_l_contacts,$unread_r_contacts], function(i,v){
				if($('span.unread',$(v)).length==1){
					$('span.unread',$(v)).text(srcData.unreadCount);
				}else{
					$('a',$(v)).append('<span class="pull-right label label-danger unread">'+srcData.unreadCount+'</span>');
				}
			});

			focused = document.activeElement;
			$chatbox = $(focused).parents('.cb-conversation-container');
			$mainInbox = $(focused).parents('.xwb-message-container');

			if($chatbox.length==1){
				cn_id = $chatbox.attr('data-cnid');
				user_to = $chatbox.attr('data-users');
				markConversationRead(cn_id,user_to);
			}

			if($mainInbox.length==1){
				cn_id = $mainInbox.attr('data-cnid');
				user_to = $mainInbox.attr('data-users');
				markConversationRead(cn_id,user_to);	
			}

			$("a[rel^='prettyPhoto']",$message_container).prettyPhoto({
					deeplinking:false, 
					social_tools:false
			});

			is_recieved = 0;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}


/**
 * Send message
 *
 * @param  {object} el
 * @param  {String} message_type
 * @param  {Array}  attachments
 * @return {void}
 */
function sendMessage(el, message_type,attachments){
	var editorID, data, users, socket_data;
	if (typeof(attachments)==='undefined') attachments = [];
	if (typeof(message_type)==='undefined') message_type = 'message';

	editorID = 'message-input';

	if(el.editorID!=undefined)
		editorID = el.editorID;

	if($('#'+editorID).val() == '' && attachments.length == 0)
		return false;

	data = $(".user_to",el.container).serializeArray();
	data.push({'name':'user_id','value':$(".user_id",el.container).val()});
	data.push({'name':'ci','value':$(".ci",el.container).val()});
	data.push({'name':'message','value':$('#'+editorID).val()});
	data.push({'name':'message_type','value':message_type});
	data.push({'name':'attachments','value':attachments});
	data.push({'name':'cs_key','value':'xwb_sendmessage'});

	$csrf = $('.csrf_key');
	csrf_name = $csrf.attr('name');
	csrf_key = $csrf.val();
	data.push({'name':csrf_name, 'value': csrf_key});

	$.ajax({
		url: window.location.pathname,
		type: "post",
		data: data,
		success: function(data){
			data = $.parseJSON(data);
			$('input[name="'+csrf_name+'"]').val(data.csrf_key);

			if($(".message-inner",el.container).find('.no_messages')){
				$(".message-inner",el.container).find('.no_messages').remove();
			}
			$(".message-inner",el.container).append(data.row);

			$(".message-inner",el.container).scrollTop($(".message-inner",el.container)[0].scrollHeight);
			$(".message-input",el.container).prop('rows',1);

			$("a[rel^='prettyPhoto']").prettyPhoto({
				deeplinking:false, 
				social_tools:false
			});
			csDropzone = null;

			users = $($(".user_to",el.container)).map(function(){return $(this).val();}).get();

			socket_data = {
				 emit_from: socketUser,
				 emit_to: users,
				 message_id: data.message_id,
				 ci: $(".ci",el.container).val() 
			};

			socket.emit( 'send-message', socket_data );
			$('.message-input',el.container).data("emojioneArea").setText("");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

/**
 * Upload attachment dialog box script
 * 
 * @return void
 */
function uploadAttachment(element) {
	var files, attachments, el;
	bootbox.dialog({
        title: 'Upload Attachment',
        message: '<div class="row">'+
                    '<div class="col-md-12">'+
                        '<div id="attachment-container" class="dropzone">'+
                            
                        '</div>'+
                    '</div>'+
                '</div>',
        size: 'large',
        closeButton: false,
        buttons:{
        	send: {
                label: "Send",
                className: "btn-success",
                callback: function () {
                	files = csDropzone.files;
                	attachments = [];
                	$.each( files, function( key, value ) {
                		attachments.push(value.previewElement.id);
					});

                	if(attachments.length>0){
                		el = {};
                		if($(element).parents('#message-container').length == 0)
							el.container = $(element).parents('.xwb-cb-chat');
						else
							el.container = $(element).parents('#message-container');	
						
                		sendMessage(el,'attachment',attachments);
                	}

                }
            },
            cancel: {
                label: "Close",
                className: "btn-warning",
                callback: function () {
                	csDropzone.removeAllFiles();
                }
            }
        }

    });

    /* initialize dropzone */
	csDropzone = new Dropzone("div#attachment-container", { 
		url: window.location.pathname,
		method: 'post',
		addRemoveLinks: true,
		acceptedFiles: '.gif,.jpg,.png,.zip,.zipx,.rar,.7z,.pdf,.doc,.docx,.txt,.odt,.mp3,.mp4',
	});

	/* append xwb_upload to formData to recognize the upload function */
	csDropzone.on('sending', function(file, xhr, formData){
		$csrf = $('.csrf_key');

		csrf_name = $csrf.attr('name');
		csrf_key = $csrf.val();

		formData.append(csrf_name,csrf_key);
    	formData.append('cs_key', 'xwb_upload');

	});

	/* Assign Attachment id from server to file.previewElement.id */
	csDropzone.on("success", function(file, response) {
		var obj = JSON.parse(response);
		$('input[name="'+csrf_name+'"]').val(obj.csrf_key);
	  	file.previewElement.id = obj.attachmentID;
	});

	/* on upload error */
	csDropzone.on("error", function(file, response) {
		var message, _ref, _results, node, _i, _len;
		var obj = JSON.parse(response);
		$('input[name="'+csrf_name+'"]').val(obj.csrf_key);

      	message = obj.response;

        file.previewElement.classList.add("dz-error");
        _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
        }
        return _results;
	});

	/* ajax function to remove file from server */
	csDropzone.on("removedfile", function(file) {
		var postData = {
				'attachmentID': file.previewElement.id,
				'cs_key' : 'xwb_deleteFile'
			};
		$csrf = $('.csrf_key');
		csrf_name = $csrf.attr('name');
		csrf_key = $csrf.val();
		postData[csrf_name] = csrf_key;


		$.ajax({
			url: window.location.pathname,
			type: "post",
			data: postData,
			success: function(data){
				data = JSON.parse(data);
				$('input[name="'+csrf_name+'"]').val(data.csrf_key);
				return true;
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});

  	});

}


/**
 * Delete message
 * 
 * @param  {int} conversationID
 * @return {void}
 */
function deleteMessage(conversationID){
	bootbox.confirm("Are you sure you want to delete this message?", function(result){ 
        if(result){
        	var postData = {
                    'conversationID':conversationID,
                    'cs_key' : 'xwb_deleteMessage'
                };

            $csrf = $('.csrf_key');
			csrf_name = $csrf.attr('name');
			csrf_key = $csrf.val();
			postData[csrf_name] = csrf_key;


            $.ajax({
                url: window.location.pathname,
                type: "post",
                data: postData,
                success: function(data){
                	var obj = $.parseJSON(data);
                	$('input[name="'+csrf_name+'"]').val(obj.csrf_key);

                   	if(obj.status){
                		$("div.message-row[data-cid='"+conversationID+"']").remove();
                   	}
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    });
}


/**
 * Delete all message conversation
 * 
 * @return {void}
 */
function deleteConversation(el){
	var user_to, ci, obj;
	user_to = $(el).parents('#message-container').find('.user_to').val();
	ci = $(el).parents('#message-container').find('.ci').val();


	bootbox.confirm("Are you sure you want to delete all messages?", function(result){ 
        if(result){
        	var postData = {
                    'user_to': user_to,
                    'ci': ci,
                    'cs_key' : 'xwb_deleteAllMessages'
                };
            $csrf = $('.csrf_key');
			csrf_name = $csrf.attr('name');
			csrf_key = $csrf.val();
			postData[csrf_name] = csrf_key;

            $.ajax({
                url: window.location.pathname,
                type: "post",
                data: postData,
                success: function(data){
                	obj = $.parseJSON(data);
                	$('input[name="'+csrf_name+'"]').val(obj.csrf_key);

                   	if(obj.status){
                		if(ci!='')
                			$("#cs-ul-users li.cs-list-users[data-ci='"+ci+"']").click();
                		else
                			$("#cs-ul-users li.cs-list-users[data-user='"+user_to+"']").click();

                		$('.cb-conversation-container[data-cnid="'+ci+'"]').parent('.xwb-cb-chat').find('.chatbox-title-close').trigger('click');
                   	}

                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    });
}


/**
 * Search contact list
 * 
 * @return none
 */
function searchContact(){
	var input, filter, ul, li, a, i;
    input = document.getElementById("xwb-search-contact");
    filter = input.value.toUpperCase();
    ul = document.getElementById("cs-ul-users");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}

/**
 * Search contact list in sidebar
 * 
 * @return none
 */
function searchSideContact(){
	var input, filter, ul, li, a, i;
    input = document.getElementById("xwb-search-sidecontact");
    filter = input.value.toUpperCase();
    ul = document.getElementById("cs-ul-sideusers");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}





/**
 * Create New Group Conversation
 * 
 * @param  object el [Element clicked]
 * @return null
 */
function createGroupConversation(el){
	bootbox.dialog({
        title: 'Create Group Conversation',
        message: '<div class="row">'+
        			'<div class="col-md-12 xwb-message-container">'+
        			'</div>'+
        			'<form class="form-horizontal" name="form_create_conversation" id="xwb-form-create-conversation">'+
	                    '<div class="col-md-12">'+
		                    '<div class="form-group">'+
		                        '<label class="control-label col-md-4 col-sm-4 col-xs-12" for="conversation_name">Conversation Name <span class="required">*</span>'+
		                        '</label>'+
		                        '<div class="col-md-8 col-sm-8 col-xs-12">'+
		                        	'<input id="xwb-conversation-name" name="conversation_name" required="required" class="form-control col-md-7 col-xs-12" type="text">'+
		                        '</div>'+
	                      	'</div>'+
	                    	'<div class="form-group">'+
		                        '<label class="control-label col-md-4 col-sm-4 col-xs-12" for="conversation_users">Select Users <span class="required">*</span>'+
		                        '</label>'+
		                        '<div class="col-md-8 col-sm-8 col-xs-12">'+
		                          	'<select multiple="multiple" style="width:100%;" id="xwb-conversation-users" class="xwb-conversation-users" name="conversation_users[]">'+
		                          		'<option value="">Select Users</option>'+
		                          	'</select>'+
		                        '</div>'+
		                    '</div>'+
	                    '</div>'+
	                '</form>'+
                '</div>',
        closeButton: false,
        buttons:{
        	create: {
                label: "Create",
                className: "btn-info",
                callback: function () {
                	var data = $("#xwb-form-create-conversation").serializeArray();
                	data.push({'name':'cs_key', 'value':'xwb_create_conversation'});

                	$csrf = $('.csrf_key');
					csrf_name = $csrf.attr('name');
					csrf_key = $csrf.val();
                	data.push({'name':csrf_name, 'value':csrf_key});

					$.ajax({
						url: window.location.pathname,
						type: "post",
						data: data,
						dataType: 'JSON',
						success: function(data){
							$('input[name="'+csrf_name+'"]').val(data.csrf_key);
							if(data.status == false){
								$('.xwb-message-container').html('<div class="alert alert-danger alert-dismissible fade in" role="alert">'+
                    				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>'+
                    				'</button>'+
                    				data.message+
                					'</div>');
							}else{
								$("#cs-ul-sideusers").append(data.li_sideuser_html);
								$("#cs-ul-users").append(data.li_main_contact_html);


								if($(el).parent('.xwb-main-contact-conversation').length==1){
									$('#cs-ul-users li[data-ci="'+data.cn_id+'"]').trigger('click');
								}

								if($(el).parent('.xwb-tray-contact-conversation').length==1){
									$('#cs-ul-sideusers li[data-ci="'+data.cn_id+'"]').trigger('click');
								}

								bootbox.hideAll();
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log(XMLHttpRequest);
							console.log(textStatus);
							console.log(errorThrown);
						}
					});
					return false;
                }
            },
            cancel: {
                label: "Close",
                className: "btn-warning",
                callback: function () {
                	
                }
            }
        }

    });

    $("#xwb-conversation-users").select2({
		ajax: {
			url: window.location.pathname,
			type: "get",
			dataType: 'JSON',
			data: function (params){
				var query = {
					'term': params.term,
					'cs_key' : 'xwb_get_users'
				};
				return query;
			},
			success: function(data){

			}
		}
    });
}



/**
 * Group Conversation Option
 * 
 * @param  Int cn_id [Conversation Name ID]
 * @return null
 */
function conversationOption(cn_id) {
	var users, options, socket_data, query;
	var postData = {
			'cn_id': cn_id,
			'cs_key' : 'xwb_get_conversation_option'
		};

	$csrf = $('.csrf_key');
	csrf_name = $csrf.attr('name');
	csrf_key = $csrf.val();
	postData[csrf_name] = csrf_key;

	$.ajax({
		url: window.location.pathname,
		type: "get",
		dataType: "JSON",
		data: postData,
		success: function(data){
			$('input[name="'+csrf_name+'"]').val(data.csrf_key);

			users = data.users;
			options = '';
			$.each(users,function(i,v){
				options +='<option value="'+i+'" selected>'+v.display_name+'</option>';
			});

			/*Dialog box*/
			bootbox.dialog({
				title: 'Group Conversation Option',
			    message: '<div class="row">'+
			    			'<div class="col-md-12">'+
		    					'<div class="xwb-message-notification"></div>'+
		    					'<form class="form-horizontal" name="form_group_conversation" id="xwb-conversation-option">'+
		    						'<input value="'+cn_id+'" id="cn_id" name="cn_id" type="hidden" />'+
			    					'<div class="form-group">'+
				                        '<label class="control-label col-md-4 col-sm-4 col-xs-12" for="conversation_name">Conversation Name <span class="required">*</span>'+
				                        '</label>'+
				                        '<div class="col-md-8 col-sm-8 col-xs-12">'+
				                        	'<input value="'+data.conversation_name+'" id="xwb-conversation-name" name="conversation_name" required="required" class="form-control col-md-7 col-xs-12" type="text">'+
				                        '</div>'+
			                      	'</div>'+
				    				'<div class="form-group">'+
				                        '<label class="control-label col-md-4 col-sm-4 col-xs-12" for="conversation_users">Select Users <span class="required">*</span>'+
				                        '</label>'+
				                        '<div class="col-md-8 col-sm-8 col-xs-12">'+
				                          	'<select multiple="multiple" style="width:100%;" id="xwb-conversation-users" class="xwb-conversation-users" name="conversation_users[]">'+
				                          		'<option value="">Select Users</option>'+
				                          		options+
				                          	'</select>'+
				                        '</div>'+
				                    '</div>'+
				    			'</form>'+
			    			'</div>'+
			    		'</div>',
			    closeButton: false,
			    buttons:{
			    	save: {
			            label: "Save",
			            className: "btn-success",
			            callback: function () {
			            	data = $("#xwb-conversation-option").serializeArray();
			            	data.push({'name': 'cs_key', 'value': 'xwb_update_conversation'});

			            	$csrf = $('.csrf_key');
							csrf_name = $csrf.attr('name');
							csrf_key = $csrf.val();
							data.push({'name': csrf_name, 'value': csrf_key});

							$.ajax({
								url: window.location.pathname,
								type: "post",
								data: data,
								dataType: 'JSON',
								success: function(data){
									$('input[name="'+csrf_name+'"]').val(data.csrf_key);

									if(data.status == false){
										$('.xwb-message-notification').html('<div class="alert alert-danger alert-dismissible fade in" role="alert">'+
		                    				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>'+
		                    				'</button>'+
		                    				data.message+
		                					'</div>');
									}else{
										updateGroupConversation(data);
	
										bootbox.hideAll();

										// emit changes to the other affected users
										socket_data = {
											'emit_to': data.con_all_users,
											'cn_id': data.cn_id,
											'emit_from': data.user_id
										};
										socket.emit( 'update-group-conversation', socket_data );
									}
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									console.log(XMLHttpRequest);
									console.log(textStatus);
									console.log(errorThrown);
								}
							});

							return false;
			            }
			        },
			        cancel: {
			            label: "Close",
			            className: "btn-warning",
			            callback: function () {
			            }
			        }
			    }
			});


			$("#xwb-conversation-users").select2({
				ajax: {
					url: window.location.pathname,
					type: "get",
					dataType: 'JSON',
					data: function (params){
						query = {
							'term': params.term,
							'cs_key' : 'xwb_get_users'
						};
						return query;
					},
					success: function(data){
						
					}
				}
		    });

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});


	
	
}


/**
 * Update users affected by the changed group conversation
 * 
 * @param  {object} data [Object from nodejs data]
 * @return {null}
 */
function updateGroupConversation(data) {
	var $chatboxParent;
	$('.xwb-message-container[data-cnid="'+data.cn_id+'"]').attr('data-users',data.conversation_users);
	$('.cb-conversation-container[data-cnid="'+data.cn_id+'"]').attr('data-users',data.conversation_users);

	$('.cs-list-users[data-ci="'+data.cn_id+'"]').attr('data-user',data.conversation_users);
	$('.cs-list-users[data-ci="'+data.cn_id+'"]').find('.xwb-display-name').text(data.conversation_name);

	$('.xwb-message-container[data-cnid="'+data.cn_id+'"]').find('.conversation-name a').html('<i class="fa fa-cog"></i> '+data.conversation_name);
	$('.xwb-message-container[data-cnid="'+data.cn_id+'"]').find('.user_to').remove();

	$chatboxParent = $('.cb-conversation-container[data-cnid="'+data.cn_id+'"]').parents('.xwb-cb-chat');
	$chatboxParent.attr('data-user',data.conversation_users);
	$chatboxParent.find('.conversation-title a').text(data.conversation_name);
	$chatboxParent.find('.user_to').remove();

	$.each(data.con_usersArr,function(i,v){
		$chatboxParent.appendUsertoCB(v);
		$('.xwb-message-container[data-cnid="'+data.cn_id+'"]').appendUsertoMain(v);
	});

	if(data.user_disable){
		$('.xwb-message-container[data-cnid="'+data.cn_id+'"]').find('.emojionearea-editor').attr('placeholder','You cannot reply this conversation.').attr('contenteditable',false);
		$('.xwb-message-container[data-cnid="'+data.cn_id+'"]').find('.xwb-attachment, .emojionearea-button').hide();

		$chatboxParent.find('.emojionearea-editor').attr('placeholder','You cannot reply this conversation.').attr('contenteditable',false);
		$chatboxParent.find('.emojionearea-button').hide();
		
	}else{
		$('.xwb-message-container').find('.emojionearea-editor').attr('placeholder','Enter your message here').attr('contenteditable',true);
		$('.xwb-message-container').find('.xwb-attachment, .emojionearea-button').show();


		$chatboxParent.find('.emojionearea-editor').attr('placeholder','Enter your message here').attr('contenteditable',true);
		$chatboxParent.find('.emojionearea-button').show();

	}
}



/**
 * Mark conversation as read
 * 
 * @param  {Number} cn_id   [Conversation name ID]
 * @param  {Number} user_to [User to]
 * @return {Null}
 */
function markConversationRead(cn_id,user_to){
	var postData = {
			'users' : user_to,
			'cn_id' : cn_id,
			'cs_key' : 'xwb_mark_read',
		};

	$csrf = $('.csrf_key');
	csrf_name = $csrf.attr('name');
	csrf_key = $csrf.val();
	postData[csrf_name] = csrf_key;
	$.ajax({
		url: window.location.pathname,
		type: "post",
		dataType: 'JSON',
		data: postData,
		success: function(data){

			$('input[name="'+csrf_name+'"]').val(data.csrf_key);
			if(data.cn_id!=''){
				$("li[data-ci='"+data.cn_id+"']").find('span.unread').remove();
			}else{
				$("li[data-user='"+data.user+"']").find('span.unread').remove();
			}
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log(XMLHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}


/* =============================================================================== */
/* start socket script */
/**
 * update online users
 * @param array data 
 * @return void
 */
if(typeof socket != 'undefined'){
	socket.on("update ol users", function(data){
		var users, $el;
		users = data.users;

			$.each(users, function( index, value ) {
				$el = $("ul#cs-ul-users, ul#cs-ul-sideusers, #xwb-bottom-chat-container").find("[data-user=\'" + value + "\']");
				$el.removeClass('online');
				$el.removeClass('offline');
				if($el.length>0){
					$el.data('status','online');
					$el.addClass('online');
				}else{
					$el.data('status','offline');
					$el.addClass('offline');
				}

			});

	});

	/**
	 * On user disconnected
	 * 
	 * @param array data 
	 * @return mixed
	 */
	socket.on("disconnect user", function(data){
		var disconnected_user, $el;
		disconnected_user = data.user;
		$el = $("ul#cs-ul-users, ul#cs-ul-sideusers, #xwb-bottom-chat-container").find("[data-user=\'" + disconnected_user + "\']");
		$el.data('status','offline');
		$el.removeClass('online');
		$el.addClass('offline');
	});

	// Recieved message
	socket.on("recieved-message", function(data){
		get_single_message(data);
		$(".cs-audio").get(0).play();
	});

	// Socket update group conversation
	socket.on("update-group-conversation", function(data){
		var postData = {
				'cn_id': data.cn_id,
				'user_id' : data.emit_to,
				'cs_key': 'xwb_get_group_conversation_data'
			};

		$csrf = $('.csrf_key');
		csrf_name = $csrf.attr('name');
		csrf_key = $csrf.val();
		postData[csrf_name] = csrf_key;

		$.ajax({
			url: window.location.pathname,
			type: "get",
			data: postData,
			dataType: 'JSON',
			success: function(data){
				$('input[name="'+csrf_name+'"]').val(data.csrf_key);

				updateGroupConversation(data);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	});
	
}
/* end socket script */
/* =============================================================================== */

(function ( $ ) {
	'use strict';
	$(document).ready(function(){
		var $csrf;
		var csrf_name, csrf_key;
		$('#xwb-users-table').change(function(){
			var postData = {
					'table': $(this).val(),
					'cs_key' : 'xwb_get_usertable_fields'
				};
			$csrf = $('.csrf_key');
			csrf_name = $csrf.attr('name');
			csrf_key = $csrf.val();
			postData[csrf_name] = csrf_key;


			$.ajax({
				url: window.location.pathname,
				type: "post",
				data: postData,
				success: function(data){
					data = $.parseJSON(data);
					$('input[name="'+csrf_name+'"]').val(data.csrf_key);

					var userFields = '';
					$.each(data.fields, function(i,v){
						userFields += '<option value='+v+'>'+v+'</option>';
					});
					$("#xwb-users-id").html(userFields);
					if(data.user_id_field)
						$("#xwb-users-id").val(data.user_id_field);

					$("#xwb-display-name").html(userFields);
					if(data.user_name_field)
						$("#xwb-display-name").val(data.user_name_field);
					
					$("#xwb-pic-filename").html(userFields);
					if(data.picture_filename)
						$("#xwb-pic-filename").val(data.picture_filename);
					
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		});



		$('#xwb-user-table-other').change(function(){
			var postData = {
					'table': $(this).val(),
					'cs_key' : 'xwb_get_otherusertable_fields'
				};
			$csrf = $('.csrf_key');
			csrf_name = $csrf.attr('name');
			csrf_key = $csrf.val();
			postData[csrf_name] = csrf_key;


			$.ajax({
				url: window.location.pathname,
				type: "post",
				data: postData,
				success: function(data){
					data = $.parseJSON(data);
					$('input[name="'+csrf_name+'"]').val(data.csrf_key);

					var userFields = '';
					$.each(data.fields, function(i,v){
						userFields += '<option value='+v+'>'+v+'</option>';
					});

					$("#xwb-user-table-fkey").html(userFields);
					if(data.user_table_fkey)
						$("#xwb-user-table-fkey").val(data.user_table_fkey);

					$("#xwb-user-table-fdisplayname").html(userFields);
					if(data.user_table_fdisplayname)
						$("#xwb-user-table-fdisplayname").val(data.user_table_fdisplayname);

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		});


		$('#xwb-picture-table').change(function(){
			var postData = {
					'table': $(this).val(),
					'cs_key' : 'xwb_get_picturetable_fields'
				};
			$csrf = $('.csrf_key');
			csrf_name = $csrf.attr('name');
			csrf_key = $csrf.val();
			postData[csrf_name] = csrf_key;

			$.ajax({
				url: window.location.pathname,
				type: "post",
				data: postData,
				success: function(data){
					data = $.parseJSON(data);
					$('input[name="'+csrf_name+'"]').val(data.csrf_key);

					var userFields = '';
					$.each(data.fields, function(i,v){
						userFields += '<option value='+v+'>'+v+'</option>';
					});
					
					$("#xwb-pic-table-key").html(userFields);
					$("#xwb-picture-field").html(userFields);

					if(data.picture_table_key)
						$("#xwb-pic-table-key").val(data.picture_table_key);

					if(data.picture_field)
						$("#xwb-picture-field").html(data.picture_field);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log(XMLHttpRequest);
					console.log(textStatus);
					console.log(errorThrown);
				}
			});
		});
	});

}( jQuery ));


	var $ = jQuery.noConflict();
	function browsePath(el){
			bootbox.dialog({
				title: 'Select profile picture path',
			    message: '<div class="row">'+
			    			'<div class="col-md-12">'+
			    				'<a href="javascript:;" onClick="goToPath(\'..\')" class="btn btn-primary" title="Up one level">'+
		                            '<span class="fa fa-arrow-up"></span> Up one level'+
		                        '</a>'+
		                        '<input type="hidden" name="current_dir" id="xwb-current-dir" />'+
		                        '<hr />'+
			    				'<div id="xwb-folder-path-container">'+
			    				'</div>'+
			    			'</div>'+
			    		'</div>',
			    closeButton: false,
			    buttons:{
		        	insert: {
		                label: "Insert",
		                className: "btn-success",
		                callback: function () {
		                	$("#profile_pic_path").val($(".xwb-folder-selected:checked").val());
		                }
		            },
		            cancel: {
		                label: "Close",
		                className: "btn-warning",
		                callback: function () {
		                	
		                }
		            }
		        }
			});

			goToPath('');
		}


	function goToPath(path){
		var postData = {
				'cs_key': 'xwb_go_to_path',
				'path': path,
				'current_dir': $("#xwb-current-dir").val()
			};
		$csrf = $('.csrf_key');
		csrf_name = $csrf.attr('name');
		csrf_key = $csrf.val();
		postData[csrf_name] = csrf_key;

    	$.ajax({
			url: window.location.pathname,
			type: "post",
			data: postData,
			success: function(data){
				data = $.parseJSON(data);
				$('input[name="'+csrf_name+'"]').val(data.csrf_key);

            	$("#xwb-folder-path-container").html(data.dir_list);
            	$("#xwb-current-dir").val(data.current_dir);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}

	function selectUsers(){
		bootbox.dialog({
				title: 'Select users',
			    message: '<div class="row">'+
			    			'<div class="col-md-12">'+
			    				'<div class="table-responsive xwb-table-users-container">'+
			    					'<div class="xwb-message-notification"></div>'+
			    					'<form class="form-horizontal" name="form_users" id="xwb-form-users">'+
					    				'<table id="xwb-table-users" class="table table-bordered table-hover">'+
											'<thead>'+
												'<tr>'+
													'<th width="60">'+
														'<label><input id="xwb-checkall" type="checkbox" value=""> All </label>'+
													'</th>'+
													'<th><input type="text" placeholder="Search User.." onkeyup="searchUser()" name="search_user" id="xwb-search-user" class="form-control" /></th>'+
												'</tr>'+
											'</thead>'+
											'<tbody class="xwb-users">'+
											'</tbody>'+
					    				'</table>'+
					    			'</form>'+
			    				'</div>'+
			    			'</div>'+
			    		'</div>',
			    closeButton: false,
			    buttons:{
		        	save: {
		                label: "Save",
		                className: "btn-success",
		                callback: function () {
		                	var data = $("#xwb-form-users").serializeArray();
		                	data.push({'name': 'cs_key', 'value': 'xwb_setUsers'});

		                	$csrf = $('.csrf_key');
							csrf_name = $csrf.attr('name');
							csrf_key = $csrf.val();
							data.push({'name': csrf_name, 'value': csrf_key});

					    	$.ajax({
								url: window.location.pathname,
								type: "post",
								data: data,
								success: function(data){
									data = $.parseJSON(data);
									$('input[name="'+csrf_name+'"]').val(data.csrf_key);

									$(".xwb-message-notification").html(data.message);
									setTimeout(function(){
										bootbox.hideAll();
									},1000);
								},
								error: function(XMLHttpRequest, textStatus, errorThrown) {
									console.log(XMLHttpRequest);
									console.log(textStatus);
									console.log(errorThrown);
								}
							});

							return false;
		                }
		            },
		            cancel: {
		                label: "Close",
		                className: "btn-warning",
		                callback: function () {
		                }
		            }
		        }
			});

		var postData = {
				'cs_key': 'xwb_getUsers',
				'users_table': $('#xwb-users-table').val(),
				'users_id': $('#xwb-users-id').val(),
				'display_name': $('#xwb-display-name').val(),
				'users_table_other': $('#xwb-user-table-other').val(),
				'users_table_other_id': $('#xwb-user-table-fkey').val(),
				'users_table_other_displayname': $('#xwb-user-table-fdisplayname').val()
			};

		$csrf = $('.csrf_key');
		csrf_name = $csrf.attr('name');
		csrf_key = $csrf.val();
		postData[csrf_name] = csrf_key;

    	$.ajax({
			url: window.location.pathname,
			type: "post",
			data: postData,
			success: function(data){
				data = $.parseJSON(data);
				$('input[name="'+csrf_name+'"]').val(data.csrf_key);
				$("tbody.xwb-users").html(data.html);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});


	    $('#xwb-checkall').click(function() {
	        var checked = $(this).prop('checked');
	        $('input:checkbox.users-check').prop('checked', checked);
	    });

	}

	/**
	 * Search User
	 * 
	 * @return none
	 */
	function searchUser(){
		var input, filter, i, table, tr, td;
	    input = document.getElementById("xwb-search-user");
	    filter = input.value.toUpperCase();
	    table = document.getElementById("xwb-table-users");
	    tr = $(table).find("tbody tr");
	    for (i = 0; i < tr.length; i++) {
	        td = tr[i].getElementsByTagName("td")[1];
	        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
	            tr[i].style.display = "";
	        } else {
	            tr[i].style.display = "none";

	        }
	    }
	}


	function updateConsole(){
		$("#form-console").submit(); // comment this line if you want to use ajax
	}

/* =============================================================================== */
/* Start Console Configuration Functions*/

/* End Console Configuration Functions*/