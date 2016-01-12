var ready;
ready = function() {


function searchInvoice(){
  var form = $('.search').parents("form"),
      url = form.attr("action");
  // turn on spinner
 //showLoader();
  // Submit ajax request
  $.ajax({
    url: url,
    data: form.serialize(),
    type: 'GET',
    dataType: 'script'
  }).done(function( msg ) {
    seachNoInvoices.hide();
  //  hideLoader();
  }).fail(function(msg){
    showNoInvoices();
  });
};

// Hide the loading box and clear timer

var loadingBox = $('#loadingspinner'), timer, timer2;

function hideLoader() {
  pageBody.addClass('hasfinishedloading');
   clearTimeout(timer);
   clearTimeout(timer2);
    //setTimeout(function() {
      loadingBox.hide();
    //}, 300);
}

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



function showLoader() {
  var resultsWrapper = $('#searchresultswrapper');
  var leftPosition = resultsWrapper.offset().left + (resultsWrapper.outerWidth() / 2);

  $('#loadingcircle').css('left', leftPosition);

   // timer && clearTimeout(timer);
   // timer = setTimeout(function()
   //      {
   //          loadingBox.show();
   //      },
   //  200);
  
}


// Hide the pagination div if there is no need for pagination

function checkPagination() {
  var paginationWrapper = $('#homepagination');
  if ($('.pagination').length) {
    paginationWrapper.show();
  } else {
    paginationWrapper.hide();
  }
}

checkPagination();

// Function to hide the spinner and show no invoices found if the ajax call fails

var seachNoInvoices = $('#searchnoinvoices');

function showNoInvoices() {
  pageBody.addClass('hasfinishedloading');
  hideLoader()
  seachNoInvoices.show();
}

// Scroll the user to the top of the page when they click a pagination link

var pageBody = $('body');

pageBody.on('click', '.pagination a', function() {
  pageBody.removeClass('hasfinishedloading')

 // // timer2 && clearTimeout(timer2);
 // // timer2 = setTimeout(function() {
 //    if (!pageBody.hasClass('hasfinishedloading')) {
 //      showLoader();
 //    }    
 //  }, 300);

  
});


var $loading = loadingBox.hide();
var timeOutHandler;

$(document)
  .ajaxStart(function () {
   timeOutHandler = setTimeout(function(){
    showLoader();
    $loading.show();
  }, 300);
})
.ajaxStop(function () {
   clearTimeout(timeOutHandler);
   setTimeout(function() {
    $loading.hide();
  }, 200);
});


};

$(document).ready(ready);
$(document).on('page:load', ready);