var ready;
ready = function() {

function searchInvoice(){
  var form = $('.search').parents("form"),
      url = form.attr("action");
  // turn on spinner
  showLoader()
  // Submit ajax request
  $.ajax({
    url: url,
    data: form.serialize(),
    type: 'GET',
    dataType: 'script'
  }).done(function( msg ) {
    loadingBox.hide();
  });
};

$('.search').on('keyup change', searchInvoice);

var loadingBox = $('#loadingspinner')

function showLoader() {
  var resultsWrapper = $('#searchresultswrapper');
  var leftPosition = resultsWrapper.offset().left + (resultsWrapper.outerWidth() / 2);

  $('#loadingcircle').css('left', leftPosition);

  loadingBox.show();
}

};

$(document).ready(ready);
$(document).on('page:load', ready);