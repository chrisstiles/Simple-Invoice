var ready;
ready = function() {

    // Links with the class of modal will open the modal window
    //var modal = $('.modal');

    // Body for finding appended items and disabling scroll

    var pageBody = $('body');
    var pageHtml = $('html');

    // Generate the modal window and title

    function showModal(title) {
        var scrollAmount = $(document).scrollTop();

        if ($(document).height() > $(window).height()) {
             var scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
             $('html').addClass('noscroll').css('top',-scrollTop);         
        }

        $('html').addClass('noscroll').css('top',-scrollTop);   
        
        pageBody.append('<div id="modalwrapper"><div id="modaloverlay"></div><div id="modalwindow"><div id="modaltitle"><div class="closemodal"></div><span>' + title + '</span></div><div class="throbber-loader">Loading...</div></div></div>');

    }

    function addModalContent(content, fade) {
    	var html = content
    	if (fade) {
    		$(html).hide().appendTo('#modalwindow').fadeIn(200);
    	} else {
    		$('#modalwindow').append(html);
    	}
    }

    // Remove the modal window content from the DOM
    function closeModal() {
        
        var scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('noscroll');
        $('html,body').scrollTop(-scrollTop);

        $('#modalwrapper').remove();
    }

    // Close modal after close button is clicked
    pageBody.on('click', '.closemodal', function(e) {
        e.preventDefault();
        closeModal()
    });

    // Close modal when clicking on white background
    pageBody.on('click', '#modaloverlay', function(e) {
        e.preventDefault();
        closeModal()
    });

    // Close modal when escape key is pressed
    $(document).on('keyup', function(e) {
        if (e.keyCode == 27 && $('#modalwindow').length) {
            closeModal();
        }
    });

    // Displays the modal window and adds title. Must add content per individual open links with addModalContent()
    pageBody.on('click', '.modal', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('nomodal')) {
            var title = $(this).data('title') || '';
            showModal(title);
        }
    });


    // Grab list of clients from current user and add them as modal content
    var clientsButton = $('.clients-modal');

    clientsButton.on('click', function() {
        if ($(this).hasClass('addclient')) {


            // Get json data and save as variable
            $.ajax({
                type: 'GET',
                url: '/clients?allclients=true',
                dataType: 'json',
                async: true,
                success: function(data) {

                    if (data.length == 0) {
                        addModalContent('<div id="modalcontent"><div class="noclients"><span>No Clients Found</span><a href="/clients/" class="button blue" target="_blank">Create your first client</a></div></div>')
                    } else {

                        // Append all clients and info to modal window
                        var clientContent = '';

                        $.each(data, function(i, item) {
                            var appendedContent = '<li class="modalclient" data-client_id=' + item.id + ' data-name="' + item.name + '" data-email="' + item.email + '" data-address_line1="' + item.address + '"';

                            // Only add the second line of the address if they have city, state and zip added
                            if (!item.city == '' && !item.city == '' && !item.zip == '') {
                                appendedContent += ' data-address_line2="' + item.city + ', ' + item.state + ' ' + item.zip + '"';
                            }

                            appendedContent += ' data-phone="' + item.phone + '"><span class="client-name">' + item.name + '</span><span class="client-email">' + item.email + '</span></li>';

                            if (item.is_primary == true) {
                                clientContent = appendedContent + clientContent
                            } else {
                                clientContent += appendedContent;
                            }
                            
                        });

                        // Add the search box if there are more than one clients
                        if (data.length > 1) {
                            addModalContent('<div id="modalsearchwrapper"><input id="modalsearch" type="text" placeholder="Filter clients"></div><div id="modalcontent" class="withsearch"><div id="modalscroll"><ul id="client-content">' + clientContent + '</ul></div></div>', false);
                        } else {
                            addModalContent('<div id="modalcontent"><div id="modalscroll"><ul id="client-content" class="single">' + clientContent + '</ul></div></div>', false);
                        }

                    }

                }
            })

        }

    });


    pageBody.on('click', '.emailmodal', function(e) {
        e.preventDefault();
        var invoiceNumber = $(this).attr('data-invoice-number');
        showModal('Email Invoice #' + invoiceNumber)
            // Get json data and save as variable
            $.ajax({
                type: 'GET',
                url: '/invoices/' + invoiceNumber + '/send',
                dataType: 'html',
                async: true,
                success: function(data) {
                    addModalContent('<div id="modalcontent" class="emailformmodal">' + data + '</div>', false);

                    var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' + '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

                    $('.emailtags').selectize({
                        delimiter: ',',
                        persist: false,
                        createOnBlur: true,
                        plugins: ['fast_click'],
                        // createFilter: function(input) {
                        //     var match, regex;

                        //     // email@address.com
                        //     regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
                        //     match = input.match(regex);
                        //     if (match) return !this.options.hasOwnProperty(match[0]);

                        //     // name <email@address.com>
                        //     regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
                        //     match = input.match(regex);
                        //     if (match) return !this.options.hasOwnProperty(match[2]);

                        //     return false;
                        // },
                        create: function(input) {

                            var match, regex;

                            // email@address.com
                            regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
                            match = input.match(regex);

                            if (match) {
                                return {
                                    value: input,
                                    text: input
                                }
                            } else {
                                return false
                            }

                            
                        }
                    });
                },
                error: function(data) {
                    addModalContent('<div id="modalcontent" class="emailformmodal">Error. Could not retrieve invoice.</div>', false);
                }
            })

    })

    
    // Loop through clients and set every other row as grey after filtering

    // function setRowBgs() {
    //     var visibleRows = $('.modalclient:visible');

    //     visibleRows.each(function(i) {
    //         var $this = $(this);

    //         if (i % 2 == 0) {
    //             $this.css('background-color', '#ffffff');
    //         } else {
    //             $this.css('background-color', '#f6f6f6');
    //         }

    //     });
    // }


    // Add client information to invoice when clicked

    var clientId = $('#client_id'),
        eClientName =$('#e-clientname'),
        invoiceClientName = $('#invoice_client_name'),
        eClientAddress = $('#e-clientaddress'),
        invoiceClientAddressLine1 = $('#invoice_client_address_line1'),
        eClientCityZip = $('#e-clientcityzip'),
        invoiceClientAddressLine2 = $('#invoice_client_address_line2');

    pageBody.on('click', '.modalclient', function() {
        var $this = $(this);
        clientId.val($this.data('client_id'));

        eClientName.html($this.data('name')).attr('contenteditable', false);
        eClientName.removeClass('haserror');

        invoiceClientName.val($this.data('name')).prop('readonly', true);

        invoiceClientName.parents('.control').addClass('hassetclient');

        eClientAddress.html($this.data('address_line1'));
        eClientAddress.removeClass('haserror');

        invoiceClientAddressLine1.val($this.data('address_line1'));

        eClientCityZip.html($this.data('address_line2'));
        eClientCityZip.removeClass('haserror');

        invoiceClientAddressLine2.val($this.data('address_line2'));

        setClientButton();

        closeModal();
    });

    // Filter lists based on search criteria

    pageBody.on('keyup', '#modalsearch', function() {
        var valThis = $(this).val().toLowerCase();
        if (valThis == "") {
            $('#client-content > li').removeAttr('style').show();
        } else {
            var counter = 1;
            $('#client-content > li').each(function() {
                var $this = $(this);
                var text = $this.text().toLowerCase();
                if (text.indexOf(valThis) >= 0) {
                //     if (counter % 2 == 0) {
                //         $this.css('background-color', '#f6f6f6');
                //     } else {
                //         $this.css('background-color', '#ffffff');
                //     }

                    $(this).show();

                    counter++
                } else {

                    $(this).hide();

                }
                
                //(text.indexOf(valThis) >= 0) ? $(this).show(): $(this).hide();
            });
        }
        //setRowBgs();  
         
    });


    // Check is a client has been set and change the client button
    var clientId = $('#client_id');
    var clientTooltip = $('.clients-modal span');

    function setClientButton() {
        if (!clientId.val() == '') {
            clientsButton.removeClass('modal addclient').addClass('removeclient nomodal');
            clientTooltip.text('Remove Client');
            eClientName.attr('contenteditable', false);
            invoiceClientName.prop('readonly', true);
            invoiceClientName.parents('.control').addClass('readonly');
        } else {
            clientsButton.removeClass('removeclient nomodal').addClass('modal addclient');
            clientTooltip.text('Add Saved Client');
            invoiceClientName.parents('.control').removeClass('readonly');
        }
    }

    setClientButton();

    // Remove client from invoice when clicked

    pageBody.on('click', '.removeclient', function(e) {
        e.preventDefault();
        clientId.val('');

        eClientName.html('').attr('contenteditable', true);
        invoiceClientName.val('').prop('readonly', false);

        invoiceClientName.parents('.control').removeClass('hassetclient');

        eClientAddress.html('');
        invoiceClientAddressLine1.val('');

        eClientCityZip.html('');
        invoiceClientAddressLine2.val('');

        setClientButton();
    });

    // Close modal when new client is clicked

    pageBody.on('click', '.noclients a', closeModal);

};

$(document).ready(ready);
$(document).on('page:load', ready);