var ready;
ready = function() {

var pageBody = $('body');

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
    dataType: 'script',
  }).done(function( msg ) {
    seachNoInvoices.hide();
  //  hideLoader();
  }).fail(function(msg){
    showNoInvoices();
  });
};

// Hide the loading box and clear timer

var timer, timer2;

function hideLoader() {
  pageBody.addClass('hasfinishedloading');
   clearTimeout(timer);
   clearTimeout(timer2);
    //setTimeout(function() {
    $('.loadingspinner').hide();
    //}, 300);
}

var keycodes = [8,13,32,189,186,190,191,222]

for (var i = 46; i < 105; i++) {
  keycodes.push(i);
}

var searchBoxes = $('.search');

pageBody.on('keyup', '.search', function(e) {
  pageBody.addClass('loadingsearchresults');

  var keyCode = e.which;

  if (keycodes.indexOf(keyCode) > -1 && keyCode != 91) {
    searchInvoice();
  }

});

pageBody.on('change', '.searchchange', searchInvoice);

var $loading;

function showLoader() {

if (!$('html').hasClass('noscroll')) {
  if (pageBody.hasClass('loadingclientform')) {
     var resultsWrapper = $('.clientsformwrapper');
     var loadingBox = $('.clientsformwrapper .loadingspinner');
  } else {
     var resultsWrapper = $('#searchresultswrapper');
     var loadingBox = $('.loadingspinner').first();
  }
 
  var leftPosition = resultsWrapper.offset().left + (resultsWrapper.outerWidth() / 2);

  $('.loadingcircle').css('left', leftPosition);

  $loading = loadingBox.hide();
  $loading.show();

  //return $loading

   // timer && clearTimeout(timer);
   // timer = setTimeout(function()
   //      {
   //          loadingBox.show();
   //      },
   //  200);
}
  
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

pageBody.on('click', '.pagination a', function() {
  pageBody.removeClass('hasfinishedloading')

 // // timer2 && clearTimeout(timer2);
 // // timer2 = setTimeout(function() {
 //    if (!pageBody.hasClass('hasfinishedloading')) {
 //      showLoader();
 //    }    
 //  }, 300);

  
});

var timeOutHandler;
var $loading;

$(document)
  .ajaxStart(function () {
    if(!pageBody.hasClass('homerecordclicked') && !$('html').hasClass('noscroll')) {
      timeOutHandler = setTimeout(function(){
        showLoader();
      }, 300);
    }
})
.ajaxStop(function () {
    pageBody.removeClass('loadingsearchresults');
   clearTimeout(timeOutHandler);
   setTimeout(function() {
    $('.loadingspinner').hide();
  }, 200);
});


};

$(document).ready(ready);
$(document).on('page:load', ready);