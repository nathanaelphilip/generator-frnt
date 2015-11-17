'use strict';

if (jsframework === 'backbone') {
    // for future
}else{

    jQuery(document).ready(function($) {

    	$('.navigate').on('click', function(event) {
    		event.preventDefault();

    		var $target = $($(this).attr('href'));
    		scrollTo($target);

    	});

    	// forms

    	$('.hnypt').remove();

    	$('form').on('submit', function(event) {

    		var data = $(this).serialize();
    		var $rqrd = $('.rqrd',this);
    		var $submit = $('.submit',this);

    		$submit.attr('disabled','disabled');

    		$rqrd.each(function(index, el) {

    			var $t = $(this);

    			if ($t.val() === '') {
    				$t.addClass('error');
    			}else{
    				$t.removeClass('error');
    			}

    			if ($t.attr('type') === 'email') {
    				if ( !validateEmail($t.val()) ) {
    					$t.addClass('error');
    				}else{
    					$t.removeClass('error');
    				}
    			};

    		});

    		if ( $('.error.rqrd',this).length === 0 ) {
    			return true;
    		};

    		$submit.removeAttr('disabled');

    		return false;

    	});


    	// helpers

    	function scrollTo($element){
    		$('html, body').animate({scrollTop: $element.offset().top}, 500);
    	}

    	function validateEmail(email) {
    	    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    	    return re.test(email);
    	}

    });


}
