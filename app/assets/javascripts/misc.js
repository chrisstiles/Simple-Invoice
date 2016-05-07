Turbolinks.enableProgressBar();

var ready;
ready = function() {

var $document = $(document);

// Fastclick
$(function() {
  return new FastClick(document.body);
});

// Cookie user's timezone
function set_time_zone_offset() {
    var current_time = new Date();
    $.cookie('time_zone', current_time.getTimezoneOffset());
}

set_time_zone_offset();

var pageBody = $('body');

// Prevent double submitting form

pageBody.on('submit', 'form', function(e) {
	var $this = $(this);
	if ($this.attr('data-remote') == "true") {
		if ($this.attr('disabled') === 'disabled') {
			e.preventDefault();
			return false
		} else {
			$this.attr('disabled', 'disabled');
		}
	}
});

// Show loading animation after user clicks generate PDF, while the PDF loads (on index page)

var homeInvoiceLoading = false;

pageBody.on('click', '.thirdbutton.file', function(e) {
	var $this = $(this);
	if (!invoiceLoading) {
		invoiceLoading = true;
		e.preventDefault();
		var url = $(this).attr('href');
		$this.siblings('.homeinvoiceloader').fadeIn(200, function() {
			window.location.href = url;
		});
	} else {
		e.preventDefault();
	}
	
});

// Remove success modal when close is clicked
pageBody.on('click', '.closesuccess', function() {
	$(this).parent('.success').remove();
});

pageBody.on('click', '.homerecordpayment', function() {
	pageBody.addClass('homerecordclicked');
});

// Specifically allow enter key to submit form from certian input fields

pageBody.on('keyup', '.e-amountpaid, #user_setting_attributes_base_invoice_number, #user_setting_attributes_tax', function(e) {
	if(e.which == 13) {
	   $(this).parents('form').submit();
	}
});

// Don't submit form when user presses enter from text field in sidebar

pageBody.on('keydown', '#sidebar input', function(e) {
	if(e.which == 13) {
	   e.preventDefault();
	   return false
	}
});

// Remove error class when input changes
var compareVal;

pageBody.on('keydown', '.haserror', function() {
	var $this = $(this);
	if ($this.is(':input')) {
		compareVal = $this.val();
	} else {
		compareVal = $this.text();
	}
	
});

pageBody.on('keyup', '.haserror', function() {
	var $this = $(this);

	if ($this.is(':input')) {
		var newVal = $this.val();
	} else {
		var newVal = $this.text();
	}

	if (compareVal != newVal) {
		$this.removeClass('haserror');
	}

	$this.parents('.selectize-input').removeClass('haserror');

});

var clientName = $('#e-clientname');

pageBody.on('keydown', '#invoice_client_name', function() {
	if (clientName.hasClass('haserror')) {
		compareVal = $(this).val();
	}
});

pageBody.on('keyup', '#invoice_client_name', function() {
	if (clientName.hasClass('haserror')) {
		var newVal = $(this).val();

		if (compareVal != newVal) {
			clientName.removeClass('haserror');
		}

	}
});

// Close validation errors on close button
pageBody.on('click', '.closeerrors', function() {
	var $this = $(this);
	var parentEl;
	if ($this.parents('#validationerrors').length) {
		parentEl = $this.parents('#validationerrors');
	} else {
		parentEl = $this.parents('#modalvalidationerrors');
		parentEl.parents('#modalcontent').scrollTop(0);
	}
	
	parentEl.removeAttr('style').removeClass('hastransformed').hide();
	if (!pageBody.hasClass('show')) {
		$('#invoicewrapper').removeAttr('style');

		if (parentEl.hasClass('logovalidation')) {
			$('.logoformholder').removeAttr('style');
		} else {
			$('.formholder').removeAttr('style');
		}
		
	}
});

// Ajax call to delete invoice when button is pressed
pageBody.on('click', '.deleteinvoice', function() {
	var invoiceNumber = $(this).attr('data-invoicenumber');
	var confirmation = confirm('Are you sure you would like to delete this invoice?')

	if(confirmation) {
	    $.ajax({
	        type: 'delete',
	        url: '/invoices/' + invoiceNumber,
	        dataType: 'script',
	        async: true
	        }).done(function( msg ) {

		  	}).fail(function(msg){
		   	 console.log(msg)
		  });
	}

});

// Set position of home page sidebar
var homePageWrapper = $('#pagewrapper');
var homeSide = $('#homeside');

function setSidebarPosition() {
	
	var leftPosition = homePageWrapper.offset().left + homePageWrapper.outerWidth();
	$('#homeside').css('left', leftPosition);

}

if (homePageWrapper.length) {
	setSidebarPosition();
}

// Set position of pagination if it exists
var searchResults = $('#searchresults');

function setHomePagination() {
	var pagination = $('#homepagination');
	var homeInvoice = $('.homeinvoice');
	if (homeInvoice.length) {
		var leftPosition = homeInvoice.first().offset().left - 100;
		
		var rightPosition = $(window).width() - $('#homeside').offset().left;

		pagination.css({
			'left' : leftPosition,
			'right' : rightPosition
		});

		
		if ($('.pagination').length) {
			pagination.show();
			searchResults.addClass('haspagination');
		} else {
			searchResults.removeClass('haspagination');
			pagination.hide();
		}

	}
}

if (homePageWrapper.length) {
	setHomePagination();
}


// Show home page amount paid form

pageBody.on('click', '.pig', function(e) {
	e.preventDefault();
	var $this = $(this);
	$this.siblings('.homeinvoiceinfowrapper').children().addClass('active');
	$this.addClass('homeclose');
	$this.find('span').text('Cancel Recording Payment');
});

pageBody.on('click', '.homeclose', function(e) {
	var $this = $(this);
	$this.removeClass('homeclose');
	$this.siblings('.homeinvoiceinfowrapper').children().removeClass('active');
	$this.find('span').text('Record Payment');
});




// Focus amount paid box when row is clicked

pageBody.on('click', '.amountpaidrow', function() {
	$(this).find('span').focus();
});

var amountPaid = $('.e-amountpaid');

pageBody.on('focus', '.e-amountpaid', function() {
	$(this).closest('.row').addClass('active');
});

pageBody.on('blur', '.e-amountpaid', function() {
	$(this).closest('.row').removeClass('active');
});

// Prevent amount paid entered from being higher than invoice total

pageBody.on('keyup', '.e-amountpaid', function(e) {
	
	var $this = $(this);
	var amountPaid = parseFloat($this.text(), 10);
	var parentRow = $this.parents('.row');
	var invoiceTotalCell = parentRow.siblings('.invoicetotalrow').find('.invoicetotalcell');
	var invoiceBalanceCell = parentRow.siblings('.balancerow').find('.balancecell');
	var invoiceTotal =  parseFloat(Number( invoiceTotalCell.text().replace(/[^0-9\.]+/g,"")), 10);

	if (amountPaid > invoiceTotal) {
		$this.addClass('toomuch');
	} else {
		$this.removeClass('toomuch');
		$this.siblings('.homeamountpaiderror').hide();
	}

	var invoiceBalance = invoiceTotal - amountPaid;

	if (isNaN(invoiceBalance)) {
		invoiceBalanceCell.text('$' + invoiceTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	} else {
		invoiceBalanceCell.text('$' + invoiceBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
	}

});


// Alert the user if the logo they upload is too big
$('#user_logo').bind('change', function() {
	var size_in_megabytes = this.files[0].size/1024/1024;
		if (size_in_megabytes > 5) {
	  		alert('Maximum file size is 5MB. Please choose a smaller file.');
		}
});


// Changed fixed positions on window resize
$( window ).resize(function() {
	if (homePageWrapper.length) {
		setSidebarPosition();
		if ($('.homeinvoice').length) {
			setHomePagination();
		}
	}

	checkPaginationLength();
});


// Dropzone

// Add or remove nologos class to center dropzone mesage

var logoFormHolder = $('.logoformholder');

function correctMessagePosition() {
	
	if (logoFormHolder.find('img').length > 0) {
		logoFormHolder.removeClass('nologos');
	} else {
		logoFormHolder.addClass('nologos');
	}
}

correctMessagePosition();

// disable auto discover
Dropzone.autoDiscover = false;

var thumbnailLoading = $('#imageloading');

// Store original HTML inside Dropzone div
var dropzoneContent;

// Grab upload form, set initial settings
var logoUploader = $(".logouploader").dropzone({
		// restrict image size to a maximum 1MB
		maxFilesize: 1000,
		dictDefaultMessage: "Drop your logo here to upload",
		// changed the passed param to one accepted by
		// our rails app
		paramName: "logo[image]",
		// show remove links on each image upload
		addRemoveLinks: false,
		thumbnailWidth: null,
      	thumbnailHeight: null,
      	clickable: "#dropzoneclickable",
		previewTemplate: "<div class=\"dz-preview dz-file-preview\"><div class=\"dz-image\"><img data-dz-thumbnail /></div><div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div></div>",
		resize: function(file) {
        var resizeInfo = {
            srcX: 0,
            srcY: 0,
            trgX: 0,
            trgY: 0,
            srcWidth: file.width,
            srcHeight: file.height,
            trgWidth: file.width,
            trgHeight: file.height
        };

        return resizeInfo;
    },
    init: function() {
    	dropzoneContent = $('.dropzone').html();
    	correctMessagePosition();

		this.on("drop", function(e) {
			$('.dz-message').hide();
			thumbnailLoading.show();
		});
		this.on("thumbnail", function(e) {
			$('.dz-message').show();
			logoFormHolder.removeClass('nologos');
			thumbnailLoading.hide();
		});
		this.on("processing", function() {
			$('.dz-message').remove();
			$('.dropzone').append('<div class="dz-default dz-message"><span>Drop your logo here to upload</span></div>');
			$('.dz-message').hide();

			var offsetDistance = -19 - $('.dz-message').outerHeight();
			$('.dz-progress').css('bottom', offsetDistance);
		});
    	this.on("addedfile", function(file, dataUrl) {
    		$('.dz-message').hide();
            $('.userlogo').remove();
            thumbnailLoading.show();
			$('.dz-success').remove();
        });
        this.on("success", function(file, response) {
        	uploadSuccessful();
        	updateDeleteLink(response.id);
        });
        this.on("error", function(file, jsonResponse) {
        	addErrors(jsonResponse);
        });
    }
});	

function hasLogo() {
	var currentLogo = $('.userlogo').length;
	if (currentLogo) {
		return true
	} else {
		return false
	}
}

var deleteLogoButton = $('#deletelogobutton');

function updateDeleteLink(id) {
	if (id) {
		deleteLogoButton.show();
		deleteLogoButton.attr('href', 'logos/' + id);
	} else {
		if (hasLogo()) {
			deleteLogoButton.show();

		} else {
			deleteLogoButton.hide();
		}
	}
}

updateDeleteLink();

// Function for adding and hiding errors. As we receive JSON back for Dropzone this needs to be custom.
var validationErrors = $('#modalvalidationerrors'),
	errorHolder = $('#logoerrorholder'),
	validationsHeight, negativeValidationsHeight;

function addErrors(response) {
	$(".dropzone").html(dropzoneContent);
	thumbnailLoading = $('#imageloading');

	$('dz-error').remove();

	errorHolder.empty();
	errorHolder.append('<p>' + response["error"] + '</p>');

	validationsHeight = validationErrors.outerHeight();
	negativeValidationsHeight = -1 * validationsHeight;

	validationErrors.css({
		'margin-bottom' : negativeValidationsHeight,
		'display' : 'block'
	});

	$(".dz-progress").hide();

	validationsHeight += 15;

	$('.logoformholder').css({
	  '-webkit-transform' : 'translateY(' + validationsHeight + 'px)',
	  '-moz-transform'    : 'translateY(' + validationsHeight + 'px)',
	  '-ms-transform'     : 'translateY(' + validationsHeight + 'px)',
	  '-o-transform'      : 'translateY(' + validationsHeight + 'px)',
	  'transform'         : 'translateY(' + validationsHeight + 'px)',
	  'margin-bottom' : validationsHeight
	});

	$('.dz-message').show();
	correctMessagePosition();
	
}

function uploadSuccessful() {
	dropzoneContent = $('.dropzone').html();
	$('.dz-message').show();
	correctMessagePosition();
	validationErrors.removeAttr('style').removeClass('hastransformed').hide();
	$('.logoformholder').removeAttr('style');
	$('.success').remove();
    pageBody.append('<div class="success"> <div class="successtimer"></div><div class="closesuccess"></div><span>Logo was successfully uploaded!</span></div>');
}

// Show loading spinner when PDF clicked from invoice show page

var loadingSpinnerHtml = '<div class="loadingspinner showloadingspinner"> <div class="loadingcircle"> <div class="throbber-loader">Loading...</div></div></div>';


var invoiceLoading = false;
$('.viewpdfbutton').on("click", function(e) {
	if (!invoiceLoading) {
		invoiceLoading = true;
		e.preventDefault();
		var url = $(this).attr('href');

		if (mobileSidebarWrapper.hasClass('open')) {
			$(loadingSpinnerHtml).appendTo($('html')).fadeIn(300, function() {
				window.location.href = url;
			});
		} else {
			$(loadingSpinnerHtml).appendTo("#invoice").fadeIn(300, function() {
				window.location.href = url;
			});
		}
	} else {
		e.preventDefault();
	}
	
});


$('.showloadingspinner').remove();


// Select all input
$('.selectallinput').on('click touchstart', function(e) {
	e.preventDefault();
	var id = $(this).attr("id");
	var input = document.getElementById(id);
	$(this).focus();
    input.setSelectionRange(0,9999);
});


var selScrollable = '#contentwrapper, #mobilesidebarwrapper, #modalwindow, a, .modal, .emailmodal, .button, #formwrapper, #invoicewrapper, #invoicewrapper *, #clientssidebar, #pagewrapper, #usersettingshalf, #userlogohalf';
// Uses document because document will be topmost level in bubbling
$document.on('touchmove',function(e){
  e.preventDefault();
});
// Uses body because jQuery on events are called off of the element they are
// added to, so bubbling would not work if we used document instead.
$('body').on('touchmove', selScrollable, function(e) {
  if (e.currentTarget.scrollTop === 0) {
    e.currentTarget.scrollTop = 1;
  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
    e.currentTarget.scrollTop -= 1;
  }
});
// Stops preventDefault from being called on document if it sees a scrollable div
$('body').on('touchmove', selScrollable, function(e) {
  e.stopPropagation();

});

$('body').on('touchend', '[contenteditable=true]', function() {
	//$(this).trigger('click');
	var $this = $(this);

	var isDateField = $this.is('#e-date') || $this.is('#e-duedate');
	
	if (pageBody.hasClass('ios') || pageBody.hasClass('android')) {
		if (!$this.is(':focus') && !pageBody.hasClass('touchmoving') && !isDateField) {
			$this.focus();
			setEndOfContenteditable(this);
		}
	}
	
});

function setEndOfContenteditable(contentEditableElement) {
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

document.addEventListener("touchstart", function(){}, true);

var mobileSidebarWrapper = $('#mobilesidebarwrapper'),
	contentWrapper = $('#contentwrapper'),
	mobileSidebarButton = $('#mobilesidebar');

$('#mobilesidebar').on('click', toggleMobileSidebar);
$('.closemobilesidebar').on('click', toggleMobileSidebar);

function toggleMobileSidebar() {
	
	mobileSidebarButton.toggleClass('open');
	mobileSidebarWrapper.toggleClass('open');
	contentWrapper.toggleClass('sidebaropen');
	homePageWrapper.toggleClass('sidebaropen');

}

function checkPaginationLength() {
	var pagination = $('.pagination');

	if (pagination.length) {
		var paginationOffset = pagination.offset().left
	} else {
		var paginationOffset = 0;
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

//if (pageBody.hasClass('ios') || pageBody.hasClass('android')) {

//$('#homepagination').detach().prependTo('body');

// if ($('#pagewrapper').hasClass('homepage')) {

// 	mobileSidebarWrapper.addClass('detached');
// 	//mobileSidebarWrapper.detach().prependTo('body');
// }

//$('.invoiceform').detach().prependTo('body');
//$('header').detach().prependTo('body');

//} 

// var formWrapper = $('#formwrapper');

// if (formWrapper.length) {
// 	//console.log(formWrapper.html());
// 	console.log(document.getElementsByClassName('invoiceform')[0].nodeName)
// }


contentWrapper.on('scroll', function() {
	pageBody.addClass('touchmoving');
});

contentWrapper.on('touchend', function() {
	setTimeout(function() {
		pageBody.removeClass('touchmoving');
	}, 50);
});

var isWaitingForActive = false;

pageBody.on('touchstart', '.mobilehomeinvoice, .client', function() {
	isWaitingForActive = true;
	var homeInvoice = $(this);
	
	setTimeout(function() {
		if (isWaitingForActive) {
			homeInvoice.addClass('touchdown');
		}
	}, 100);
	
});

pageBody.on('touchmove touchend', function() {
	isWaitingForActive = false;
	$('.mobilehomeinvoice, .client').removeClass('touchdown');
});


var profileToggle = $('#profiletoggle');
var logoToggle = $('#logotoggle');

profileToggle.on('click', function(e) {
	profileToggle.addClass('active');
	logoToggle.removeClass('active');
	homePageWrapper.removeClass('logovisible');
});

logoToggle.on('click', function(e) {
	logoToggle.addClass('active');
	profileToggle.removeClass('active');
	homePageWrapper.addClass('logovisible');
});



// End misc.js
};

$(document).ready(ready);
$(document).on('page:load', ready);


// Run this when using the back button and turbolinks loads from cache
$(document).on('page:restore', function() {

	$('html').removeClass('noscroll');

	$('.showloadingspinner').remove();
	$('.homeinvoiceloader').hide();
	invoiceLoading = false;

	if ($(window).width() <= 1020) {
		$('#mobilesidebarwrapper > div').css('position', 'static');
	} else {
		$('#mobilesidebarwrapper > div').css('position', 'fixed');
	}

	$('.success').remove();

});

