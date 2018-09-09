<?php
/**
 *
 * @package Chatsocket
 * @author  Jay-r Simpron
 * @copyright   Copyright (c) 2017 , Extreme Web Evolution.
 */
defined('BASEPATH') or exit('No direct script access allowed');


/* autoload emojione */
spl_autoload_register(function () {
    require_once dirname(__FILE__). '/vendor/emojione/emojione/lib/php/autoload.php';
});

use Emojione\Emojione;
use Emojione\Client as EmojioneClient;

/**
 *  Main class Chatsocket
 */
class Chatsocket
{

    // Declaration of defalt values
    //
    public $lib_name = 'Chatsocket';
    protected $table_console = 'xwb_csconsole';
    public $current_user = 0;
    protected $display_rows = 10;
    protected $picture_table = '';
    protected $users_table = 'users'; // default users table
    public $display_name = '';
    public $users_id = 'id'; //default table field for the user unique id
    public $form_key = 'cs_key'; // form key for the chatsocket
    public $socket_port = '10000'; // default socket port
    public $session_user_id_key = '';
    protected $user_table_fkey = '';
    protected $users_table_other = '';
    protected $user_table_fdisplayname = '';
    protected $picture_table_key = '';
    protected $picture_field = '';
    protected $picture_filename = '';
    public $conversation_count = 0;
    
    /**
     * Construct method
     *
     * @return void
     */
    public function __construct()
    {

        /**
         * CodeIgniter Compatibility
         *
         * Folder must be lowercase if CI version is less than 3
         */
        if (CI_VERSION < 3) {
            $this->lib_name = 'chatsocket';
        } else {
            $this->lib_name = 'Chatsocket';
        }

        $this->xwb =& get_instance(); //Assign instance

        $this->xwb->load->database();
        if ($this->xwb->db->table_exists($this->table_console)===false) {
            // Install table
            $this->installTable();
        }

        /*Initalize Library*/
        $this->init();

        $this->csPostScript(); // All POST method process here
        $this->csGetScript(); // All GET method process here
    }

    /**
     * Initialize library
     *
     * @return void
     */
    public function init()
    {

        $this->xwb->load->add_package_path(APPPATH.'libraries/'.$this->lib_name);
        $this->xwb->load->helper('url');
        $this->xwb->load->helper('chat_socket');
        $this->xwb->load->library('session');


        $this->domain_name = $_SERVER['SERVER_NAME'];

        $xwb_asset_folder = FCPATH.'xwb_assets';
        if (!file_exists($xwb_asset_folder)) {
            echo $this->errorContainer('xwb_assets does not exists. Please copy the folder xwb_assets to the root of your codeigniter application');
        }


        $this->enabled_users = json_decode($this->getConsole('enabled_users'));

        if ($this->getConsole('users_id')!="") {
            $this->users_id = $this->getConsole('users_id');
        }

        if ($this->getConsole('display_name')!="") {
            $this->display_name = $this->getConsole('display_name');
        }

        if ($this->getConsole('picture_filename')!="") {
            $this->picture_filename = $this->getConsole('picture_filename');
        }
        
        if ($this->getConsole('users_table')!="") {
            $this->users_table = $this->getConsole('users_table');
        }

        if ($this->getConsole('users_table_other')!="") {
            $this->users_table_other = $this->getConsole('users_table_other');
        }

        if ($this->getConsole('user_table_fkey')!="") {
            $this->user_table_fkey = $this->getConsole('user_table_fkey');
        }

        if ($this->getConsole('user_table_fdisplayname')!="") {
            $this->user_table_fdisplayname = $this->getConsole('user_table_fdisplayname');
        }
        

        if ($this->getConsole('picture_table')!="") {
            $this->picture_table = $this->getConsole('picture_table');
        }

        if ($this->getConsole('picture_table_key')!="") {
            $this->picture_table_key = $this->getConsole('picture_table_key');
        }

        if ($this->getConsole('picture_field')!="") {
            $this->picture_field = $this->getConsole('picture_field');
        }
        

        if ($this->getConsole('session_user_id_key')!="") {
            $this->session_user_id_key = $this->getConsole('session_user_id_key');
        }

        $this->current_user  = $this->getCurrentUser();

        log_message('info', 'Initialize complete.');
    }




    /**
     * Get users
     *
     * @return array|string
     */
    public function getConversation()
    {

        // you need to configure first the console configuration before you can use the chat application
        if ($this->getConsole('users_table')=="") {
            $error =  '<div class="alert alert-danger alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
            </button>
            You need to configure first the chatsocket console to use this plugin
            </div>';
            $data['error'] = $error;
            $data['status'] = false;
            $this->conversation_count = 0;
            log_message('debug', 'You need to configure first the chatsocket console to use this plugin.');
        } else {
            if (empty($this->users_table_other)) {
                //process this query if the display name comes from the other table
                $this->xwb->db->select('u.'.$this->users_id.', u.'.$this->display_name.' as display_name');
                $this->xwb->db->from($this->users_table.' u');
                $this->xwb->db->where_in('u.'.$this->users_id, $this->enabled_users);
                $this->xwb->db->where('u.'.$this->users_id.' <>', $this->current_user);
                $users = $this->xwb->db->get();
            } else {
                // Process this query if you don't have a foreign table for the display name
                $this->xwb->db->select('u.'.$this->users_id.', u1.'.$this->user_table_fdisplayname.' as display_name');
                $this->xwb->db->from($this->users_table.' u');
                $this->xwb->db->join($this->users_table_other.' u1', 'u.'.$this->users_id.' = u1.'.$this->user_table_fkey, 'left');
                $this->xwb->db->where_in('u.'.$this->users_id, $this->enabled_users);
                $this->xwb->db->where('u.'.$this->users_id.' <>', $this->current_user);
                $users = $this->xwb->db->get();
            }

            // $users_conversation array storage = Stores user data for the contact list
            $users_conversation = [];
            foreach ($users->result() as $key => $value) {
                $users_conversation[] = array(
                    'display_name' => $value->display_name,
                    'cn_id' => '',
                    'user_to' => $value->{$this->users_id},
                );
            }

            // This query is for the group conversation if any
            $this->xwb->db->select('cn.id, cn.conversation_name, cm.id as cm_id, cm.user');
            $this->xwb->db->from('xwb_conversation_name cn');
            $this->xwb->db->join('xwb_conversation_members cm', 'cn.id = cm.cn_id', 'left');
            $this->xwb->db->where('cm.status', 0);
            $cm_res = $this->xwb->db->get();

            $cm_data = []; // Conversation Members data
            foreach ($cm_res->result() as $key => $value) {
                $cm_data[$value->id]['users'][$value->cm_id] = $value->user;
                $cm_data[$value->id]['value'] = $value;
            }


            /* Merge Group Conversation to the contact list */
            foreach ($cm_data as $cmK => $cmV) {
                if (in_array($this->current_user, $cmV['users'])) { // prevent showing on a non member of the group
                    $user_to = implode('|', $cmV['users']);
                    $users_conversation[] = array(
                        'display_name' => $cmV['value']->conversation_name,
                        'cn_id' => $cmV['value']->id,
                        'user_to' => $user_to,
                    );
                }
            }
            
            $this->conversation_count = count($users_conversation);
            $data['users_conversation'] = $users_conversation;
            $data['status'] = true;
        }

        return $data;
    }


    /**
     * Get user
     *
     * @param int $user_id
     * @return object
     */
    public function getUser($user_id)
    {
        $this->xwb->db->where($this->users_id, $user_id);
        return $this->xwb->db->get($this->users_table);
    }

    /**
     * Display console settings for the Chatsocket library
     *
     * @return type
     */
    public function console()
    {
        $this->xwb->load->helper('form');
        $this->xwb->load->library('form_validation');
        $data = array();

        // Process this code block when submitting the form console configuration form
        if ($this->csPost('xwb_console')) {
            $post = $this->xwb->input->post();
            $this->xwb->form_validation->set_rules('users_table', 'Users Table', 'required');
            $this->xwb->form_validation->set_rules('display_name', 'Display Name', 'required');
            $this->xwb->form_validation->set_rules('users_id', 'Users ID', 'required');
            

            if ($this->xwb->form_validation->run() == false) {
                $data['status'] = false;
                $data['message'] = validation_errors();
                log_message('debug', 'You need to configure first the chatsocket console to use this plugin.');
            } else {
                // Save settings to database
                foreach ($post as $key => $value) {
                    $query = $this->xwb->db->get_where($this->table_console, array('name' => $key));

                    if ($query->num_rows()==0) {
                        $data = array(
                            'name' => $key,
                            'value' => trim($value),
                        );

                        $res = $this->xwb->db->insert($this->table_console, $data);
                        $this->{$key} = trim($value);
                    } else {
                        $data = array(
                            'value' => trim($value),
                        );
                        $this->xwb->db->where('name', $key);
                        $this->xwb->db->update($this->table_console, $data);
                        $this->{$key} = trim($value);
                    }
                }


                $data['status'] = true;
                $data['message'] = 'Chatsocket console has been successfully updated.';

                log_message('info', 'Configuration saved.');
            }

            if ($this->xwb->input->is_ajax_request()) {
                echo json_encode($data);
                exit();
            }
        }

        // session
        $ciSessions = $this->xwb->session->userdata;

        $this->session_storage = [];
        // Get all sessions key for the select option data
        $data['session_user_id_keys'] = $this->getSelectSessions($ciSessions);

        // Current session user id key
        $data['session_user_id_key'] = $this->session_user_id_key;


        //Get all the table from the database
        $tables = array('' => 'Select Table');
        foreach ($this->showTables() as $key => $value) {
            $tables[$value['cs_table']] = $value['cs_table'];
        }
        $data['tables'] = $tables;
        $data['users_table'] = $this->users_table;

        /*Get all the fields from the selected users table*/
        $res_users_fields = [];
        if ($data['users_table']!='') {
            $res_users_fields = $this->xwb->db->list_fields($this->users_table);
        }

        $users_fields= array('' => 'Select Field');
        foreach ($res_users_fields as $key => $value) {
            $users_fields[$value] = $value;
        }
        $data['users_fields'] = $users_fields;


        // foreign user table
        $res_fusers_fields = [];
        $data['users_table_other'] = $this->users_table_other;
        if (!empty($this->users_table_other)) {
            $res_fusers_fields = $this->xwb->db->list_fields($this->users_table_other);
        }

        $fusers_field = array('' => 'Select Field');
        foreach ($res_fusers_fields as $key => $value) {
            $fusers_field[$value] = $value;
        }
        $data['fusers_field'] = $fusers_field;
        $data['user_table_fkey'] = $this->user_table_fkey;
        $data['user_table_fdisplayname'] = $this->user_table_fdisplayname;


        $data['picture_table'] = $this->picture_table;

        $res_picture_fields = [];
        if ($data['picture_table']!='') {
            $res_picture_fields = $this->xwb->db->list_fields($data['picture_table']);
        }

        $picture_fields= array('' => 'Select Field');
        foreach ($res_picture_fields as $key => $value) {
            $picture_fields[$value] = $value;
        }


        $data['picture_fields'] = $picture_fields;
        $data['picture_field'] = $this->getConsole('picture_field');

        $data['users_id'] = $this->getConsole('users_id');
        $data['display_name'] = $this->getConsole('display_name');
        $data['profile_pic_path'] = $this->getConsole('profile_pic_path');
        
        $data['picture_filename'] = $this->getConsole('picture_filename');
        $data['picture_table_key'] = $this->getConsole('picture_table_key');

        $data['csrf_key']   = $this->xwb->security->get_csrf_hash();
        $data['csrf_name']  = $this->xwb->security->get_csrf_token_name();

        return $this->xwb->load->view('xwb_console', $data, true);
    }


    /**
     * Get all tables from database
     *
     * @return array
     */
    public function showTables()
    {

        return $this->xwb->db->query('SELECT t.TABLE_NAME AS cs_table FROM INFORMATION_SCHEMA.TABLES AS t WHERE t.TABLE_SCHEMA = '.$this->xwb->db->escape($this->xwb->db->database))->result_array();
    }

    /**
     * Get console settings
     *
     * @param type|string $key
     * @return string
     */
    public function getConsole($key = '')
    {
        $res = $this->xwb->db->get_where($this->table_console, array('name' => $key));

        return ($res->num_rows()==0?'':$res->row()->value);
    }


    /**
     * Installation for the needed mysql tables
     *
     * @return null
     */
    public function installTable()
    {
        $dbuname = $this->xwb->db->username;
        $dbpass = $this->xwb->db->password;
        $dbhost = $this->xwb->db->hostname;
        $dbname = $this->xwb->db->database;
        

        $templine = '';
        // Read in entire file
        $lines = file(APPPATH.'libraries/'.$this->lib_name.'/sql/db_cisocketchat.sql');
        // Loop through each line
        foreach ($lines as $line) {
            // Skip it if it's a comment
            if (substr($line, 0, 2) == '--' || $line == '') {
                continue;
            }

            // Add this line to the current segment
            $templine .= $line;
            // If it has a semicolon at the end, it's the end of the query
            if (substr(trim($line), -1, 1) == ';') {
                // Perform the query
                $this->xwb->db->query($templine);

                // Reset temp variable to empty
                $templine = '';
            }
        }
        log_message('info', 'Database tables has been installed.');
    }


    /**
     * Check if post request from chatsocket
     *
     * @param type|string $form
     * @return boolean
     */
    public function csPost($form = 'xwb')
    {
        return ($this->xwb->input->server('REQUEST_METHOD') == 'POST' && $this->xwb->input->post($this->form_key) == $form);
    }


    /**
     * Check if get request from chatsocket
     *
     * @param type|string $arg
     * @return boollean
     */
    public function csGet($arg = 'xwb')
    {
        return ($this->xwb->input->server('REQUEST_METHOD') == 'GET' && $this->xwb->input->get($this->form_key) == $arg);
    }

    /**
     * Post functions will be process here
     *
     * @return Null
     */
    public function csPostScript()
    {

        /*
		* show messages when users list is clicked
		*
		**/
        if ($this->csPost('xwb_show_message')) {
            $this->showMessage();
        }

        /* Sending message */
        if ($this->csPost('xwb_sendmessage')) {
            $this->sendMessage();
        }


        /* Retrieve the sent message */
        if ($this->csPost('xwb_get_single_message')) {
            $this->getSingleMessage();
        }

        /*Upload attachment*/
        if ($this->csPost('xwb_upload')) {
            $this->uploadAttachment();
            exit();
        }

        /*Delete attachment*/
        if ($this->csPost('xwb_deleteFile')) {
            $this->deleteAttachment();
            exit();
        }

        /*Delete message */
        if ($this->csPost('xwb_deleteMessage')) {
            $this->deleteMessage();
            exit();
        }

        /*Delete all message conversation action */
        if ($this->csPost('xwb_deleteAllMessages')) {
            $this->deleteAllMessages();
            exit();
        }

        /* generate fields from table*/
        if ($this->csPost('xwb_get_usertable_fields')) {
            $this->getUsertableFields();
            exit();
        }

        /* generate fields from foriegn user table */
        if ($this->csPost('xwb_get_otherusertable_fields')) {
            $this->getforeignUsertableFields();
            exit();
        }


        if ($this->csPost('xwb_get_picturetable_fields')) {
            $this->getPicturetableFields();
            exit();
        }
        /* Go to folder path */
        if ($this->csPost('xwb_go_to_path')) {
            $this->goToPath();
            exit();
        }

        /**
         * Get Users for console
         */
        if ($this->csPost('xwb_getUsers')) {
            $this->getUsersConsole();
            exit();
        }
        
        /**
         * Setting chat application enabled for the selected users
         */
        if ($this->csPost('xwb_setUsers')) {
            $this->setEnabledUsers();
            exit();
        }
        
        /**
         * Create new conversation
         */
        if ($this->csPost('xwb_create_conversation')) {
            $this->createConversation();
            exit();
        }
        
        /**
         * Update conversation
         */
        if ($this->csPost('xwb_update_conversation')) {
            $this->updateConversation();
            exit();
        }


        /**
         * Mark conversation as read
         */
        if ($this->csPost('xwb_mark_read')) {
            $this->markConversationRead();
            exit();
        }
    }


    /**
     * Mark conversation as Read
     *
     * @return json
     */
    public function markConversationRead()
    {
        $user = $this->xwb->input->post('users');
        $cn_id = $this->xwb->input->post('cn_id');

        $this->markRead($user, $cn_id);

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        $data['cn_id'] = $cn_id;
        $data['user'] = $user;
        echo json_encode($data);
        exit();
    }


    /**
     * Update group conversation
     *
     * @return json
     */
    public function updateConversation()
    {
        $this->xwb->load->library('form_validation');
        $this->xwb->form_validation->set_rules('conversation_name', 'Conversation Name', 'required');
        $this->xwb->form_validation->set_rules('conversation_users[]', 'Users', 'required');
        $this->xwb->form_validation->set_rules('cn_id', 'Conversation ID', 'required');
        
        $data = array();
        if ($this->xwb->form_validation->run() == false) {
            $data['status'] = false;
            $data['message'] = validation_errors();
            log_message('Error', validation_errors());
        } else {
            $posts = $this->xwb->input->post();

            if (count($posts['conversation_users'])<=1) {
                $data['status'] = false;
                $data['message'] = "Group conversation should have at least 2 users";
                $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
                echo json_encode($data);
                exit();
            }

            $conversation_users = array_merge($posts['conversation_users'], (array)$this->current_user); // Merge conversation users with the current user

            // Get existing users from the conversation
            $this->xwb->db->select('cm.user, cm.id');
            $this->xwb->db->from('xwb_conversation_members cm');
            $this->xwb->db->where('cm.cn_id', $posts['cn_id']);
            $res = $this->xwb->db->get();

            // Get Users to be remove.
            // Check if existing users is not included in the conversation users
            $users_to_remove = [];
            $existing_users = [];
            foreach ($res->result() as $key => $value) {
                $existing_users[] = $value->user;
                if (!in_array($value->user, $conversation_users)) {
                    $users_to_remove[] = $value->user;
                }
            }

            // Get the users to add. These are the new users
            $users_to_update = [];
            $users_to_add = [];
            foreach ($conversation_users as $key => $value) {
                if (!in_array($value, $existing_users)) {
                    $users_to_add[] = $value;
                } else {
                    $users_to_update[] = $value;
                }
            }


            // update users to remove
            if (count($users_to_remove)>0) {
                $this->xwb->db->where('cn_id', $posts['cn_id'])
                ->where_in('user', $users_to_remove);
                $this->xwb->db->update('xwb_conversation_members', array('status'=>1));
            }
            

            // insert users to add
            if (count($users_to_add)>0) {
                $data = [];
                foreach ($users_to_add as $key => $value) {
                    $data[] = array(
                        'user' => $value,
                        'cn_id' => $posts['cn_id']
                    );
                }
                $this->xwb->db->insert_batch('xwb_conversation_members', $data);
            }


            // update existing users
            $this->xwb->db->where('cn_id', $posts['cn_id'])
            ->where_in('user', $users_to_update);
            $this->xwb->db->update('xwb_conversation_members', array('status'=>0));

            // update conversation name
            $this->xwb->db->where('id', $posts['cn_id']);
            $this->xwb->db->update('xwb_conversation_name', array('conversation_name' => $posts['conversation_name']));


            // new users involve
            $this->xwb->db->select('cm.user, cm.status');
            $this->xwb->db->from('xwb_conversation_members cm');
            $this->xwb->db->where('cn_id', $posts['cn_id']);
            $res = $this->xwb->db->get();

            // Get the updated involved users
            $new_users = [];
            $new_all_users = [];
            foreach ($res->result() as $key => $value) {
                if ($value->status==0) {
                    $new_users[] = $value->user;
                }

                $new_all_users[] = array(
                    'user_id' => $value->user,
                    'status' => $value->status,
                );
            }

            $data['status'] = true;
            $data['cn_id'] = $posts['cn_id'];
            $data['conversation_name'] = $posts['conversation_name'];
            $data['conversation_users'] = implode('|', $new_users);
            $data['con_usersArr'] = $new_users;
            $data['con_all_users'] = $new_all_users;
            $data['user_id'] = $this->current_user;

            log_message('info', 'Group conversation updated');
        }

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
        exit();
    }


    /**
     * Create new Group Conversation
     *
     * @return json
     */
    public function createConversation()
    {
        $this->xwb->load->library('form_validation');
        $this->xwb->form_validation->set_rules('conversation_name', 'Conversation Name', 'required');
        $this->xwb->form_validation->set_rules('conversation_users[]', 'Users', 'required');
        $data = array();
        if ($this->xwb->form_validation->run() == false) {
            $data['status'] = false;
            $data['message'] = validation_errors();
        } else {
            $posts = $this->xwb->input->post();

            if (count($posts['conversation_users'])<=1) {
                $data['status'] = false;
                $data['message'] = "Group conversation should have at least 2 users";
                $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
                echo json_encode($data);
                exit();
            }
            // Insert conversation name
            $involve_users = array_merge($posts['conversation_users'], (array)$this->current_user);
            $this->xwb->db->insert('xwb_conversation_name', array('conversation_name'=>$posts['conversation_name']));
            $cn_id = $this->xwb->db->insert_id();

            
            // insert conversation members
            $cm_data = [];
            foreach ($involve_users as $uK => $uV) {
                $cm_data[] = array(
                    'user' => $uV,
                    'cn_id' => $cn_id,
                );
            }

            $this->xwb->db->insert_batch('xwb_conversation_members', $cm_data);

            $li_html = $this->createListConversation($cn_id, $posts['conversation_name'], $involve_users);

            log_message('info', 'Group conversation '.$posts['conversation_name'].' created');

            $data['status'] = true;
            $data['cn_id'] = $cn_id;
            $data['li_main_contact_html'] = $li_html['li_main_contact_html'];
            $data['li_sideuser_html'] = $li_html['li_sideuser_html'];
        }

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
        exit();
    }


    /**
     * Create LI html on newly created Group Conversation
     *
     * @param  int $cn_id             [Conversation Name ID]
     * @param  string $conversation_name [Conversation Name]
     * @param  array $involve_users     [Involve users]
     * @return array                    [list HTML]
     */
    public function createListConversation($cn_id, $conversation_name, $involve_users)
    {
        $li_main_contact_html = '<li class="list-group-item cs-list-users" data-status="" data-user="'.implode('|', $involve_users).'" data-ci="'.$cn_id.'">
        <a href="javascript:;">
        <span class="image">
        <img src="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width=58&height=58&path=/').'" alt="img">
        </span>
        <span class="xwb-display-name">'.$conversation_name.'
        </span>

        </a>
        </li>';
        $li_sideuser_html = '<li class="list-group-item cs-list-users" data-status="" data-user="'.implode('|', $involve_users).'" data-ci="'.$cn_id.'">
        <a href="javascript:;">
        <span class="image">
        <img src="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width=32&height=32&path=/').'" alt="img">
        </span>
        <span class="xwb-display-name">'.$conversation_name.'
        </span>

        </a>
        </li>';
        $result['li_main_contact_html'] = $li_main_contact_html;
        $result['li_sideuser_html'] = $li_sideuser_html;
        return $result;
    }


    /**
     * Get single message
     *
     * @return json
     */
    public function getSingleMessage()
    {
        if ($this->current_user == 0) {
            die('unauthorize access');
        }

        $message_id = $this->xwb->input->post('message_id');
        $ci = $this->xwb->input->post('ci'); // Conversation ID
        $user_id = $this->xwb->input->post('user_id');
        $user_to = $this->xwb->input->post('user_to');

        /* Query for the single message */
        $this->xwb->db->select('m.message,m.message_type,m.attachment,m.status, c.*');
        $this->xwb->db->from('xwb_conversation c');
        $this->xwb->db->join('xwb_messages m', 'c.message_id = m.id');
        $this->xwb->db->where('m.id', $message_id);

        /* $ci has value, it means it is a group conversation */
        if ($ci!="") {
            $this->xwb->db->where('c.conversation_name_id', $ci);
        } else {
            $this->xwb->db->where('c.user_to', $user_to);
        }

        $this->xwb->db->where('c.user_id', $user_id);
        $query = $this->xwb->db->get();
        $res = $query->row();


        $row = $this->singleMessageContainer($res, $user_to);

        $unread = $this->getUnreadCount($user_to, $ci);

        if ($ci!="") {
            /**
             * For the group conversation
             * It will add new group conversation name to the contact list if not exists
             */
            $this->xwb->db->select('cn.conversation_name');
            $this->xwb->db->from('xwb_conversation_name cn');
            $this->xwb->db->where('cn.id', $ci);
            $res_cn = $this->xwb->db->get();
            $res_cn = $res_cn->row();

            $this->xwb->db->select('cm.user');
            $this->xwb->db->from('xwb_conversation_members cm');
            $this->xwb->db->where('cm.cn_id', $ci);
            $res_cm = $this->xwb->db->get();

            $involve_users = [];
            foreach ($res_cm->result() as $key => $value) {
                $involve_users[] = $value->user;
            }

            $li_html = $this->createListConversation($ci, $res_cn->conversation_name, $involve_users);

            $data['li_main_contact_html'] = $li_html['li_main_contact_html'];
            $data['li_sideuser_html'] = $li_html['li_sideuser_html'];
        } else {
            $data['user_to'] = $user_to;
        }
        
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        $data['unreadCount'] = $unread->num_rows();
        $data['cn_id'] = $res->conversation_name_id;
        $data['c_id'] = $res->id;
        $data['row'] = $row;

        echo json_encode($data);
        exit();
    }



    /**
     * Send Message
     *
     * @return json
     */
    public function sendMessage()
    {
        if ($this->current_user == 0) {
            die('unauthorize access');
        }

        $users_to = $this->xwb->input->post('user_to');
        $user_id = $this->xwb->input->post('user_id');
        $ci = $this->xwb->input->post('ci'); // Conversation ID

        $message = $this->xwb->input->post('message');
        $message_type = $this->xwb->input->post('message_type');
        $attachments = $this->xwb->input->post('attachments');

        


        if ($attachments != null) {
            $attachments = explode(',', $attachments);
            $attachments = implode("|", $attachments);
        }
        


        if ($ci=="") { // Merge all involved users if it is a group conversation
            $users = array_merge((array)$users_to, (array)$user_id);
        } else {
            $users = $users_to;
        }
        

        $message = $this->processURL($message); // Convert detected url in the message. Add anchor tag.

        // Insert Message
        $data = array(
            'message' => $message,
            'message_type' => $message_type,
            'attachment' => $attachments,
        );
        $this->xwb->db->insert('xwb_messages', $data);
        $message_id = $this->xwb->db->insert_id();


        // for private conversation
        if (count($users_to)==1) {
            $conversation_data = [];
            $conversation_data[] = array(
                'conversation_type'=> 'private',
                'user_to' => $users_to[0],
                'user_from' => $this->current_user,
                'user_id' => $user_id,
                'message_id' => $message_id,
                'direction' => 'OUT',
                'conversation_type' => 'private',
                'status'    => 0
            );

            $conversation_data[] = array(
                'conversation_type'=> 'private',
                'user_to' => $user_id,
                'user_from' => $this->current_user,
                'user_id' => $users_to[0],
                'message_id' => $message_id,
                'direction' => 'IN',
                'conversation_type' => 'private',
                'status'    => 2
            );

            $encoded_data = json_encode([ 
                'conversation_data' => $conversation_data,
                'message_data' => $data
            ]);

            file_put_contents('chat_data/message.txt', $encoded_data.PHP_EOL , FILE_APPEND | LOCK_EX);

            $this->xwb->db->insert_batch('xwb_conversation', $conversation_data);
        } else {
            // for group conversation
            // insert converstation data
            $conversation_data = [];

            foreach ($users as $key => $value) {
                if (($del_key = array_search($value, $users)) !== false) {
                    $users_conversation = $users;
                    unset($users_conversation[$del_key]);
                }

                $direction = ($user_id == $value?'OUT':'IN');
                $status = ($user_id == $value?0:2);
                $conversation_data[] = array(
                    'conversation_name_id'=> $ci,
                    'user_to' => implode("|", $users_conversation),
                    'user_from' => $this->current_user,
                    'user_id' => $value,
                    'message_id' => $message_id,
                    'direction' => $direction,
                    'conversation_type' => 'group',
                    'status'    => $status
                );
            }
            $this->xwb->db->insert_batch('xwb_conversation', $conversation_data);
        }

        // Get the message to display
        $this->xwb->db->select('m.message, m.message_type, m.attachment, m.status, c.*');
        $this->xwb->db->from('xwb_conversation c');
        $this->xwb->db->join('xwb_messages m', 'c.message_id = m.id');
        $this->xwb->db->where('m.id', $message_id);
        $this->xwb->db->where('c.user_id', $user_id);
        $this->xwb->db->where('c.direction', 'OUT');
        $query = $this->xwb->db->get();
        $res = $query->row();

        $data = array();
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        $data['message_id'] = $message_id;

        $row = $this->singleMessageContainer($res);
        $data['row'] = $row;
        echo json_encode($data);
        exit();
    }



    /**
     * Show messages to window
     *
     * @return json
     */
    public function showMessage()
    {
        $user_to = $this->xwb->input->post('user_to');
        $ci = $this->xwb->input->post('ci'); // Conversation IID
        $start_from = $this->xwb->input->post('start_from');
        $is_recieved = $this->xwb->input->post('is_recieved');

        /* get all messages */
        $this->xwb->db->select('COUNT(*) as total_rows', false);
        $this->xwb->db->from('xwb_conversation c');
        $this->xwb->db->join('xwb_messages m', 'c.message_id = m.id');

        if ($ci!="") { // If group conversation
            $this->xwb->db->where('c.conversation_name_id', $ci);
        } else { // If private conversation
            $this->xwb->db->where('c.user_to', $user_to);
        }
        
        $this->xwb->db->where('c.user_id', $this->current_user);
        $this->xwb->db->where_in('c.status', array(0,2));
        $q = $this->xwb->db->get();
        $total_rows = $q->row()->total_rows;

        if ($start_from != '') {
            $start_row = $total_rows - ($start_from+$this->display_rows);
        } else {
            $start_row = $total_rows - $this->display_rows;
        }

        
        if ($start_row < 0) {
            $display_rows = $this->display_rows + $start_row;
            $start_row = 0;
        } else {
            $display_rows = $this->display_rows;
        }

        if ($start_from >= $total_rows) {
            $start_row = 1; // Settings this to 1 because codeigniter DB_query_builder does not concatenate the limit if booth offset and limit is zero
            $display_rows = 0;
        }

        // display chat messages with limit
        $this->xwb->db->select('m.message, m.message_type, m.attachment, m.status, c.*');
        $this->xwb->db->from('xwb_conversation c');
        $this->xwb->db->join('xwb_messages m', 'c.message_id = m.id');
        if ($ci!="") {
            $this->xwb->db->where('c.conversation_name_id', $ci);
        } else {
            $this->xwb->db->where('c.user_to', $user_to);
        }
        $this->xwb->db->where('c.user_id', $this->current_user);
        $this->xwb->db->where_in('c.status', array(0,2));
        $this->xwb->db->limit($display_rows);
        $this->xwb->db->offset($start_row);
        $query = $this->xwb->db->get();
        $res = $query->result();

        /* Store messages html to $row */
        $row = "";
        if ($query->num_rows()>0) {
            foreach ($res as $key => $value) {
                $row .= $this->singleMessageContainer($value);
            }
        } else {
            $row .= '<div class="no_messages">';
            $row .= '<h3 class="text-center no-more-messages">No Messages Available</h3>';
            $row .= '</div>';
        }

        // mark conversation as read if it is not coming from outside/other user
        if ($is_recieved==0) {
            $this->markRead($user_to, $ci);
        }



        /* Get Conversation data */
        if ($ci!='') { // group conversation
            $ci_res =  $this->xwb->db->get_where('xwb_conversation_name', array('id'=>$ci))->row();
            $conversation_name = $ci_res->conversation_name;

            $cn_id = $ci;
            $user_id = $this->current_user;
            $this->xwb->db->select('cm.user,cn.conversation_name');
            $this->xwb->db->from('xwb_conversation_members cm');
            $this->xwb->db->join('xwb_conversation_name cn', 'cm.cn_id = cn.id');
            $this->xwb->db->where('cm.status', 0);
            $this->xwb->db->where('cm.cn_id', $cn_id);
            $res = $this->xwb->db->get();

            $conversatoin_users = [];
            foreach ($res->result() as $key => $value) {
                $conversatoin_users[] = $value->user;
            }

            $conversation_name = $res->row()->conversation_name;
            $data['conversation_users'] = implode('|', $conversatoin_users);
            $data['con_usersArr'] = $conversatoin_users;
            $data['cn_id'] = $cn_id;
            $data['user_disable'] = (!in_array($user_id, $conversatoin_users)?true:false);
        } else {
            // private conversation
            if (empty($this->users_table_other)) {
                $this->xwb->db->select('u.'.$this->users_id.', u.'.$this->display_name.' as display_name');
                $this->xwb->db->from($this->users_table.' u');
                $this->xwb->db->where('u.'.$this->users_id, $user_to);
                $res_user = $this->xwb->db->get()->row();
                $conversation_name = $res_user->display_name;
            } else {
                $this->xwb->db->select('u.'.$this->users_id.', u1.'.$this->user_table_fdisplayname.' as display_name');
                $this->xwb->db->from($this->users_table.' u');
                $this->xwb->db->join($this->users_table_other.' u1', 'u.'.$this->users_id.' = u1.'.$this->user_table_fkey, 'left');
                $this->xwb->db->where('u.'.$this->users_id, $user_to);
                $res_user = $this->xwb->db->get()->row();
                $conversation_name = $res_user->display_name;
            }
        }


        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        $data['row'] = $row;
        $data['user_to'] = explode('|', $user_to);
        $data['user_id'] = $this->current_user;
        $data['conversation_name'] = $conversation_name;
        $data['ci'] = $ci;
        

        echo json_encode($data);
        exit();
    }



    /**
     * Setting chat application enabled for the selected users
     *
     * @return json
     */
    public function setEnabledUsers()
    {
        $post = $this->xwb->input->post();

        if ($this->xwb->input->post('enabled_users')) {
            $users = json_encode($post['enabled_users']);
        } else {
            $users = '';
        }

        $query = $this->xwb->db->get_where($this->table_console, array('name' => 'enabled_users'));

        if ($query->num_rows()==0) {
            $data = array(
                'name' => 'enabled_users',
                'value' => $users,
            );

            $res = $this->xwb->db->insert($this->table_console, $data);
        } else {
            $data = array(
                'value' => $users,
            );

            $this->xwb->db->where('name', 'enabled_users');
            $this->xwb->db->update($this->table_console, $data);
        }

        $data['message'] = '<div class="alert alert-success">
        <strong>Success!</strong> Settings updated
        </div>';
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();

        echo json_encode($data);
        exit();
    }


    /**
     * This function will get all the users.
     * It will display to the bootbox in the console configuration where the admin can select the users whom this chat application to be enabled.
     *
     * @return json [Users list]
     */
    public function getUsersConsole()
    {
        $users_table = $this->xwb->input->post('users_table');
        $users_id = $this->xwb->input->post('users_id');
        $display_name = $this->xwb->input->post('display_name');
        $users_table_other = $this->xwb->input->post('users_table_other');
        $users_table_other_id = $this->xwb->input->post('users_table_other_id');
        $users_table_other_displayname = $this->xwb->input->post('users_table_other_displayname');

        if (empty($users_table) || empty($users_id) || empty($display_name)) {
            $data['html'] = '<tr><td colspan="2">'.$this->errorContainer('Please select users table, users id and users display name').'</td></tr>';
            $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
            echo json_encode($data);
            exit();
        }

        if (!empty($users_table_other)) {
            $user_fid = $users_table_other_id;
            $display_name = $users_table_other_displayname;
            $this->xwb->db->select('u.'.$users_id.', u1.'.$display_name);
            $this->xwb->db->from($users_table.' u');
            $this->xwb->db->join($users_table_other.' u1', 'u.'.$users_id.' = u1.'.$user_fid, 'left');
            $result = $this->xwb->db->get();
        } else {
            $this->xwb->db->select('u.'.$users_id.', u.'.$display_name)
            ->from($users_table.' u');
            $result = $this->xwb->db->get();
        }


        $enabled_users = (array)$this->enabled_users;
        $data = array();
        if ($result->num_rows()>0) {
            $data['html'] = '';
            foreach ($result->result() as $key => $value) {
                $data['html'] .= '<tr>';
                $data['html'] .= '<td>';
                $selected = (in_array($value->{$users_id}, $enabled_users)?"checked":"");
                $data['html'] .= '<label><input class="users-check" name="enabled_users[]" type="checkbox" value="'.$value->{$users_id}.'" '.$selected.'> '.$value->{$users_id}.'</label>';
                $data['html'] .= '</td>';
                $data['html'] .= '<td>';
                $data['html'] .= '<label>'.$value->{$display_name}.'</label>';
                $data['html'] .= '</td>';
                $data['html'] .= '</tr>';
            }
        } else {
            $data['html'] .= '<tr><td colspan="2">No Users Found</td></tr>';
        }
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
        exit();
    }

    /**
     * Go to folder path and display folders
     * This will be displayed in the Console Configuration when the admin choose where the profile picture path is located
     *
     * @return json
     */
    public function goToPath()
    {

        $path = $this->xwb->input->post('path');
        $current_dir = $this->xwb->input->post('current_dir');

        if ($path!="") {
            $cwd = $path;
        } else {
            $cwd = getcwd();
        }

        if ($path == "..") {
            $last_path = strrpos($current_dir, '/');

            $cwd = substr($current_dir, 0, $last_path);
        }

        $dir = scandir($cwd);

        $dir_list = "<ul>";
        foreach ($dir as $key => $value) {
            if (is_dir($cwd.'/'.$value) && $value!='.') {
                if ($value!='..') {
                    $path_value = $cwd.'/'.$value;
                } else {
                    $path_value = $value;
                }

                $radio = '<input value="'.$path_value.'" name="folders" class="xwb-folder-selected" type="radio" />';
                $radio = ($value!='.' && $value!='..'?$radio:'');

                $dir_list .='<li>'.$radio.'<a href="javascript:;" onClick="goToPath(\''.$path_value.'\')">'.$value.'</a></li>';
            }
        }
        $dir_list .= "</ul>";

        $data['dir_list'] = $dir_list;
        $data['current_dir'] = $cwd;
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();

        echo json_encode($data);
        exit();
    }

    /**
     * Get picture table's fields
     *
     * @return json
     */
    public function getPicturetableFields()
    {
        $table = $this->xwb->input->post('table');
        if (!empty($table)) {
            $fields = $this->xwb->db->list_fields($table);
        } else {
            $fields = [];
        }
        $data['picture_field'] = $this->picture_field;
        $data['picture_table_key'] = $this->picture_table_key;
        $data['fields'] = $fields;
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();

        echo json_encode($data);
        exit();
    }


    /**
     * Get foreign user table fields
     *
     * @return json
     */
    public function getforeignUsertableFields()
    {
        $table = $this->xwb->input->post('table');
        if (!empty($table)) {
            $fields = $this->xwb->db->list_fields($table);
        } else {
            $fields = [];
        }

        $data['fields'] = $fields;
        $data['user_table_fkey'] = $this->user_table_fkey;
        $data['user_table_fdisplayname'] = $this->user_table_fdisplayname;
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
        exit();
    }

    /**
     * Get user table's fields
     *
     * @return json
     */
    public function getUsertableFields()
    {
        $table = $this->xwb->input->post('table');
        if (!empty($table)) {
            $fields = $this->xwb->db->list_fields($table);
        } else {
            $fields = [];
        }
        $data['fields'] = $fields;
        $data['user_id_field'] = $this->users_id;
        $data['user_name_field'] = $this->display_name;
        $data['users_table_other'] = $this->users_table_other;
        $data['picture_filename'] = $this->picture_filename;
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();

        echo json_encode($data);
        exit();
    }

    /**
     * Delete uploaded attachment
     *
     * @return json
     */
    public function deleteAttachment()
    {
        $attachmentID = $this->xwb->input->post('attachmentID');
        $attachment = $this->xwb->db->get_where('xwb_attachments', array('id'=>$attachmentID))->row();
        if (is_null($attachment)===false) {
            $fullPath = $attachment->full_path;
            $deleted = unlink($fullPath);
        } else {
            $fullPath = null;
            $deleted = false;
        }

        
        if (!$deleted) {
            $data['response'] = "Error deleting file, please contact the programmer";
        } else {
            $this->xwb->db->delete('xwb_attachments', array('id' => $attachmentID));
            $data['response'] = "File has been successfully deleted";
        }
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
    }

    /**
     * Upload attachment process
     *
     * @return json
     */
    public function uploadAttachment()
    {
        $packagePath = APPPATH.'libraries/'.$this->lib_name.'/attachment/';

        /*
		Create user directory
		 */
        if (!is_dir($packagePath.$this->current_user)) {
            if (@mkdir($packagePath.$this->current_user, 0777, true)===false) {
                log_message('error', $packagePath.' is not writable');
                http_response_code(406);
                $data['response']  = $packagePath.' is not writable';
                $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
                echo json_encode($data);
                exit();
            }
        }

        $config['upload_path']          = $packagePath.$this->current_user;
        $config['allowed_types']        = 'gif|jpg|png|zip|zipx|rar|7z|pdf|doc|docx|txt|odt|mp3|mp4';
        $config['max_size']             = 25000;

        $this->xwb->load->library('upload', $config);

        if (! $this->xwb->upload->do_upload('file')) {
            $data['response']  = strip_tags($this->xwb->upload->display_errors());
            log_message('debug', 'Error uploading files');
            http_response_code(406);
        } else {
            $uploadData = $this->xwb->upload->data();
            $uploadData['user_id'] = $this->current_user;
            $this->xwb->db->insert('xwb_attachments', $uploadData);

            $data  = array(
                'attachmentID' => $this->xwb->db->insert_id(),
                'attachmentFileName' => $uploadData['file_name'],
            );
        }
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
    }


    /**
     * Process form GET Request
     *
     * @return mixed
     */
    public function csGetScript()
    {

        /**
         * view image resized
         */
        if ($this->csGet('xwb_resizeimage')) {
            $this->viewImage();
            exit();
        }

        /**
         * Download single attachment
         */
        if ($this->csGet('xwb_downloadAttachment')) {
            $this->downloadAttachment();
            exit();
        }

        /**
         * Download all attachment
         */
        if ($this->csGet('xwb_downloadAllAttachment')) {
            $this->downloadAllAttachment();
            exit();
        }
        

        /**
         * Get Video
         */
        if ($this->csGet('xwb_playVideo')) {
            $this->playVideo();
            exit();
        }
        
        /**
         * Get Video
         */
        if ($this->csGet('xwb_getVideo')) {
            $this->getVideo();
            exit();
        }

        /**
         * Get users for group conversation
         */
        if ($this->csGet('xwb_get_users')) {
            $this->searchUsers();
            exit();
        }

        /**
         * Get Conversation Option
         */
        if ($this->csGet('xwb_get_conversation_option')) {
            $this->getConversationOption();
            exit();
        }


        /**
         * Get Conversation Data
         */
        if ($this->csGet('xwb_get_group_conversation_data')) {
            $this->getGroupConversationData();
            exit();
        }

        /**
         * change sidebar tray state to close or open
         */
        if ($this->csGet('xwb_open_close_sideuser')) {
            $this->changeSideUsersState();
            exit();
        }
    }

    /**
     * Change the state of the conversation list tray to open or close
     *
     * @return json
     */
    public function changeSideUsersState()
    {
        $state = $this->xwb->input->get('state');

        $this->xwb->session->set_userdata('side_user_state', $state);
        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
        exit();
    }

    /**
     * Get Conversation Data
     *
     * @return json
     */
    public function getGroupConversationData()
    {
        $cn_id = $this->xwb->input->get('cn_id');
        $user_id = $this->xwb->input->get('user_id');
        $this->xwb->db->select('cm.user,cn.conversation_name');
        $this->xwb->db->from('xwb_conversation_members cm');
        $this->xwb->db->join('xwb_conversation_name cn', 'cm.cn_id = cn.id');
        $this->xwb->db->where('cm.status', 0);
        $this->xwb->db->where('cm.cn_id', $cn_id);
        $res = $this->xwb->db->get();

        $conversatoin_users = [];
        foreach ($res->result() as $key => $value) {
            $conversatoin_users[] = $value->user;
        }

        $data['conversation_name'] = $res->row()->conversation_name;
        $data['conversation_users'] = implode('|', $conversatoin_users);
        $data['con_usersArr'] = $conversatoin_users;
        $data['cn_id'] = $cn_id;
        $data['user_disable'] = (!in_array($user_id, $conversatoin_users)?true:false);

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
        exit();
    }

    /**
     * Get conversation options
     *
     * @return json
     */
    public function getConversationOption()
    {
        $cn_id = $this->xwb->input->get('cn_id');
        $this->xwb->db->select('cn.conversation_name, cm.id as cm_id, cm.user, cm.status, u.'.$this->users_id.' as u_id, u.'.$this->display_name.' as display_name');
        $this->xwb->db->from('xwb_conversation_name cn');
        $this->xwb->db->join('xwb_conversation_members cm', 'cn.id = cm.cn_id', 'left');
        $this->xwb->db->join($this->users_table.' u', 'cm.user = u.'.$this->users_id, 'left');
        $this->xwb->db->where('cn.id', $cn_id);
        $this->xwb->db->where('cm.user <>', $this->current_user);
        $this->xwb->db->where('cm.status', 0);
        $res = $this->xwb->db->get();
        $conversation_name = $res->row()->conversation_name;
        $users = [];
        foreach ($res->result() as $key => $value) {
            $users[$value->u_id] = array(
                'cm_id' => $value->cm_id,
                'display_name' => $value->display_name,
                'status' => $value->status
            );
        };

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        $data['users'] = $users;
        $data['conversation_name'] = $conversation_name;
        echo json_encode($data);
        exit();
    }

    /**
     * Get all enabled users
     *
     * @return json
     */
    public function getUsers()
    {

        $term = $this->xwb->input->get('term');

        if (empty($this->users_table_other)) {
            $this->xwb->db->select('u.'.$this->users_id.', u.'.$this->display_name.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->where_in('u.'.$this->users_id, $this->enabled_users);
            $this->xwb->db->where('u.'.$this->users_id.' <>', $this->current_user);
            $res = $this->xwb->db->get();
        } else {
            $this->xwb->db->select('u.'.$this->users_id.', u1.'.$this->user_table_fdisplayname.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->join($this->users_table_other.' u1', 'u.'.$this->users_id.' = u1.'.$this->user_table_fkey, 'left');
            $this->xwb->db->where_in('u.'.$this->users_id, $this->enabled_users);
            $this->xwb->db->where('u.'.$this->users_id.' <>', $this->current_user);
            $res = $this->xwb->db->get();
        }

        $data['results'] = [];
        if ($res->num_rows()>0) {
            foreach ($res->result() as $key => $value) {
                $data['results'][] = array(
                    "id" => $value->{$this->users_id},
                    "text" => $value->display_name,
                );
            }
        }
        
        echo json_encode($data);
        exit();
    }


    /**
     * Search all enabled users
     *
     * @return json
     */
    public function searchUsers()
    {

        $term = $this->xwb->input->get('term');

        if (empty($this->users_table_other)) {
            $this->xwb->db->select('u.'.$this->users_id.', u.'.$this->display_name.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->where_in('u.'.$this->users_id, $this->enabled_users);
            $this->xwb->db->like('u.'.$this->display_name, $term);
            $this->xwb->db->where('u.'.$this->users_id.' <>', $this->current_user);
            $res = $this->xwb->db->get();
        } else {
            $this->xwb->db->select('u.'.$this->users_id.', u1.'.$this->user_table_fdisplayname.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->join($this->users_table_other.' u1', 'u.'.$this->users_id.' = u1.'.$this->user_table_fkey, 'left');
            $this->xwb->db->where_in('u.'.$this->users_id, $this->enabled_users);
            $this->xwb->db->like('u1.'.$this->user_table_fdisplayname, $term);
            $this->xwb->db->where('u.'.$this->users_id.' <>', $this->current_user);
            $res = $this->xwb->db->get();
        }

        $data['results'] = [];
        if ($res->num_rows()>0) {
            foreach ($res->result() as $key => $value) {
                $data['results'][] = array(
                    "id" => $value->{$this->users_id},
                    "text" => $value->display_name,
                );
            }
        }
        
        echo json_encode($data);
        exit();
    }


    /**
     * Get Video file header
     *
     * @return mixed
     */
    public function getVideo()
    {
        $pathID = $this->xwb->input->get("id");
        $res = $this->xwb->db->get_where('xwb_attachments', array('id' => $pathID))->row();
        
        $file = $res->full_path;


        $fp = @fopen($file, 'rb');
        $size   = filesize($file); // File size
        $length = $size;           // Content length
        $start  = 0;               // Start byte
        $end    = $size - 1;       // End byte
        header('Content-type: '.$res->file_type);
        header("Accept-Ranges: 0-$length");
        if (isset($_SERVER['HTTP_RANGE'])) {
            $c_start = $start;
            $c_end   = $end;
            list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
            if (strpos($range, ',') !== false) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes $start-$end/$size");
                exit;
            }
            if ($range == '-') {
                $c_start = $size - substr($range, 1);
            } else {
                $range  = explode('-', $range);
                $c_start = $range[0];
                $c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
            }
            $c_end = ($c_end > $end) ? $end : $c_end;
            if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes $start-$end/$size");
                exit;
            }
            $start  = $c_start;
            $end    = $c_end;
            $length = $end - $start + 1;
            fseek($fp, $start);
            header('HTTP/1.1 206 Partial Content');
        }
        header("Content-Range: bytes $start-$end/$size");
        header("Content-Length: ".$length);
        $buffer = 1024 * 8;
        while (!feof($fp) && ($p = ftell($fp)) <= $end) {
            if ($p + $buffer > $end) {
                $buffer = $end - $p + 1;
            }
            set_time_limit(0);
            echo fread($fp, $buffer);
            flush();
        }
        fclose($fp);
        exit();
    }



    /**
     * Play Video file using HTML5
     *
     * @return mixed
     */
    public function playVideo()
    {
        $id = $this->xwb->input->get("id");
        $res = $this->xwb->db->get_where('xwb_attachments', array('id' => $id))->row();

        $videoHTML = '<video width="100%" height="350" controls>
        <source src="'.base_url('?'.$this->form_key.'=xwb_getVideo&id='.$id).'" type="video/mp4">
        Your browser does not support the video tag.
        </video>';

        echo $videoHTML;
        die();
    }

    /**
     * View image header
     *
     * @return mixed
     */
    public function viewImage()
    {
        ini_set('gd.jpeg_ignore_warning', true);
        $path = $this->xwb->input->get("path");
        
        if (@getimagesize($path) === false) {
            $path = FCPATH.'xwb_assets/images/default.jpg';
        }
        
        

     //getting extension type (jpg, png, etc)
        $type = explode(".", $path);
        $ext = strtolower($type[sizeof($type)-1]);

        $ext = (!in_array($ext, array("jpeg","png","gif"))) ? "jpeg" : $ext;

        //get image size
        $size = getimagesize($path);

        $width = $size[0];
        $height = $size[1];
        
        //get source image
        $func = "imagecreatefrom".$ext;
        $source = $func($path);
        
        //setting default values
        
        $new_width = $width;
        $new_height = $height;
        $k_w = 1;
        $k_h = 1;
        $dst_x =0;
        $dst_y =0;
        $src_x =0;
        $src_y =0;
        
        //selecting width and height

        if ($this->xwb->input->get("width")==null && $this->xwb->input->get("height")==null) {
            $new_height = $height;
            $new_width = $width;
        } else if ($this->xwb->input->get("width")==null) {
            $new_height = $this->xwb->input->get("height");
            $new_width = ($this->xwb->input->get("height"))/$height;
        } else if ($this->xwb->input->get("height")==null) {
            $new_height = ($height*$this->xwb->input->get("width"))/$width;
            $new_width = $this->xwb->input->get("width");
        } else {
            $new_width = $this->xwb->input->get("width");
            $new_height = $this->xwb->input->get("height");
        }
        
        //secelcting_offsets

        if ($new_width>$width) {//by width
            $dst_x = ($new_width-$width)/2;
        }
        if ($new_height>$height) {//by height
            $dst_y = ($new_height-$height)/2;
        }
        if ($new_width<$width || $new_height<$height) {
            $k_w = $new_width/$width;
            $k_h = $new_height/$height;

            if ($new_height>$height) {
                $src_x  = ($width-$new_width)/2;
            } else if ($new_width>$width) {
                $src_y  = ($height-$new_height)/2;
            } else {
                if ($k_h>$k_w) {
                    $src_x = round(($width-($new_width/$k_h))/2);
                } else {
                    $src_y = round(($height-($new_height/$k_w))/2);
                }
            }
        }
        $output = imagecreatetruecolor($new_width, $new_height);
        
        //to preserve PNG transparency
        if ($ext == "png") {
            //saving all full alpha channel information
            imagesavealpha($output, true);
            //setting completely transparent color
            $transparent = imagecolorallocatealpha($output, 0, 0, 0, 127);
            //filling created image with transparent color
            imagefill($output, 0, 0, $transparent);
        }

        imagecopyresampled(
            $output,
            $source,
            $dst_x,
            $dst_y,
            $src_x,
            $src_y,
            $new_width-2*$dst_x,
            $new_height-2*$dst_y,
            $width-2*$src_x,
            $height-2*$src_y
        );
        //free resources
        ImageDestroy($source);

        //output image
        header('Content-Disposition: inline');
        header('Content-Type: image/'.$ext);
        $func = "image".$ext;
        $func($output);
        
        //free resources
        ImageDestroy($output);
        exit();
    }


    /**
     * Container for every messages
     *
     * @param array $data
     * @param int $user_to
     * @return string
     */
    public function singleMessageContainer($data, $user_to = '')
    {
        $emojioneClient = new EmojioneClient();
        $emojioneClient->cacheBustParam = '';
        $emojioneClient->imagePathPNG = base_url('xwb_assets/vendor/emojione/assets/png/32').'/';
        Emojione::setClient($emojioneClient);

        $qry_userto = ($user_to!=""?$user_to:$data->user_to);

        
        if (empty($this->users_table_other)) {
            $this->xwb->db->select('u.'.$this->users_id.' AS id, u.'.$this->display_name.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->where('u.'.$this->users_id, $data->user_id);
            $user = $this->xwb->db->get()->row();

            $this->xwb->db->select('u.'.$this->users_id.' AS id, u.'.$this->display_name.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->where('u.'.$this->users_id, $data->user_from);
            $user_to = $this->xwb->db->get()->row();
        } else { // process this query if the display name come from the foreign table
            $this->xwb->db->select('u.'.$this->users_id.' AS id, u1.'.$this->user_table_fdisplayname.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->join($this->users_table_other.' u1', 'u.'.$this->users_id.' = u1.'.$this->user_table_fkey, 'left');
            $this->xwb->db->where('u.'.$this->users_id, $data->user_id);
            $user = $this->xwb->db->get()->row();

            $this->xwb->db->select('u.'.$this->users_id.' AS id, u1.'.$this->user_table_fdisplayname.' as display_name');
            $this->xwb->db->from($this->users_table.' u');
            $this->xwb->db->join($this->users_table_other.' u1', 'u.'.$this->users_id.' = u1.'.$this->user_table_fkey, 'left');
            $this->xwb->db->where('u.'.$this->users_id, $data->user_from);
            $user_to = $this->xwb->db->get()->row();
        }



        if (strtolower($data->direction) == "in") {
            $pic_position = 'right';
            $time_position = 'left';
            $user = $user_to;
        } else {
            $pic_position = 'left';
            $time_position = 'right';
            $user = $user;
        }



        $row = "";
        $row .= '<div data-mid="'.$data->message_id.'" data-cid="'.$data->id.'" class="message-row message-'.strtolower($data->direction).'">';
        if ($user===null) {
            $row .= $this->errorContainer('User is Null. Please configure the console accordingly');
            log_message('error', 'User is Null. Please configure the console accordingly');
        } else {
            $row .='<div class="profile-pic pull-'.$pic_position.'">';
            $row .='<img class="img-circle" title="User1" alt="User1" src="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width=25&height=25&path='.$this->getProfilePicPath($user->id)).'">';
            $row .='</div>';
            $row .= '<div class="col-md-12 col-sm-12 col-xs-12 message-box">';
            $row .='<div class="message_header">';
            $row .='<small class="list-group-item-heading text-muted text-primary pull-'.$pic_position.'">'.$user->display_name.'</small>';
            $row .='<small class="time pull-'.$time_position.' text-muted">'.csTimeElapse($data->date).'</small>';
            $row .='</div>';
            $row .='<div class="message_row_container '.strtolower($data->direction).'">';
            if (!empty($data->message)) {
                $row .='<p class="list-group-item-text">';
                $message = Emojione::shortnameToImage($data->message);
                $message = $this->prettyPhotoURL($message, $data->id);
                $row .= nl2br($message);
                $row .='</p>';
            }
            
            if ($data->message_type == 'attachment') {
                $attachmentIDs = explode('|', $data->attachment);
                $row .= $this->getAttachments($attachmentIDs, $data->message_id);
            }
            $row .='</div>';


            $row .= '</div>';
            $row .= '<a href="javascript:;" onClick="deleteMessage('.$data->id.')" class="delete-message pull-left">';
            $row .= '<i class="fa fa-trash-o"></i>';
            $row .= '</a>';
        }
        


        $row .= '</div>';
        return $row;
    }


    /**
     * Add prettyphoto rel to view youtube and vimeo video in lightbox
     *
     * @param  string $s String
     * @param  integer $message_id
     * @return string
     */
    public function prettyPhotoURL($s, $message_id = 0)
    {
        $dom = new DomDocument();
        $dom->loadHTML($s);
        $output = array();

        foreach ($dom->getElementsByTagName('a') as $item) {
            if (strpos($item->getAttribute('href'), 'youtube.com/watch') > 0 || strpos($item->getAttribute('href'), 'youtu.be') || strpos($item->getAttribute('href'), 'vimeo.com')) {
                $item->removeAttribute('target');
                $item->setAttribute("rel", "prettyPhoto[message_gal_".$message_id."]");
            }
        }
        $s=$dom->saveHTML();
        return $s;
    }

    /**
     * Auto add anchor tag for the detected URL
     *
     * @param  string $s [String]
     * @return string
     */
    public function processURL($s)
    {
        return preg_replace('@(?<!href="|">)(https?:\/\/[\w\-\.!~?&=+\*\'(),\/]+)((?!\<\/\a\>).)*@i', '<a href="$1" target="_blank">$1</a>', $s);
    }

    /**
     * This will display the attachment list in each message row
     *
     * @param type|array $attachmentIDs
     * @param type|int $message_id
     * @return string
     */
    public function getAttachments($attachmentIDs = array(), $message_id = 0)
    {
        $this->xwb->db->select('*');
        $this->xwb->db->from('xwb_attachments a');
        $this->xwb->db->where_in('id', $attachmentIDs);
        $attachment = $this->xwb->db->get();


        $html = "";
        $html .= '<div class="attachment">
        <p>
        <span><i class="fa fa-paperclip"></i> '.$attachment->num_rows().' attachments — </span>
        <a href="'.base_url('?'.$this->form_key.'=xwb_downloadAllAttachment&messageID='.$message_id).'">Download all attachments</a>
        </p>
        <ul>';
        if ($attachment->num_rows()>0) {
            foreach ($attachment->result() as $key => $value) {
                $html .= '<li class="'.str_replace('/', '-', $value->file_type).'">';
                if ($value->is_image==1) { // if attachement is image
                    $html .= '<a href="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width='.$value->image_width.'&height='.$value->image_height.'&path='.$value->full_path).'" rel="prettyPhoto[message_gal_'.$message_id.']" title="'.$value->file_name.'"><img src="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width=150&height=150&path='.$value->full_path).'" width="150" height="150" alt="'.$value->file_name.'" /></a>';
                } elseif ($value->file_type == "video/mp4" || $value->file_type == "video/webm") { // if attachment is mp4 or webm
                    $html .= '<a href="'.base_url('?'.$this->form_key.'=xwb_playVideo&id='.$value->id.'&ajax=true').'" rel="prettyPhoto[message_gal_'.$message_id.']" title="'.$value->file_name.'"><img src="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width=150&height=150&path='.APPPATH.'libraries/'.$this->lib_name.'/views/images/default-still-video.png').'" width="150" height="150" alt="'.$value->file_name.'" /></a>';
                } elseif ($value->file_type == "audio/mpeg") { // if attachment is mp3 audio
                    $html .= '<audio controls>
                    <source src="'.base_url('?'.$this->form_key.'=xwb_getVideo&id='.$value->id).'" type="'.$value->file_type.'">
                    Your browser does not support the audio element.
                    </audio>';
                } else { // if attachment is not media
                    $html .= '<a href="'.base_url('?'.$this->form_key.'=xwb_downloadAttachment&attachment='.$value->id).'" title="'.$value->file_name.'"><img src="'.base_url('?'.$this->form_key.'=xwb_resizeimage&width=150&height=150&path='.$value->full_path).'" width="150" height="150" alt="'.$value->file_name.'" /></a>';
                }

                $html .=' <div class="file-name">
                <a href="'.base_url('?'.$this->form_key.'=xwb_downloadAttachment&attachment='.$value->id).'">Download</a>
                </div>
                <span>'.$value->file_size.'KB</span>
                </li>';
            }
        }


        $html .= '</ul>
        </div>';

        return $html;
    }

    /**
     * Get profile picture path
     *
     * @param int $user_id
     * @return string
     */
    public function getProfilePicPath($user_id)
    {
        $path = '';
        $field_path = "";
        $profile_pic_path = trim($this->getConsole('profile_pic_path'));

        $picture_table = $this->picture_table;

        if (!empty($picture_table) || !empty($this->picture_filename)) {
            if (empty($picture_table)) {
                $this->xwb->db->select('u.'.$this->picture_filename);
                $this->xwb->db->from($this->users_table.' u');
                $this->xwb->db->where('u.'.$this->users_id, $user_id);
                $res = $this->xwb->db->get();
                if ($res->num_rows()===0) {
                    log_message('Error', 'Check the console configuration for the posible misconfiguration');
                    $field_path = '';
                } else {
                    $field_path = $res->row()->{$this->picture_filename};
                }
            } else {
                $this->xwb->db->select('p.'.$this->picture_field);
                $this->xwb->db->from($this->users_table.' u');
                $this->xwb->db->join($this->picture_table.' p', 'u.'.$this->users_id.' = p.'.$this->picture_table_key, 'left');
                $this->xwb->db->where('u.'.$this->users_id, $user_id);
                $res = $this->xwb->db->get();
                if ($res->num_rows()===0) {
                    log_message('Error', 'Check the console configuration for the posible misconfiguration');
                    $field_path = '';
                } else {
                    $field_path = $res->row()->{$this->picture_field};
                }
            }
        } else {
            $field_path = '';
        }
        if (!empty($profile_pic_path)) {
            $path = rtrim($profile_pic_path, '/').'/';
        }

        $path = $path.$field_path;

        return $path;
    }


    /**
     * Download single attachment
     *
     * @return void
     */
    public function downloadAttachment()
    {
        $this->xwb->load->helper('download');
        $attachmentID = $this->xwb->input->get('attachment');
        $attachment = $this->xwb->db->get_where('xwb_attachments', array('id'=>$attachmentID))->row();

        $data = file_get_contents($attachment->full_path); // Read the file's contents
        
        force_download(basename($attachment->full_path), $data);
    }


    /**
     * Download all attachment of the message as a zip
     *
     * @return void
     */
    public function downloadAllAttachment()
    {
        $this->xwb->load->helper('download');
        $this->xwb->load->library('zip');

        $messageID = $this->xwb->input->get('messageID');
        $message = $this->xwb->db->get_where('xwb_messages', array('id'=>$messageID))->row();
        $attachments = explode('|', $message->attachment);
        $this->xwb->db->where_in('id', $attachments);
        $attachments = $this->xwb->db->get('xwb_attachments');
        $attachmentFilenames = [];
        foreach ($attachments->result() as $key => $value) {
            $this->xwb->zip->read_file($value->full_path);
        }

        $this->xwb->zip->download('attachment.zip');
    }


    /**
     * Delete single message
     *
     * @return json
     */
    public function deleteMessage()
    {
        $conversationID = $this->xwb->input->post('conversationID');
        $this->xwb->db->where('id', $conversationID);
        $result = $this->xwb->db->update('xwb_conversation', array('status' => 1));
        if ($result) {
            $data['status'] = true;
            $data['message'] = 'Message has been deleted';
        } else {
            $data['status'] = false;
            $data['message'] = 'Error deleting data, please contact the system administrator';
        }

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
    }


    /**
     * Delete all message conversation
     *
     * @return json
     */
    public function deleteAllMessages()
    {
        $user_to = $this->xwb->input->post('user_to');
        $cn_id = $this->xwb->input->post('ci');

        if ($cn_id!="") {
            $this->xwb->db->where('conversation_name_id', $cn_id);
            $this->xwb->db->where('user_id', $this->current_user);
            $result = $this->xwb->db->update('xwb_conversation', array('status' => 1));
        } else {
            $this->xwb->db->where('user_id', $this->current_user);
            $this->xwb->db->where('user_to', $user_to);
            $result = $this->xwb->db->update('xwb_conversation', array('status' => 1));
        }
        
        if ($result) {
            $data['status'] = true;
            $data['message'] = 'All message conversation has been deleted';
        } else {
            $data['status'] = false;
            $data['message'] = 'Error deleting data, please contact the system administrator';
        }

        $data['csrf_key'] = $this->xwb->security->get_csrf_hash();
        echo json_encode($data);
    }

    /**
     * Get the number of unread messages
     *
     * @param  int $cn_id [Conversation Name ID]
     * @param  int $user_id [User ID]
     * @return Object
     */
    
    public function getUnreadCount($user_id, $cn_id = '')
    {
        $this->xwb->db->select('status');
        $this->xwb->db->from('xwb_conversation c');
        if ($cn_id=="") {
            $this->xwb->db->where('c.user_to', $user_id);
        } else {
            $this->xwb->db->where('c.conversation_name_id', $cn_id);
        }

        $this->xwb->db->where('c.user_id', $this->current_user);
        $this->xwb->db->where('c.status', 2);
        $this->xwb->db->where('c.direction', 'IN');
        return $this->xwb->db->get();
    }

    /**
     * Mark Conversation as Read
     *
     * @param  int $user_id [User Name ID]
     * @param  int $cn_id [Conversation Name ID]
     * @return bool
     */
    public function markRead($user_id, $cn_id = '')
    {
        $this->xwb->db->select('c.id');
        $this->xwb->db->from('xwb_conversation c');
        $this->xwb->db->join('xwb_conversation_name cn', 'c.conversation_name_id = cn.id', 'left');
        if ($cn_id=="") {
            $this->xwb->db->where('c.user_to', $user_id);
        } else {
            $this->xwb->db->where('c.conversation_name_id', $cn_id);
            $this->xwb->db->where('c.user_id', $this->current_user);
        }

        $this->xwb->db->where('c.status', 2);
        $this->xwb->db->where('c.direction', 'IN');

        $res = $this->xwb->db->get();
        $conversation_ids = [];
        foreach ($res->result() as $key => $value) {
            $conversation_ids[] = $value->id;
        }
        if ($res->num_rows()>0) {
            $this->xwb->db->where_in('id', $conversation_ids);
            $res = $this->xwb->db->update('xwb_conversation', array('status'=>0));
            return true;
            exit();
        }
        
        return false;
        exit();
    }


    /**
     * Error container
     *
     * @param  string $message [Error Message]
     * @return string
     */
    public function errorContainer($message = '')
    {
        $error = '<div class="alert alert-danger alert-dismissible" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
        </button>
        '.$message.'
        </div>';
        return $error;
    }



    /**
     * Get all session key for the select options data in the console configuration.
     * it will automatically convert multidimentional array into single dimension array
     *
     * @param  [Array] $ciSession [All Sessions]
     * @param  [string] $keyPrefix [If multidimensional, this keyprefix filled by the old key]
     * @return [array]
     */
    public function getSelectSessions($ciSession, $keyPrefix = '')
    {
        foreach ($ciSession as $key => $value) {
            $keyVal = $key;
            if (strlen($keyPrefix)>0) {
                $key = $keyPrefix."[".$key."]";
            } else {
                $key = "[".$key."]";
            }
            
            $this->session_storage[$key] = $keyVal;
            $content = $this->convertData($value);
            if ($content) {
                $this->getSelectSessions($content, $key);
            }
        }

        return $this->session_storage;
    }


    /**
     * Get all sessions from single to multidimentional and convert it to single dimentional.
     * The value of the session given will automatically converted from json, object and serialized array
     *
     * @param  [array] $ciSession [Session]
     * @return [array]
     */
    public function getMultidimensionalSession($ciSession)
    {

        foreach ($ciSession as $key => $value) {
            $content = $this->convertData($value);

            if ($content) {
                $res = $this->getMultidimensionalSession($content);
                $contents[$key] = $res;
            } else {
                $contents[$key] = $value;
            }
        }

        return $contents;
    }


    /**
     * Convert the serialized array, json, and object to array
     *
     * @param  [mixed] $value [Value]
     * @return [array]
     */
    public function convertData($value)
    {
        $unserializeVal = @unserialize($value);
        $content = false;
        if ($unserializeVal !== false) {
            $content = (array)$unserializeVal;
        }
        
        $jsonVal = @json_decode($value);
        if ($jsonVal !== null) {
            if (is_array($jsonVal) || is_object($jsonVal)) {
                $content = $jsonVal;
            }
        }

        if (is_array($value) || is_object($value)) {
            $content = (array)$value;
        }

        return $content;
    }


    /**
     * Get Current user ID
     *
     * @return [Int] [User ID]
     */
    public function getCurrentUser()
    {

        $sess_uid_key = $this->session_user_id_key;

        $start = "[";
        $end = "]";

        $contents = array();
        $ciSession = $this->xwb->session->all_userdata(); // get sessions

        $contents = $this->getMultidimensionalSession($ciSession); // convert value into arrays

        $string = $sess_uid_key;

        /* Search the User ID from the given user ID session key */
        $startDelimiterLength = strlen($start);
        $endDelimiterLength = strlen($end);
        $startFrom = $contentStart = $contentEnd = 0;
        while (false !== ($contentStart = strpos($string, $start, $startFrom))) {
            $contentStart += $startDelimiterLength;
            $contentEnd = strpos($string, $end, $contentStart);
            if (false === $contentEnd) {
                break;
            }
            $key = substr($string, $contentStart, $contentEnd - $contentStart);

            if (array_key_exists($key, $contents)) {
                $contents = $contents[$key];
            }

            $startFrom = $contentEnd + $endDelimiterLength;
        }

        $u_id = (is_array($contents)?0:$contents); //If not found or user is logged out

        return $u_id;
    }
}
