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