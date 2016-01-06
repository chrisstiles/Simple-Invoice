var ready;
ready = function() {

function searchInvoice(){
  var form = $('.search').parents("form"),
      url = form.attr("action");
  // turn on spinner
 // $('.filterrific_spinner').show();
  // Submit ajax request
  $.ajax({
    url: url,
    data: form.serialize(),
    type: 'GET',
    dataType: 'script'
  }).done(function( msg ) {
    //$('.filterrific_spinner').hide();
  });
};

$('.search').on('keyup', searchInvoice);

};

$(document).ready(ready);
$(document).on('page:load', ready);