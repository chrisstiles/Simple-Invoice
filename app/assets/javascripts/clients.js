var ready;
ready = function() {

var pageBody = $('body');
var pageWrapper = $('#pagewrapper');
var $window = $(window);
var $document = $(document);

var footer = $('footer:visible');
var isClientsPage = pageWrapper.hasClass('clientspage');
var homeSide = $('#homeside');
var isHomePage = false;

var clientFilter = $('#clientfiltering');
var clientContainer = $('#clientscontainer');
var clientSearch = $('#clientsearch');
var clientsSidebar = $('#clientssidebar');

if (homeSide.length) {
	isHomePage = true;
}

var mobileFooter = false;

function checkMobileFooter() {
	if ($window.width() > 1020) {
		mobileFooter = false;
	} else {
		mobileFooter = true;
	}
}

checkMobileFooter();

function getScrollBarWidth() {
	var inner = document.createElement('p');
	inner.style.width = "100%";
	inner.style.height = "200px";

	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild (inner);

	document.body.appendChild (outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = inner.offsetWidth;
	if (w1 == w2) w2 = outer.clientWidth;

	document.body.removeChild (outer);

	return (w1 - w2);
};

var scrollBarWidth = getScrollBarWidth();

function getWindowOffset(el) {
	return (el.offset().top - $window.scrollTop());
}

var containerWidth = clientContainer.outerWidth();
var clientContainerPosition = clientContainer.offset();

function setClientVariables() {
	containerWidth = clientContainer.outerWidth();
	clientContainerPosition = clientContainer.offset();
}

function checkFooterInView() {
	if (footer.length) {
		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height();

		var elemTop = footer.offset().top;
		var elemBottom = elemTop;

		var isVisible = (elemBottom <= docViewBottom) && (elemTop >= docViewTop);

		var offsetVal = getVisibleFooterHeight() + 145;

		if (mobileFooter) {
			offsetVal += 50;
		}

		fixedElement = clientsSidebar;

		if (isHomePage) {
			offsetVal -= 50;
			fixedElement = homeSide;
		}

		var footerOffset = getWindowOffset(footer);

		var fixedElementBottomOffset, fixedWidth;

		if (fixedElement.length) {
			fixedElementBottomOffset = fixedElement.offset().top + fixedElement.outerHeight();
		} else {
			fixedElementBottomOffset = 0;
		}

		if ((isVisible && footerOffset <= fixedElementBottomOffset + 45) || fixedElementBottomOffset >= $window.height()) {

			if (clientsSidebar.length) {
				fixedElement.css({
					'max-height' : 'calc(100vh - ' + offsetVal + 'px)',
					'overflow-y' : 'scroll',
					'padding-right' : 35 - scrollBarWidth
				});

			} else {
				fixedElement.css({
					'max-height' : 'calc(100vh - ' + offsetVal + 'px)',
					'overflow-y' : 'scroll'
				});
			}
	
			
		} else {
			fixedElement.scrollTop(0);
			if (isHomePage) {
				fixedElement.css({
					'max-height' : 'none',
					'overflow-y' : 'visible',
					'width' : 270,
					'margin-right' : 0
				});
			} else {
				fixedElement.css({
					'max-height' : 'none',
					'overflow-y' : 'visible',
					'padding-right' : 35
				});
			}
		
		}
	}
}

function getVisibleFooterHeight() {
	var elH = footer.outerHeight(),
        H   = $window.height(),
        r   = footer[0].getBoundingClientRect(), t=r.top, b=r.bottom;
    return Math.max(0, t>0? Math.min(elH, H-t) : (b<H?b:H));
}

checkFooterInView();

$document.on('scroll', function() {
	checkFooterInView();
});

$document.ajaxComplete(checkFooterInView);

$window.resize(function() {
	footer = $('footer:visible');
	checkMobileFooter();
	checkFooterInView();
});

if (isClientsPage) {

// All client page only code goes here

// Set position and width of pagination and search wrapper

function setClientFilter() {
	setClientVariables();

	clientSearch.css({
		'left': clientContainerPosition.left,
		'width': containerWidth
	});

	clientsSidebar.css({
		'left': clientContainerPosition.left + containerWidth - 1,
		'width': containerWidth
	});

	pageWrapper.css('margin-top', clientSearch.outerHeight());

}

setClientFilter();

$window.resize(function() {
	setClientFilter();
})


function showMobileClientsForm() {
	pageBody.addClass('clientsformopen');
}

function hideMobileClientsForm() {
	pageBody.removeClass('clientsformopen');
	//$('.selected').removeClass('selected');
}

// Add selected class and perform ajax request for edit form
pageWrapper.on('click', '.client', function() {

	var $this = $(this);
	var id = $this.attr('data-id');
	if (!$this.hasClass('selected') || $window.width() <= 885) {
		
		if (!$this.hasClass('selected')) {
			pageBody.addClass('loadingclientform');
			getClient(id);
		}

		$('.selected').removeClass('selected');
		$this.addClass('selected');

		showMobileClientsForm();

	}
});

$('.mobilenewclient').on('click', function(e) {
	$('.selected').removeClass('selected');
	showMobileClientsForm();
	currentSelected = "";
});

pageBody.on('click', '.clientsback', function(e) {
	e.preventDefault();
	hideMobileClientsForm();
});

function getClient(id) {
    $.ajax({
        type: 'GET',
        url: '/clients/' + id + '/edit',
        dataType: 'script',
        async: true
        }).done(function( msg ) {
        	pageBody.removeClass('loadingclientform');
	    //console.log(msg)
	  //  hideLoader();
	  }).fail(function(msg){
	    console.log(msg)
	  });
}


// Get html for new form and render it when the new form button is pressed.

var newFormHtml = $('#clientssidebar').html();

pageBody.on('click', '.newclientbutton', function(e) {
	e.preventDefault();
	pageBody.find('#clientssidebar').html(newFormHtml);
	$('.selected').removeClass('selected');
});

// Change the client name in title form as user types
pageBody.on('keyup', '#client_name', function() {
	var text = $(this).val();
	$('.clientnameheading').text(text);
});


// Ajax call to delete client when button is pressed
pageBody.on('click', '.deleteclient', function() {
	var clientId = $(this).attr('data-clientid');
	var confirmation = confirm('Are you sure you would like to delete this client?')

	if(confirmation) {
	    $.ajax({
	        type: 'delete',
	        url: '/clients/' + clientId,
	        dataType: 'script',
	        async: true
	        }).done(function( msg ) {
	        	pageBody.find('#clientssidebar').html(newFormHtml);
		  	}).fail(function(msg){
		   	 //console.log(msg)
		  });
	}

});

}

};

$(document).ready(ready);
$(document).on('page:load', ready);