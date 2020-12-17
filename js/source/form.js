export default function () {
  //telephone
  const tel1 = "tel:",
    tel2 = "06",
    tel3 = "244",
    tel4 = "249",
    tel5 = "79";

  if ($(".tel").length > 0) {
    $(".tel").attr("href", tel1 + tel2 + tel3 + tel4 + tel5);
    $(".tel").text(tel2 + "-" + tel3 + " " + tel4 + " " + tel5);
  }

  // form
  var $contactForm = $(".contactform");

  $(".send").on("click", function (e) {
    $(".load-wrapper").addClass("visible");
    $(".overtake").addClass("visible");

    if ($("#email").val()) return false; // honeypot

    const body = {
      name: $("#name").val(),
      subject: $("#subject").val(),
      email: $("#mail").val(),
      honeypot: $("#email").val(),
      message: $("#message").val(),
    };
    let mailHandler;
    if (!window.location.href.includes("localhost")) {
      mailHandler = "https://mailhandler.danielgroen.nl";
    } else {
      mailHandler = "http://mailhandler.test";
    }

    e.preventDefault();
    axios
      .post(mailHandler, { studioginger: body })
      .then((res) => {
        $(".load-wrapper").removeClass("visible");
        $(".thankyou").addClass("visible");
        $(".thankyou .send, .overtake").on("click touch", function () {
          location.reload();
        });
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
        // catch error
      });
  });
}
