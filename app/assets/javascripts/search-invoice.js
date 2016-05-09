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
    //searchNoInvoices.hide();
    $('.loadingspinner').hide();
  }).fail(function(msg){
    //showNoInvoices();
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

//setup before functions
// var typingTimer;               //timer identifier
// var doneTypingInterval = 80;  //time in ms, 5 second for example
// var $input = $('#myInput');

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

var searchBoxes = $('.search');

pageBody.on('keyup', '.search', function(e) {

  pageBody.addClass('loadingsearchresults');

  var keyCode = e.which;

  if (keycodes.indexOf(keyCode) > -1 && keyCode != 91) {
   delay(function(){
      searchInvoice();
    }, 80 );
  } 
});


pageBody.on('change', '.searchchange, .search', function() {
  if (!$(this).hasClass('client_name_search')) {
    searchInvoice();
  }
});

// iOS does not select custom checkboxes, so we have to check to manually ensure that the value changes on click

$('.checkboxholder label').on('click', function(e) {
  e.preventDefault();
  var checkBox = $(this).prevAll(':checkbox');
  var isChecked = checkBox.is(':checked');
  
  checkBox.trigger('click');

  var isCheckedAfterClick = checkBox.is(':checked');

  // If the value after the triggered click matches the value after, manually switch
  if (isChecked === isCheckedAfterClick) {
    if (isChecked) {
      checkBox.prop('checked', false);
    } else {
      checkBox.prop('checked', true);
    }
  }  

});

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
 
  if (resultsWrapper.length) {
    var leftPosition = resultsWrapper.offset().left + (resultsWrapper.outerWidth() / 2);
  }

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

var searchNoInvoices = $('#searchnoinvoices');

function showNoInvoices() {
  pageBody.addClass('hasfinishedloading');
  hideLoader()
  searchNoInvoices.show();
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

function checkPaginationLength() {
  var pagination = $('.pagination');
  if (pagination.length) {
    var paginationOffset = pagination.offset().left
  }
  var windowWidth = $(window).width();

  var paginationWidth = 0;

  $('.pagination > *').each(function() {
     paginationWidth += parseInt($(this).outerWidth(), 10);
  });

  var paginationLinks = $('.pagination > *').filter(':not(.previous_page, .next_page)');

  if ((paginationWidth + paginationOffset) > (windowWidth - paginationOffset)) {
    paginationLinks.hide();
  } else {
    paginationLinks.show();
  }

}

checkPaginationLength();

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
  checkPaginationLength();
    pageBody.removeClass('loadingsearchresults');
   clearTimeout(timeOutHandler);
   setTimeout(function() {
    $('.loadingspinner').hide();
  }, 200);

   $('form').removeAttr('disabled');

});


};

$(document).ready(ready);
$(document).on('page:load', ready);