jQuery(document).ready(function($) {

	$('.navigate').on('click', function(event) {
		event.preventDefault();
		
		var $target = $($(this).attr('href'));
		scrollTo($target);

	});

	// forms

	$('.hnypt').remove();

	$('form').on('submit', function(event) {
		event.preventDefault();
		
		var data = $(this).serialize();
		var $rqrd = $('.rqrd',this);

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
			$.post('process.php',data, function(data, textStatus, xhr) {
				console.log(data);
			});
		};

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