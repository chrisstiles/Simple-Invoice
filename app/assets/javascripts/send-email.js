var ready;
ready = function() {

var pageBody = $('body');

// // Email invoice on button click
// pageBody.on('click', '.emailinvoicebutton', function() {

// 	var form = $('.search').parents("form"),
// 	url = form.attr("action");

// 	$.ajax({

// 		url: url,
// 		data: form.serialize(),
// 		type: 'POST',
// 		dataType: 'script',

// 	}).done(function( msg ) {

		

// 	}).fail(function(msg){

	

// 	});


// });



};

$(document).ready(ready);
$(document).on('page:load', ready);