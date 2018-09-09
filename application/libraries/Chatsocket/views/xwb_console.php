<?php
defined('BASEPATH') or exit('No direct script access allowed');
?>
<h3>Socketchat Console</h3>
<div class="panel panel-default">
    <div class="panel-heading">
        <h3>Settings</h3>
    </div>
    <div class="panel-body">
        <div class="row">
            <div class="col-md-12">
            <!-- Open Form -->
            <?php
            if (isset($message)) :
                if ($status==false) {
                    $message_type = 'danger';
                } else {
                    $message_type = 'success';
                }
            ?>
                <div class="alert alert-<?php echo $message_type; ?> alert-dismissible" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span>
                    </button>
                    <?php echo $message; ?>
                </div>
            <?php
            endif;
            ?>
            <?php
            $hidden = array(csFormKey() => 'xwb_console');
            echo form_open('', array('class'=>'form-horizontal','id'=>'form-console','name'=>'form-console'), $hidden); ?>
                <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="session_user_id_key">Session user id key: <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <?php
                            echo form_dropdown('session_user_id_key', $session_user_id_keys, array($session_user_id_key), "id='xwb-session-userid' class='form-control'");
                        ?>
                      <span class="text-warning">This is the session key where the user id stored when login</span>
                    </div>
                 </div>

                <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="users_table">Users Table: <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <?php
                            echo form_dropdown('users_table', $tables, array($users_table), "id='xwb-users-table' class='form-control'");
                        ?>
                      <span class="text-warning">Select database users table</span>
                    </div>
                 </div>
                 <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="users_id">Users Unique ID: <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <?php
                        echo form_dropdown('users_id', $users_fields, array($users_id), "id='xwb-users-id' class='form-control'");
                        ?>
                      <span class="text-warning">Select User ID field</span>
                    </div>
                 </div>
                 <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="display_name">Display Name: <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                        <?php
                        echo form_dropdown('display_name', $users_fields, array($display_name), "id='xwb-display-name' class='form-control'");
                        ?>
                      <span class="text-warning">Select display name field</span>
                    </div>
                 </div>

                <div class="row">
                    <div class="panel panel-warning">
                      <div class="panel-heading">Configure if display name come from other table</div>
                      <div class="panel-body">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="table">Table:
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <?php
                                echo form_dropdown(
                                    'users_table_other',
                                    $tables,
                                    array($users_table_other),
                                    "id='xwb-user-table-other' class='form-control'"
                                );
                                ?>
                              <span class="text-warning">Select table</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="user_table_fkey">User ID foreign key: <span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <?php
                                echo form_dropdown(
                                    'user_table_fkey',
                                    $fusers_field,
                                    array($user_table_fkey),
                                    "id='xwb-user-table-fkey' class='form-control'"
                                );
                                ?>
                              <span class="text-warning">Select foreign key field</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="user_table_fdisplayname">Foreign Display name: <span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <?php
                                echo form_dropdown(
                                    'user_table_fdisplayname',
                                    $fusers_field,
                                    array($user_table_fdisplayname),
                                    "id='xwb-user-table-fdisplayname' class='form-control'"
                                );
                                ?>
                              <span class="text-warning">Select foreign display name field</span>
                            </div>
                        </div>
                      </div>
                      <div class="panel-footer">Leave blank if no other table for display name</div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="profile_pic_path">Users: <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                    <div class="input-group">
                        <a href="javascript:;" class="btn btn-info" onClick="selectUsers(this)">Select users</a>
                    </div>
                    <span class="text-warning">Select Users where this chat app to be available</span>
                    </div>
                 </div>
                <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="picture_filename">Picture file name:
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                    <?php
                        echo form_dropdown(
                            'picture_filename',
                            $users_fields,
                            array($picture_filename),
                            "id='xwb-pic-filename' class='form-control'"
                        );
                        ?>
                    <span class="text-warning">Select field where the filename is stored</span>
                    </div>
                 </div>
                 <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="profile_pic_path">Profile Picture Path: 
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                    <div class="input-group">
                        <?php echo form_input('profile_pic_path', $profile_pic_path, "id='profile_pic_path' class='form-control'"); ?>
                        <span class="input-group-btn">
                            <a href="javascript:;" onClick="browsePath(this)" class="btn btn-default" type="button">Browse</a>
                        </span>
                    </div>
                    <span class="text-warning">Leave blank if full path already provided in the picture file name field(This will concatenate before the filename)</span>
                    </div>
                 </div>
                 <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="picture_table">Picture Table (Foreign):
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">

                    <?php
                        echo form_dropdown(
                            'picture_table',
                            $tables,
                            array($picture_table),
                            "id='xwb-picture-table' class='form-control'"
                        );
                    ?>
                    <span class="text-warning">Table name from database for profile picture(leave blank if field is located together in the user table)</span>
                    </div>
                 </div>
                 <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="picture_field">Picture file name(Foreign table): <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                    <?php
                        echo form_dropdown(
                            'picture_field',
                            $picture_fields,
                            array($picture_field),
                            "id='xwb-picture-field' class='form-control'"
                        );
                        ?>
                    <span class="text-warning">Picture file name (from the foreign table)</span>
                    </div>
                 </div>
                 <div class="form-group">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="picture_table_key">User ID(Picture table foreign key): <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12">
                    <?php
                        echo form_dropdown(
                            'picture_table_key',
                            $picture_fields,
                            array($picture_table_key),
                            "id='xwb-pic-table-key' class='form-control'"
                        );
                        ?>
                    <span class="text-warning">Profile Picture Foreign user id key (leave blank if table is the same as user)</span>
                    </div>
                 </div>
                 
                    <?php echo form_close(); ?>
                 <!-- End Form -->
            </div>
        </div>
    </div>
    <div class="panel-footer">
        <a href="javascript:;" class="btn btn-info" onClick="updateConsole()">Update</a>
    </div>
</div>

<script type="text/javascript">

</script>
