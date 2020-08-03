export default function() {

  //telephone
  const tel1 = 'tel:',
        tel2 = '06',
        tel3 = '244',
        tel4 = '249',
        tel5 = '79';

  if ($('.tel').length > 0 ) {
    $('.tel').attr('href', tel1 + tel2 + tel3 + tel4 + tel5);
    $('.tel').text( tel2 + '-' + tel3 + ' ' + tel4 + ' ' + tel5);

  }

  // form
  var $contactForm = $('.contactform');

  $contactForm.submit(function(e) {
    $('.load-wrapper').addClass('visible');
    $('.overtake').addClass('visible');

    var name = $("#name").val(),
      subject = $("#subject").val(),
      email = $("#mail").val(),
      message = $("#message").val();

    if ( $('#email').val() ) return false; // honeypot
    let url = window.location.href;

    var sendInfo = {
      Name: name,
      Subject: subject,
      Email: email,
      Message: message
    };
    let mailHandler;
    if (!url.includes('localhost')) {
      mailHandler = 'https://mailhandaler.danielgroen.nl';
    }
    else {
      mailHandler = 'http://mailhandler.test';
    }
    e.preventDefault();
    $.ajax({
      url: mailHandler,
      method: 'POST',
      data: {studioginger: JSON.stringify(sendInfo)},
      dataType: 'json',
      beforeSend: function() {
        $('.load-wrapper').removeClass('visible');
        $('.thankyou').addClass('visible');
        $('.thankyou .send, .overtake').on('click touch', function() {
          location.reload();
        })
      },
      success: function(data) {

      },
      error: function(err) {
        // console.log(sendInfo)
        // $contactForm.find('.alert--loading').hide();
        // $contactForm.append('<div class="alert alert--error">Ops, there was an error.</div>');
      }
    });
  });
}