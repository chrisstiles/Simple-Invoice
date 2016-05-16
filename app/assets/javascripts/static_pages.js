var ready;
ready = function() {
var pageBody = $('body');
var pageHTML = $('html');
var $document = $(document);
var $window = $(window);
var loadingSpinnerHtml = '<div class="loginloadingspinner sessionloading"> <div class="loadingcircle"> <div class="throbber-loader">Loading...</div></div></div>';
var datePicker = $('#ui-datepicker-div');
var dateField = $('.datefield');
var dateFieldParent = dateField.parents('.control');
var dueDateField = $('.duedatefield');
var dueDateFieldParent = dueDateField.parents('.control');

var willChangePosition = true;

function checkScreenHeight() {
	if (window.innerHeight <= 850) {
		willChangePosition = true;
	} else {
		willChangePosition = false;
	}
}

checkScreenHeight();

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

var staticWrapper = $('.staticwrapper');

function startStaticLoading() {
	var staticInputs = staticWrapper.find('input');
	var isValid = true;
	
	staticInputs.each(function() {
		var $this = $(this);
		if ($this.is(':invalid')) {
			isValid = false;
		}
	});

	if (isValid) {
		$(loadingSpinnerHtml).appendTo('.staticwrapper').fadeIn(500);
	}
	
}

function endStaticLoading() {
	if ($('.loginform').length) {
		$('#pagewrapper').addClass('sessionerror');
	}
  	revertButtonText();
  	removeLoading();
}

function removeLoading() {
	setTimeout(function() {
  		pageBody.find('.loginloadingspinner').remove();
  	}, 200);
}

$document.bind('change', function(e) {
	if( $(e.target).is(':invalid') ) {
		removeLoading();
	}
});

$('.staticloading').on('click', function() {
	startStaticLoading();
});

// Ajax login form
$('.loginform').bind('ajax:start', function() {
	if (staticWrapper.length) {
		startStaticLoading();
	} else {
		beginLoading();
	}
}).bind('ajax:success', function(evt, data, status, xhr) {
  //function called on status: 200 (for ex.)
  //console.log('success');
  setTimeout(function() {
  		pageBody.find('.loginloadingspinner').remove();
  	}, 200);
}).bind("ajax:error", function(evt, xhr, status, error) {
	if (staticWrapper.length) {
		endStaticLoading();
	} else {
		endLoading();
	}
});

if (pageBody.hasClass('homepage')) {

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

$('.sessionhome').on('click', function(e) {
	if (sessionOverlay.is(':visible')) {
		e.preventDefault();
		hideSession();
	}
});

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
	if (sessionOverlay.length && !sessionOverlay.hasClass('registeropern')) {
		$('.loginbox').filter(':visible').addClass('sessionerror');
	} 
  	revertButtonText();
  	removeLoading();
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
	if (!willChangePosition) {
		absoluteOffset = 0;
	}
}

getScrollMinAndMax();
getAbsoluteOffset();

function checkScroll() {
	var scrollAmount = $document.scrollTop();
	if (willChangePosition) {
		if (scrollAmount >= scrollMin && scrollAmount < scrollMax) {
			pageBody.removeClass('nofixed');
			scrollElements.removeAttr('style');
			pageBody.removeClass('hasabsolutes');
			checkDatePicker(true);
			pageBody.addClass('hasfixed');
		} else if (scrollAmount >= scrollMax) {
			getAbsoluteOffset();
			scrollElements.css('top', absoluteOffset);
			checkDatePicker(false);
			pageBody.addClass('hasabsolutes nofixed');
			pageBody.removeClass('hasfixed');
		} else {
			checkDatePicker(false);
			pageBody.addClass('nofixed');
			pageBody.removeClass('hasfixed');
			pageBody.removeClass('hasabsolutes');
			scrollElements.removeAttr('style');
		}
	} else {
		getAbsoluteOffset();
		scrollElements.css('top', absoluteOffset);
		checkDatePicker(false);
		pageBody.addClass('hasabsolutes nofixed');
		pageBody.removeClass('hasfixed');

	}
	
}

checkScroll();

var dateFieldActive = true;

dateField.on("focus", function(e) {
	dateFieldActive = true;
});

dueDateField.on("focus", function(e) {
	dateFieldActive = false;
});

function checkDatePicker(goingToFixed) {
	if (datePicker.is(':visible')) {

		if (goingToFixed) {
			var datePickerOffset;
			if (dateFieldActive) {
				datePickerOffset = dateFieldParent.position().top + dateFieldParent.outerHeight() + 65;
				datePicker.css({
					'position' : 'fixed',
					'top' : datePickerOffset
				});
			} else if (!dateFieldActive) {
				datePickerOffset = dueDateFieldParent.position().top + dueDateFieldParent.outerHeight() + 65;
				datePicker.css({
					'position' : 'fixed',
					'top' : datePickerOffset
				});
			} else {
				//datePicker.hide();
			}
		} else {
			var datePickerOffset;
			if (dateFieldActive) {
				datePickerOffset = dateFieldParent.offset().top + dateFieldParent.outerHeight() + 2;
				datePicker.css({
					'position' : 'fixed',
					'top' : datePickerOffset
				});
			} else if (!dateFieldActive) {
				datePickerOffset = dueDateFieldParent.offset().top + dueDateFieldParent.outerHeight() + 2;
				datePicker.css({
					'position' : 'fixed',
					'top' : datePickerOffset
				});
			} else {
				//datePicker.hide();
			}
		}

	}
}

$document.on('scroll', function() {
	checkScroll();
});

$window.on('resize', function() {
	checkScreenHeight();
	getScrollMinAndMax();
	getAbsoluteOffset();
	checkScroll();
});



}
};

$(document).ready(ready);
$(document).on('page:load', ready);