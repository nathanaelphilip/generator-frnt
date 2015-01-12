jQuery(document).ready(function($) {

	$('.navigate').on('click', function(event) {
		event.preventDefault();
		
		var $target = $($(this).attr('href'));
		scrollTo($target);

	});
	

	// helpers

	function scrollTo($element){
		$('html, body').animate({scrollTop: $element.offset().top}, 500);
	}

});