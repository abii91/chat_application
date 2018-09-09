<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Profile extends CI_Controller
{



    public function __construct()
    {
        parent::__construct();
        $this->load->library(array('ion_auth','form_validation'));
    }

    /**
     * View Profile
     *
     * @return mixed
     */
    public function index()
    {


        if (!$this->ion_auth->logged_in()) {
            // redirect them to the login page
            redirect('users/auth/login', 'refresh');
        } else {
            // set the flash data error message if there is one
            $this->data['message'] = (validation_errors()) ? validation_errors() : $this->session->flashdata('message');

            $user = $this->ion_auth->user()->row();
            
            $data['current_user'] = $user;

            $profile_pic = $this->db->get_where('profile_pic', array('user_id' => $user->user_id))->row();

            if (is_null($profile_pic)) {
                $profile_pic = '';
            } else {
                $profile_pic = $profile_pic->picture_path;
            }

            $data['image_path'] = 'welcome/viewimage/?width=150&height=150&path='.$profile_pic;
            $data['profile_pic'] = $profile_pic;
            $data['csrf_key']   = $this->security->get_csrf_hash();
            $data['csrf_name']  = $this->security->get_csrf_token_name();
            render_page('view_profile', $data);
        }
    }


    /**
     * Update profile
     *
     * @return void
     */
    public function updateProfile()
    {
        $this->form_validation->set_rules('first_name', 'First Name', 'required');
        $this->form_validation->set_rules('last_name', 'Last Name', 'required');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('phone', 'Phone', 'required');
        $upload_path = 'profile_image/';

        if (!is_dir($upload_path)) {
            mkdir($upload_path, 0777, true);
        }

        if ($this->form_validation->run() == false) {
            $data['status'] = false;
            $data['message'] = validation_errors();
            $this->session->set_flashdata('errors', validation_errors());
            redirect('profile');
        } else {
            $user_id = $this->session->userdata('user_id');

            if ($_FILES['profile_pic']['size'] != 0) {
                $config['upload_path']          = $upload_path;
                $config['allowed_types']        = 'gif|jpg|png';
                $config['max_size']             = 10000;
                $config['max_width']            = 2000;
                $config['max_height']           = 2000;

                $this->load->library('upload', $config);

                if (! $this->upload->do_upload('profile_pic')) {
                    $error = array('error' => $this->upload->display_errors());
                    $data['status'] = false;
                    $data['message'] = $error['error'];
                    $this->session->set_flashdata('errors', $this->upload->display_errors());
                    redirect('profile');
                } else {
                    $data = array('upload_data' => $this->upload->data());
                    $db_data = array(
                            'picture_path' => $data['upload_data']['full_path'],
                            'user_id'   => $user_id,
                            'mime' => $data['upload_data']['file_type']
                        );
                    $this->db->where('user_id', $user_id);
                    $profile_pic = $this->db->get('profile_pic');
                    if ($profile_pic->num_rows() > 0) {
                        $this->db->where('user_id', $user_id);
                        $this->db->update('profile_pic', $db_data);
                    } else {
                        $this->db->insert('profile_pic', $db_data);
                    }
                }
            }

            $posts = $this->input->post();
            
            
            $db_data = array(
                    'first_name' => $posts['first_name'],
                    'last_name' => $posts['last_name'],
                    'email' => $posts['email'],
                    'phone' => $posts['phone']
                );
            $this->db->where('id', $user_id);
            $this->db->update('users', $db_data);
            $this->session->set_flashdata('success', "Profile has been successfully updated");
            redirect('profile');
        }
    }
}
