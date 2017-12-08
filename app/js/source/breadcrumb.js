if ( $('.main-menu .active').length > 0 ) {
	var currentIndex = $('.main-menu .active').index();
	$('.breadcrumb .current').text( $('.main-menu .active a').text());

	
	if ( currentIndex == 0) {
		$('.breadcrumb .previous').addClass('transparent');
	}
	else if (currentIndex == 3 ) {
		$('.breadcrumb .next').addClass('transparent');
	}

	$('.breadcrumb .previous').attr( 'href', $('.main-menu .active').prev().find('a').text().toLowerCase());
	$('.breadcrumb .previous .text').text( $('.main-menu .active').prev().find('a').text());
	
	$('.breadcrumb .next').attr( 'href', $('.main-menu .active').next().find('a').text().toLowerCase());
	$('.breadcrumb .next .text').text( $('.main-menu .active').next().find('a').text());

	
}