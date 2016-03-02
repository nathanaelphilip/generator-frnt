<?php

	# require_once 'vendor/autoload.php';

    # Wordpress

    if (function_exists('add_action')) {

        define('TMPLT',get_bloginfo('template_directory'));
        define('TMPLTD',get_template_directory());

        add_filter('show_admin_bar', '__return_false');

        add_action('after_setup_theme','prefix_setup_theme');

        function prefix_setup_theme()
        {
            add_theme_support('post-thumbnails');
            add_theme_support('title-tag');
        }

        add_action('wp_enqueue_scripts','prefix_enqueue_scripts');

        function prefix_enqueue_scripts()
        {

            # deenqueue
            wp_deregister_script('jquery');

            # register
            wp_register_script('jquery', '//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js', false, '2.2.1', true);
            wp_register_script('slick', '//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.5.9/slick.min.js', ['jquery'], '1.5.9', true);
            wp_register_script('app', TMPLT.'/assets/js/app.min.js', ['jquery','gmaps','slick','waypoints'], false, true);

            # enqueue
            wp_enqueue_script('app');

            # localize
            wp_localize_script('app','PREFIX',['ajax' => admin_url('admin-ajax.php')]);

        }

    }

    # ACF

    if (function_exists('acf_add_options_page')) {
        acf_add_options_page('PREFIX Options');
    }


	# MailChimp

	function prefix_mailchimp_initiate(){
		return new \Drewm\MailChimp();
	}

	function prefix_mailchimp_process($data){

		$MailChimp = schs_mailchimp_initiate();

		$result = $MailChimp->call('lists/subscribe', array(
					'id'                => '',
					'email'             => array('email'=>$data['EMAIL']),
					'merge_vars'        => array(),
					'double_optin'      => false,
					'update_existing'   => true,
					'replace_interests' => false,
					'send_welcome'      => false
				));


		return $result;

	}

	# Instagram

	function prefix_instagram(){

		$instagram = new Andreyco\Instagram\Client('c95bb5db73c64f55b7cee8430926ecfe');
		$data = $instagram->getUserMedia('instagramid',5);

		return $data->data;

    }

	# Forms (Generic)

	function prefix_check_required_fields($data)
	{

		$errors = array();
		$requirements = explode(',', $_POST['required']);

		foreach ($requirements as $value) {
			if ($data[$value] === '') {
				$errors[$value] = 'This field is required';
			}
		}

		return $errors;

	}

	function prefix_process_form($to)
	{

		$data = $_POST['data'];

		$errors = prefix_check_required_fields($data);

		if (empty($errors)) {

			$subject = 'From the Tides IV';

			$headers = "From: " . strip_tags($data['email']) . "\r\n";
			$headers .= "Reply-To: ". strip_tags($data['email']) . "\r\n";
			$headers .= "MIME-Version: 1.0\r\n";
			$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

			$message = '';

			foreach ($data as $key => $value) {
				$message .= str_replace('_', ' ', $key).': '.$value.'</br>';
			}

			if (wp_mail($to, $subject, $message, $headers)) {
				return array('status' => 'success', 'message' => 'Thank you for your submission!');
			}

		}

		return array('status' => 'failed', 'message' => 'The form was unable to process. Please fix any errors and try again.','errors' => $errors);

	}


	// helper
