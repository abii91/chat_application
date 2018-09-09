<?php if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

/*  Render Page */
if (! function_exists('render_page')) {
    function render_page($view, $data = null, $render = false)
    {
        $CI =& get_instance();
        $data['topnav'] = $CI->load->view('/view_topnav', $data, true);
        $data['leftpane'] = $CI->load->view('/view_leftpane', $data, true);
        $data['body'] = $CI->load->view($view, $data, true);
        $data['footer'] = $CI->load->view('/view_footer', $data, true);
        return $CI->load->view('/view_html', $data, $render);
    }
}


if (! function_exists('pre')) {
    /**
     * Run print_r or vardump php function
     * @param array|string $data
     * @param type|bool $die
     * @param type|string $var_dump
     * @return string
     */
    function pre($data = '', $die = false, $print_r = false)
    {
        echo "<pre>";
        if ($print_r == true) {
            print_r($data);
        } else {
            var_dump($data);
        }
        echo "</pre>";
        if (!$die) {
            die('die()');
        }
    }
}



if (! function_exists('csAddScript')) {
    /**
     * function to add necessary scripts on the head.
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
        <link rel="stylesheet" href="<?php echo base_url('xwb_assets/vendor/mervick/emojionearea/dist/emojionearea.css'); ?>" type="text/css" media="screen" title="prettyPhoto main stylesheet" charset="utf-8" />
        <script src="<?php echo base_url('xwb_assets/vendor/mervick/emojionearea/dist/emojionearea.js'); ?>" type="text/javascript" charset="utf-8"></script>
        
   
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

        <script src="<?php echo base_url('xwb_assets/js/chatsocket.js');?>"></script>

        <?php
    }
}
