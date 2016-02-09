var ready;
ready = function() {

var pageBody = $('body');
var pageWrapper = $('#pagewrapper');

if (pageWrapper.hasClass('clientspage')) {

// All client page only code goes here

// Set position and width of pagination and search wrapper

var clientFilter = $('#clientfiltering');
var clientContainer = $('#clientscontainer');
var clientSearch = $('#clientsearch');
var clientsSidebar = $('#clientssidebar');

function setClientFilter() {
	var width = clientContainer.outerWidth();
	var clientContainerPosition = clientContainer.offset();

	pageWrapper.css('top', clientFilter.outerHeight() + clientSearch.outerHeight() + 63);

	clientSearch.css({
		'left': clientContainerPosition.left,
		'width': width
	});

	clientFilter.css({
		'left': clientContainerPosition.left,
		'width': width,
		'top': clientSearch.outerHeight() + 63
	});

	clientsSidebar.css({
		'left': clientContainerPosition.left + width,
		'width': width
	});

}

setClientFilter();

// Add overflow scroll if the box is too large for the screen
function checkWrapperHeight() {
	var sidebar = $('#clientssidebar');
	var formHeight = $('.clientsformwrapper').outerHeight();
	var wrapperHeight = sidebar.outerHeight() - $('#newclientbox').outerHeight();

	if (formHeight > wrapperHeight) {
		sidebar.css('overflow-y', 'scroll');
	} else {
		sidebar.css('overflow-y', 'auto');
	}
}

checkWrapperHeight();

// Changed fixed positions on window resize
$( window ).resize(function() {
	setClientFilter();
	checkWrapperHeight();
});

// Add selected class and perform ajax request for edit form
pageWrapper.on('click', '.client', function() {

	var $this = $(this);
	var id = $this.attr('data-id');
	if (!$this.hasClass('selected')) {
		pageBody.addClass('loadingclientform');

		$('.selected').removeClass('selected');
		$this.addClass('selected');
		
		getClient(id);

	}
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