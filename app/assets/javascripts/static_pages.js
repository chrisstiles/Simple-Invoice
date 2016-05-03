var ready;
ready = function() {
var pageBody = $('body');
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