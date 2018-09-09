<?php if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

/**
 * Chat socket helper
 * All function you can see on this page is mostly the view.
 *
 * You can modify/override all the functions here by creating your
 * new codeigniter helper and copying the same function name from here.
 *
 * @package Chatsocket
 * @author  Jay-r Simpron
 * @copyright   Copyright (c) 2017 , Extreme Web Evolution.
 */

if (! function_exists('csListUsers')) {
    /**
     * Display the list of users from the main messages page.
     * This list includes also the group conversation.
     *
     * @return mixed
     */
    function csListUsers()
    {
        $CI =& get_instance();
        $result = $CI->chatsocket->getConversation();
        if ($result['status']==true) {
            $conversation = $result['users_conversation'];
            ?>

            <?php
            $list  = '<div class="col-md-12 col-sm-12 col-xs-12 xwb-main-contact-conversation">';
            $list .= '<a class="xwb-create-group-chat fa-2x" onClick="createGroupConversation(this)" href="javascript:;" title="Create Group Conversation">
						<i class="fa fa-pencil-square"></i>
					</a>';
            $list  .= '<input type="text" placeholder="Search Contact.." onkeyup="searchContact()" name="search_contact" id="xwb-search-contact" class="form-control" />';
            $list .= '<ul class="list-group" id="cs-ul-users">';
            foreach ($conversation as $key => $value) {
                $user_to = $value['user_to'];
                $profile_pic = $CI->chatsocket->getProfilePicPath($user_to);
                $offline = 'offline';
                if ($value['cn_id']!="") {
                    $profile_pic = '/';
                    $offline = '';
                }

                $unread = $CI->chatsocket->getUnreadCount($user_to, $value['cn_id'])->num_rows();
                $conversation_name = $value['display_name'];
                $unread = ($unread==0?"":'<span class="pull-right label label-danger unread">'.$unread.'</span>');
                $list .= '<li class="list-group-item cs-list-users '.$offline.'" data-status="'.$offline.'" data-user="'.$user_to.'" data-ci="'.$value['cn_id'].'">
				        <a href="javascript:;">
				         	<span class="image">
	                      		<img src="'.base_url('?'.$CI->chatsocket->form_key.'=xwb_resizeimage&width=58&height=58&path='.$profile_pic).'" alt="img">
	                    	</span>
	                    	<span class="xwb-display-name">'.$conversation_name.'
	                    	</span>
	                    	'.$unread.'
	                    	</a>
	        		</li>';
            }
            $list .= '</ul>';
            
            $list .= '</div>';
        } else {
            $list = $result['error'];
        }

      
        if ($CI->chatsocket->enabled_users!=null) {
            if (!in_array($CI->chatsocket->current_user, $CI->chatsocket->enabled_users)) {
                $list = '';
            }
        }

        return $list;
    }

}


if (! function_exists('csConsole')) {
/**
     * This function is the view for the console page
     * Place this function where you want the console configuration will be displayed
     *
     * @param  boolean $return [Returning the View]
     * @return string
     */
    function csConsole($return = false)
    {
        $CI =& get_instance();
        if ($return) {
            return $CI->chatsocket->console();
        } else {
            echo $CI->chatsocket->console();
        }
    }

}



if (! function_exists('csFormKey')) {
/**
     * Get form key (input key name)
     *
     * @return string
     */
    function csFormKey()
    {
        $CI =& get_instance();
        return $CI->chatsocket->form_key;
    }

}


if (! function_exists('csAddScript')) {
/**
     * function to add necessary scripts on the head.
     * This function should be place in the head area of your codeigniter application.
     *
     * I have included the jquery, jquery ui, bootstrap and also the font-awesome here.
     * If you site already loaded the script or css like jQuery and Bootstrap,
     * you can override this function by creating a new helper and copy this function to your new helper.
     * Just delete script or css you have already on your codeigniter application.
     * Then place your newly created helper to autoload.
     *
     * @return string
     */
    function csAddScript()
    {
        $CI =& get_instance();
        if ($CI->chatsocket->current_user != null) {
            $socketUser = $CI->chatsocket->current_user;
        } else {
            $socketUser = 0;
        }
        ?>
       <!-- jquery -->
        <script src="<?php echo base_url('xwb_assets/js/jquery-3.2.1.min.js');?>"></script>

       <!-- jQuery UI CSS -->
        <link href="<?php echo base_url('xwb_assets/js/jquery-ui-1.12.1/jquery-ui.min.css');?>" rel="stylesheet" />

        <!-- jQuery UI -->
        <script type="text/javascript" src="<?php echo base_url('xwb_assets/js/jquery-ui-1.12.1/jquery-ui.min.js');?>"></script>

       <!-- Bootstrap -->
        <link href="<?php echo base_url('xwb_assets/vendor/twbs/bootstrap/dist/css/bootstrap.min.css');?>" rel="stylesheet" />
        <script type="text/javascript" src="<?php echo base_url('xwb_assets/vendor/twbs/bootstrap/dist/js/bootstrap.min.js');?>"></script>

      <!--  font awesome -->
        <link href="<?php echo base_url('xwb_assets/vendor/components/font-awesome/css/font-awesome.min.css');?>" rel="stylesheet" />

      <!-- Chatsocket CSS -->
        <link href="<?php echo base_url('xwb_assets/css/chatsocket.css');?>" rel="stylesheet" />

      
        <script src="<?php echo addhttp($CI->chatsocket->domain_name.':'.$CI->chatsocket->socket_port.'/socket.io/socket.io.js');?>"></script>
        
       
       <!-- Dropzonejs -->
        <link href="<?php echo base_url('xwb_assets/js/dropzone-4.3.0/dist/min/dropzone.min.css');?>" rel="stylesheet" />
        <script src="<?php echo base_url('xwb_assets/js/dropzone-4.3.0/dist/min/dropzone.min.js');?>"></script>
      
       <!-- PrettyPhoto -->
        <link rel="stylesheet" href="<?php echo base_url('xwb_assets/js/prettyPhoto-3.1.6/css/prettyPhoto.css'); ?>" type="text/css" media="screen" title="prettyPhoto main stylesheet" charset="utf-8" />
        <script src="<?php echo base_url('xwb_assets/js/prettyPhoto-3.1.6/js/jquery.prettyPhoto.js'); ?>" type="text/javascript" charset="utf-8"></script>

        <!-- video chat adapter -->
        <script src="<?php echo base_url('xwb_assets/js/lib/adapter.js'); ?>" type="text/javascript" charset="utf-8"></script>
     
       <!-- emojionearea -->
        <link rel="stylesheet" href="<?php echo base_url('xwb_assets/vendor/mervick/emojionearea/dist/emojionearea.css'); ?>" type="text/css" />
        <script src="<?php echo base_url('xwb_assets/vendor/mervick/emojionearea/dist/emojionearea.js'); ?>"></script>
        
   
       <!-- Select 2 -->
        <link rel="stylesheet" href="<?php echo base_url('xwb_assets/js/select2-4.0.3/dist/css/select2.min.css'); ?>" type="text/css" charset="utf-8" />
        <script type="text/javascript" src="<?php echo base_url('xwb_assets/js/select2-4.0.3/dist/js/select2.full.min.js');?>"></script>
        
       <!-- Bootbox -->
        <script type="text/javascript" src="<?php echo base_url('xwb_assets/js/bootbox.min.js');?>"></script>

        <script type="text/javascript">

           if(typeof io != 'undefined'){
                var socket = io.connect( "<?php echo addhttp($CI->chatsocket->domain_name.':'.$CI->chatsocket->socket_port);?>",{secure: true}); //connect to socket
         }


        var varSCPath = "<?php echo base_url('xwb_assets'); ?>";
        var socketUser = "<?php echo $socketUser; ?>";
        window.formKey = "<?php echo csFormKey(); ?>";

         if(typeof socket != 'undefined'){
              socket.emit( "socket id", { "user": socketUser } ); // pass the user identity to node
          }



       </script>

     <!-- Chat Socket Script -->
        <script src="<?php echo base_url('xwb_assets/js/chatsocket.js');?>"></script>

        <?php
    }

}

if (! function_exists('csMessages')) {
/**
     * This is the HTML of the messages contaner including the input message box.
     *
     * @param type|array $messages
     * @return string
     */
    function csMessages($messages = array())
    {
        $CI =& get_instance();

        ob_start();
        ?>

      <div id="message-container" class="xwb-message-container">
         <div class="panel panel-info">
             <div class="panel-heading">
                    <h3 class="conversation-name"></h3>
                </div>
         </div>
         
           <div id="message-inner" class="message-inner">

            </div>
         
           
           <div class="msg-input input-group">
                <textarea id="message-input" class="form-control message-input" style="resize:none;" rows="1" name="message-input" placeholder="Enter your message here ..."></textarea>
                <input type="hidden" id="csrf_key" class="csrf_key" name="<?php echo $CI->security->get_csrf_token_name(); ?>" value="<?php echo $CI->security->get_csrf_hash(); ?>" />

                <input type="hidden" name="user_id" class="user_id" id="user_id" value="<?php echo $CI->chatsocket->current_user; ?>">
               <input name="ci" class="ci" id="ci" value="" type="hidden" />
              <div class="input-group-btn">
                  <button class="btn btn-success" id="send-message">Send</button>
                </div>
            </div>

            <div class="btn-group">
             <button class="btn btn-sm btn-default xwb-attachment" onclick="uploadAttachment(this)" type="button" data-placement="top" data-toggle="tooltip" data-original-title="Attachment"><i class="fa fa-paperclip"></i></button>
              <a href="javascript:;" onClick="deleteConversation(this)" class="btn btn-sm btn-default" data-placement="top" data-toggle="tooltip" data-original-title="Delete Conversation"><i class="fa fa-trash-o"></i></a>
            </div>
     </div>
     
        <?php

        $out = ob_get_contents();
        ob_end_clean();
        if ($CI->chatsocket->enabled_users!=null) {
            if (!in_array($CI->chatsocket->current_user, $CI->chatsocket->enabled_users)) {
                $out = '';
            }
        }

        if ($CI->chatsocket->conversation_count == 0) {
            $out = '';
        }

        return $out;
    }

}

if (!function_exists('csChatbox')) {
/**
     * This is the HTML view for the right bottom list of user/conversation
     * Place this function before the closing </body>
     *
     * @return string
     */
    function csChatbox()
    {
        $CI =& get_instance();
        $result = $CI->chatsocket->getConversation();
        if ($result['status']==true) {
            $conversation = $result['users_conversation'];
            $side_user_state = $CI->session->userdata('side_user_state');
            if ($side_user_state=='open') {
                $state = '';
            } else {
                $state = 'chatbox-tray';
            }

            ob_start();

            ?>
                 <div id="xwb-bottom-chat-container">
                <div class="xwb-chat xwb-contact-sidebar <?php echo $state; ?>">
                  <div class="title">
                        <h5 class="xwb-sideuser-title"><a href="javascript:;">Contacts (<?php echo count($conversation); ?>)</a></h5>
                      <button class="chatbox-title-tray">
                            <span></span>
                      </button>
                  </div>
                 <div class="xwb-contact-container">
                        <div class="xwb-tray-contact-conversation">
                            <?php
                                $list  = '<input type="text" placeholder="Search Contact.." onkeyup="searchSideContact()" name="search_contact" id="xwb-search-sidecontact" class="form-control" />';
                            $list .= '<ul class="list-group" id="cs-ul-sideusers">';
                            foreach ($conversation as $key => $value) {
                                $user_to = $value['user_to'];
                                $profile_pic = $CI->chatsocket->getProfilePicPath($user_to);
                                $offline = 'offline';
                                if ($value['cn_id']!="") {
                                    $profile_pic = '/';
                                    $offline = '';
                                }

                                $unread = $CI->chatsocket->getUnreadCount($user_to, $value['cn_id'])->num_rows();
                                $unread = ($unread==0?"":'<span class="pull-right label label-danger unread">'.$unread.'</span>');
                                $conversation_name = $value['display_name'];
                                    
                                $list .= '<li class="list-group-item cs-list-users '.$offline.'" data-status="'.$offline.'" data-user="'.$user_to.'" data-ci="'.$value['cn_id'].'">
									        <a href="javascript:;">
									         	<span class="image">
					                          		<img src="'.base_url('?'.$CI->chatsocket->form_key.'=xwb_resizeimage&width=32&height=32&path='.$profile_pic).'" alt="img">
					                        	</span>
					                        	<span class="xwb-display-name">'.$conversation_name.'
					                        	</span>
					                        	'.$unread.'
					                        	</a>
						        		</li>';
                            }
                                $list .= '</ul>';
                            echo $list;
                            ?>
                            <a class="xwb-create-group-chat fa-2x" onClick="createGroupConversation(this)" href="javascript:;" title="Create Group Conversation">
                              <i class="fa fa-pencil-square"></i>
                            </a>
                               </div>
                         </div>
                     </div>
                 </div>
                    <?php
                    $out = ob_get_contents();
                    ob_end_clean();
        } else {
            $out = $result['error'];
        }

       

        /* Only appear for the enabled users for this library */
        if ($CI->chatsocket->enabled_users==null) {
            echo $out;
        } else {
            if (!in_array($CI->chatsocket->current_user, $CI->chatsocket->enabled_users)) {
                echo '';
            } else {
                echo $out;
            }
        }

        echo '<input type="hidden" id="csrf_key" class="csrf_key" name="'.$CI->security->get_csrf_token_name().'" value="'.$CI->security->get_csrf_hash().'" />';

        csAddScript(); // include all necessary scripts
    }

}



if (! function_exists('csTimeElapse')) {
/**
     * It will return the time elapse
     *
     * @param string $hours
     * @return string
     */
    function csTimeElapse($hours)
    {
        $to_time = new \DateTime(Date('Y-m-d H:i:s'));
        $from_time = new \DateTime($hours);
        $interval = $to_time->diff($from_time);
        $hours = $interval->h;
        $hours = $hours + ($interval->days*24);
        $minSec = $interval->format('%i:%s');
        $hours = $hours.':'.$minSec;
        $age = '';
        list($hour, $min, $sec) = explode(":", $hours);
        if ($hour > 24) {
            $days = round($hour / 24);
        } else {
            $days = 0;
        }

        if ($days >= 61) {
            $date = date('M d, Y', strtotime("-$hour hours"));
            return $date;
        } else if ($days >= 1) {
            $age = "$days day";
            if ($days > 1) {
                $age .= "s";
            }
        } else {
            if ($hour > 0) {
                $hour = ltrim($hour, '0');
                $age .= " $hour hour";
                if ($hour > 1) {
                    $age .= "s";
                }
            }
            if ($min > 0) {
                $min = ltrim($min, '0');
                if (!$min) {
                    $min = '0';
                }
                $age .= " $min min";
                if ($min != 1) {
                    $age .= "s";
                }
            }
        }

        if ($min < 1 and $hour < 1) {
            $age = 'a few seconds';
        }
        $age .= ' ago';
        return $age;
    }


}



if (!function_exists('addhttp')) {
/**
     * Auto add http of the given URL if not found
     *
     * @param  string $url [URL]
     * @return string
     */
    function addhttp($url)
    {
        if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
            $url = "http://" . $url;
        }
        return $url;
    }


}

if (!function_exists('csMessagesPage')) {
/**
     * Display the messages/inbox view
     *
     * Place this function on the page where you want the message/inbox to be displayed
     *
     * @param  boolean $return [Returning the view]
     * @return string
     */
    function csMessagesPage($return = false)
    {
        $CI =& get_instance();
        $message_page = '<div class="row">
                <div class="col-md-3 col-sm-12 col-xs-12">
					
					   '.csListUsers().'
					
                </div>
                <div class="col-md-9 col-sm-12 col-xs-12" style="height: 500px;">
                        '.csMessages().'
                </div>
        </div>';
        if ($return) {
            return $message_page;
        } else {
            echo $message_page;
        }
    }

}
