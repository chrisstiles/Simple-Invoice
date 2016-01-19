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



// Changed fixed positions on window resize
$( window ).resize(function() {
	setClientFilter();
});


pageWrapper.on('click', '.client', function() {
	console.log('clicked');
	var $this = $(this);
	var id = $this.attr('data-id');
	if (!$this.hasClass('selected')) {
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
	    //console.log(msg)
	  //  hideLoader();
	  }).fail(function(msg){
	    console.log(msg)
	  });
}



}

};

$(document).ready(ready);
$(document).on('page:load', ready);