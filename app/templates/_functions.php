<?php 

	# require_once 'vendor/autoload.php';


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

	