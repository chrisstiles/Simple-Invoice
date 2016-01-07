var ready;
ready = function() {


function searchInvoice(){
  var form = $('.search').parents("form"),
      url = form.attr("action");
  // turn on spinner
 showLoader();
  // Submit ajax request
  $.ajax({
    url: url,
    data: form.serialize(),
    type: 'GET',
    dataType: 'script'
  }).done(function( msg ) {
    clearTimeout(timer);
    setTimeout(function() {
      loadingBox.hide();
    }, 300)
  });
};

var keycodes = [8,13,32,189,186,190,191,222]

for (var i = 46; i < 105; i++) {
  keycodes.push(i);
}

var searchBoxes = $('.search');

searchBoxes.on('keyup', function(e){
  var keyCode = e.which;

  if (keycodes.indexOf(keyCode) > -1 && keyCode != 91) {
    searchInvoice();
  }

});

searchBoxes.on('change', searchInvoice);

var loadingBox = $('#loadingspinner'), timer;

function showLoader() {
  var resultsWrapper = $('#searchresultswrapper');
  var leftPosition = resultsWrapper.offset().left + (resultsWrapper.outerWidth() / 2);

  $('#loadingcircle').css('left', leftPosition);

  timer && clearTimeout(timer);
   timer = setTimeout(function()
        {
            loadingBox.show();
        },
        200);
  
}


};

$(document).ready(ready);
$(document).on('page:load', ready);