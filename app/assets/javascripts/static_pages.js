var ready;
ready = function() {
var pageBody = $('body');
var pageHTML = $('html');
var $document = $(document);
var loadingSpinnerHtml = '<div class="loginloadingspinner sessionloading"> <div class="loadingcircle"> <div class="throbber-loader">Loading...</div></div></div>';



if (pageBody.hasClass('homepage')) {

// Ajax login form
$('.loginform').bind('ajax:start', function() {
	beginLoading();
}).bind('ajax:success', function(evt, data, status, xhr) {
  //function called on status: 200 (for ex.)
  //console.log('success');
  setTimeout(function() {
  		pageBody.find('.loginloadingspinner').remove();
  	}, 200);
}).bind("ajax:error", function(evt, xhr, status, error) {
  endLoading();
});

$document.bind('change', function(e) {
	if( $(e.target).is(':invalid') ) {
		removeLoading();
	}
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
	if (sessionOverlay.not(':visible')) {
		setTimeout(function() {
			signInEmail.focus();
		}, 300);
	} 
	showSession();
});

var registerEmail = $('.registeremail');

$('.showregister').on('click', function(e) {
	e.preventDefault();
	if (sessionOverlay.not(':visible')) {
		setTimeout(function() {
			registerEmail.focus();
		}, 300);
	} 
	showSession('register');
});

$('.sessionclose').on('click', hideSession);

$('.loginbutton, .registerbutton').on('click', function() {
	addSessionLoading($(this));
	checkSubpixel();
});

function addSessionLoading(el) {
	var sessionBox = el.parents('.sessionbox');
	var sessionBoxInputs = sessionBox.find('input');
	var isValid = true;
	
	sessionBoxInputs.each(function() {
		var $this = $(this);
		if ($this.is(':invalid')) {
			isValid = false;
		}
	});

	if (isValid) {
		$(loadingSpinnerHtml).insertAfter(sessionBox).fadeIn(500);
	}

}

function beginLoading() {
	var sessionBox = $(this).parents('.sessionbox').filter(':visible');
	$(loadingSpinnerHtml).appendTo(sessionBox).fadeIn(500);
}

function endLoading() {
	if (!sessionOverlay.hasClass('registeropern')) {
		$('.loginbox').filter(':visible').addClass('sessionerror');
	}
  	revertButtonText();
  	removeLoading();
}

function removeLoading() {
	setTimeout(function() {
  		pageBody.find('.loginloadingspinner').remove();
  	}, 200);
}

function checkSubpixel() {
	if (window.innerHeight > 780) {
		$('.sessionbox').each(function() {
			var $this = $(this);
			if ($this.outerHeight() % 2 !== 0) {
				var newPadding = parseInt($this.css('padding-top')) + 1;
				$this.css('padding-top', newPadding);
			}
		});
	}
}

function showSession(option) {

	if (option === "register") {
		sessionOverlay.addClass('registeropen');
	} else {
		sessionOverlay.removeClass('registeropen');
	}

	removeLoading(); 
	sessionOverlay.show();

	checkSubpixel();

	if (!pageBody.hasClass('sessionopen')) {
		if ($document.height() > $(window).height()) {
			var scrollTop = (pageHTML.scrollTop()) ? pageHTML.scrollTop() : pageBody.scrollTop(); // Works for Chrome, Firefox, IE...
			pageHTML.addClass('noscroll').css('top',-scrollTop);         
		}
	}
	
    pageHTML.addClass('noscroll').css('top',-scrollTop); 

	pageHTML.addClass('noscroll');

	pageBody.addClass('sessionopen');
}

function hideSession() {
	sessionOverlay.hide();
	sessionOverlay.removeClass('registeropen');
	
	var scrollTop = parseInt(pageHTML.css('top'));
        pageHTML.removeClass('noscroll');
        $('html,body').scrollTop(-scrollTop);

    pageBody.removeClass('sessionopen');
	signInEmail.blur();
	registerEmail.blur();
}


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