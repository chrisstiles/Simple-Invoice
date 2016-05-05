var ready;
ready = function() {
var pageBody = $('body');
var pageHTML = $('html');
var loadingSpinnerHtml = '<div class="loginloadingspinner sessionloading"> <div class="loadingcircle"> <div class="throbber-loader">Loading...</div></div></div>';

// Ajax login form
$('.loginform').bind('ajax:success', function(evt, data, status, xhr) {
  //function called on status: 200 (for ex.)
  console.log('success');
}).bind("ajax:error", function(evt, xhr, status, error) {
  $('.sessionbox').addClass('sessionerror');
  revertButtonText();
  $('.loginloadingspinner').remove();
});

function revertButtonText() {
	setTimeout(function() {
		var oldContent = $('.buttoncontent').text();
		var button = $('.hasloadingtext');

		if (button.is('input')) {
			button.val(oldContent);
			button.prop('disabled', false);
		} else {
		button.text(oldContent);
		}

		button.removeClass('loading hasloadingtext');
		$('.buttoncontent').empty().remove();
		
	}, 200);
}

var sessionOverlay = $('#sessionoverlay');
var signInEmail = $('#login_user_email');

$('.signinbutton').on('click', function(e) {
	e.preventDefault();
	sessionOverlay.show();
	signInEmail.focus();
	pageHTML.addClass('noscroll');
});

$('.loginbutton').on('click', function() {
	var sessionBox = $(this).parents('.sessionbox');
	$(loadingSpinnerHtml).appendTo(sessionBox).fadeIn(500);
});


if (pageBody.hasClass('homepage')) {

var scrollMin;
var scrollMax;
var heroText = $('#herotext');
var $document = $(document);
var formWrapper = $('#formwrapper');
var $window = $(window);
var scrollElements = $('#mobilesidebarwrapper, #toolbar');
var header = $('header');

var absoluteOffset;

function getScrollMinAndMax() {
	var formWrapperOffset = formWrapper.offset().top;
	scrollMin = formWrapperOffset - header.height();
	scrollMax = formWrapperOffset + formWrapper.outerHeight(true) - $window.height();
}

function getAbsoluteOffset() {
	absoluteOffset = scrollMax - formWrapper.offset().top + parseInt(formWrapper.css('padding-top'));
}

getScrollMinAndMax();
getAbsoluteOffset();

function checkScroll() {
	var scrollAmount = $document.scrollTop();
	if (scrollAmount >= scrollMin && scrollAmount < scrollMax) {
		pageBody.removeClass('nofixed');
		scrollElements.removeAttr('style');
		pageBody.removeClass('hasabsolutes');
		pageBody.addClass('hasfixed');
	} else if (scrollAmount >= scrollMax) {
		getAbsoluteOffset();
		scrollElements.css('top', absoluteOffset);
		pageBody.addClass('hasabsolutes nofixed');
		pageBody.removeClass('hasfixed');
	} else {
		pageBody.addClass('nofixed');
		pageBody.removeClass('hasfixed');
	}
}

checkScroll();

$document.on('scroll', function() {
	checkScroll();
});

$window.on('resize', function() {
	getScrollMinAndMax();
	getAbsoluteOffset();
	checkScroll();
});


}
};

$(document).ready(ready);
$(document).on('page:load', ready);