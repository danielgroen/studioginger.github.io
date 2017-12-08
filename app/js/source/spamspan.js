emailE = 'gmail.com'
emailE = ('https://formspree.io/studioginger11' + '@' + emailE);
if ($('.contactform').length > 0 ) {
	$('.contactform').attr('action', emailE);
}

tel1 = 'tel:';
tel2 = '06';
tel3 = '244';
tel4 = '249';
tel5 = '79';

if ($('.tel').length > 0 ) {
	$('.tel').attr('href', tel1 + tel2 + tel3 + tel4 + tel5);
	$('.tel').text( tel2 + '-' + tel3 + ' ' + tel4 + ' ' + tel5);

}