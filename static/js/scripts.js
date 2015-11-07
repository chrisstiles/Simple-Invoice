$(document).ready(function() {

    // Set focus to textbox when control box is clicked
    $('.control').on('click', function() {
        $(this).find('input').focus();
    });

    // Add active class when element is in focus
    var invoiceSetting = $('input');

    invoiceSetting.on('focus', function() {
        $(this).closest('.control').addClass('active');
    });

    invoiceSetting.on('blur', function() {
        $(this).closest('.control').removeClass('active');
    });

    //Initialize datepickers
    var dateField = $('.datefield');
    dateField.datepicker({
        dateFormat: "MM d, yy",
        altFormat: "dd-mm-yy",
        showAnim: "",
        hideIfNoPrevNext: true
    });

    dateField.datepicker('setDate', '+0');

    var dueDateField = $('.duedatefield'),
        term = $('.terms').find(':selected').data('term');

    dueDateField.datepicker({
        dateFormat: "MM d, yy",
        altFormat: "dd-mm-yy",
        hideIfNoPrevNext: true
    });

    function setDueDate() {
        var newDate = dateField.datepicker('getDate');
        newDate.setDate(newDate.getDate() + term);
        dueDateField.datepicker('setDate', newDate);
    }

    setDueDate();

    // Disable choosing a due date prior to the invoice date;
    function setMinDate() {
        dueDateField.datepicker('option', 'minDate', dateField.datepicker('getDate'));
    }

    setMinDate();

    function setMaxDate() {
        dateField.datepicker('option', 'maxDate', dueDateField.datepicker('getDate'));
    }

    // Clone the original values in the terms dropdown to use later
    var terms = $('.terms'),
        originalTerms = terms.html();


    // Change the due date when the dropdown changes
    terms.on('change', function() {
        term = $(this).find(':selected').data('term');
        setDueDate();
        setMaxDate();
        eDueDate.html(dueDateField.val());
    });

    // Change the due date when the initial date 
    dateField.on('change', function() {
        setDueDate();
        setMinDate();
        eDate.html($(this).val());
        eDueDate.html(dueDateField.val());
    });


    // Change the terms dropdown when the due date changes
    dueDateField.on('change', function() {
        var d1 = dateField.datepicker('getDate'),
            d2 = dueDateField.datepicker('getDate');

        // Get the difference between the two dates and then divide by the number of milliseconds in a day	
        var diff = Math.floor((d2.getTime() - d1.getTime()) / 86400000);


        // Function to set difference as selected
        function setSelected() {
            $('*[data-term="' + diff + '"]').prop('selected', true);
        }

        // Loop through the dropdown of terms to see if the difference exists. If it does, set that option to selected
        var exists = false;
        $('.terms option').each(function() {
            if ($(this).data('term') === diff) {
                exists = true;
                setSelected();
                return false;
            }
        });

        // If the difference did not exist in the dropdown, append an option with it at the end.
        if (!exists) {
            var dataTerm = 'data-term="' + diff + '"',
                plural = '';

            // Decide whether to use 'Day' or 'Days in the appended option.
            if (diff === 1) {
                plural = 'Day';
            } else {
                plural = 'Days';
            }

            // Remove an previously appended items, then append the new option and set is as selected.	
            terms.html(originalTerms);
            terms.append('<option disabled>──────────</option><option ' + dataTerm + '>' + diff + ' ' + plural + '</option>');
            setSelected();
        }

        setMaxDate();
        eDate.html(dateField.val());
        eDueDate.html($(this).val());
    });


    // Add Date and Due Date inside invoice editor.
    var eDate = $('#e-date'),
        eDueDate = $('#e-duedate');

    eDate.html(dateField.val());
    eDueDate.html(dueDateField.val());

    eDate.on('click', function() {
        dateField.datepicker('show');
    });

    eDueDate.on('click', function() {
        dueDateField.datepicker('show');
    });

    // Bind the input fields and content editable fields.

    // Change input field when content editable changes
    $('[contenteditable=true]').on('keyup', function() {
        var value = $(this).text();
        var item = $(this).attr('name');
        var inputField = $('input[name="' + item + '"]');

        inputField.val(value);
    });

    // Change content editable when input changes
    $('input').on('keyup', function() {
        var value = $(this).val();
        var item = $(this).attr('name');
        var inputField = $('*[name="' + item + '"]');

        inputField.html(value);
    });

    // Set focus to content editable when td is clicked
	
	var jobsTable = $('#invoiceitems table');

    jobsTable.on('click', 'td', function() {
        $(this).children('[contenteditable=true]').trigger('focus');
    });

	// Prevent typing letters but allow select all with command and control
    function isNumber(e) {
        var a = [16, 190, 9, 37, 38, 39, 40, 46, 8];
        var k = e.which;

        for (var i = 48; i < 58; i++) {
            a.push(i);
        }

        var isMeta = false;

        if (e.metaKey || e.ctrlKey) {
            isMeta = true;
        }

        if (!isMeta && !(a.indexOf(k) >= 0)) {
            e.preventDefault();
        }
    }
	
    $(document).on('keydown', '.e-quantity, .e-rate', function(e) {
        return isNumber(e);
    });


	// Prevent pasting in quantity and rate fields
    $(document).on('paste', '.e-quantity, .e-rate', function(e) {
        e.preventDefault();
    });


    // Calculate subtotals for amount

    function calculateSubtotal(field, $this) {
        var quantity, rate;

        if (field === 'quantity') {
            quantity = parseFloat($this.children('span').text());
            rate = parseFloat($this.closest('tr').find('.ratecell').text());
        } else {
            rate = parseFloat($this.children('span').text());
            quantity = parseFloat($this.closest('tr').find('.quantitycell').text());
        }

        var total = parseFloat(Math.round((quantity * rate) * 100) / 100).toFixed(2);
        var amountCell = $this.closest('tr').find('.amountbox');

        if (!isNaN(total)) {
            amountCell.html('$ ' + (total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
        } else {
            amountCell.empty();
        }
    }
	
	// Calculate invoice total
	
	var totalBox = $('#invoiceamount');
	
	function calculateTotal() {
		var invoiceTotal = 0, addValue;
		
		$('.amountbox').each(function() {
			addValue = Number($(this).html().replace(/[^0-9\.]+/g,""));
			invoiceTotal += addValue;
		});
		
		invoiceTotal = parseFloat(Math.round(invoiceTotal * 100) / 100).toFixed(2);
		
		if (!isNaN(invoiceTotal)) {
			totalBox.html('$ ' + (invoiceTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
		} else {
			totalBox.html('$ 0.00');	
		}

	}
	
	calculateTotal();
	
    jobsTable.on('keyup', '.quantitycell', function() {
        calculateSubtotal('quantity', $(this));
		calculateTotal();
    });

    jobsTable.on('keyup', '.ratecell', function() {
        calculateSubtotal('rate', $(this));
		calculateTotal();
    });
	
	
	// Add grey background when jobs row is in focus
	
	jobsTable.on('focus', 'span', function() {
		var row = $(this).parents('tr'),
			rowControls = row.find('.jobcontrols');
			
		row.addClass('activerow');
		rowControls.addClass('activerow');
	});
	
	jobsTable.on('blur', 'span', function() {
		var row = $(this).parents('tr'),
			rowControls = row.find('.jobcontrols');
			
		row.removeClass('activerow');
		rowControls.removeClass('activerow');
	});

    // Add a new job item row when the insert button is clicked

    var afterContent = '<tr changed="false"><td align="left" class="jobdescriptioncell"><span class="e-jobdescription" contenteditable="true" placeholder="Type a job description"></span></td><td align="right" class="quantitycell"><span class="e-quantity" contenteditable="true" placeholder="Quantity"></span></td><td align="right" class="ratecell"><span class="e-rate" contenteditable="true" placeholder="Rate"></span></td><td align="right" class="amountcell"> <div class="amountbox"></div><div class="jobcontrols"><div class="delete"></div><div class="insert"></div></div></td></tr>';

    jobsTable.on('click', '.insert', function() {
        var row = $(this).parents('tr');
        row.after(afterContent);
        checkLastRow();
    });

    // Keep track of what rows have changed

    jobsTable.on('keyup', 'span', function() {
        $(this).parents('tr').attr('changed', 'true');
    });


    // Delete job item row after delete button is clicked

    function deleteRow(el) {
        el.parents('tr').remove();
    }

    jobsTable.on('click', '.delete', function() {
        var hasBeenEdited = $(this).parents('tr').attr('changed');
        var $this = $(this);
        if ($this.hasClass('disabled')) {
            return false;
        } else if (hasBeenEdited === 'false') {
            deleteRow($this);
        } else {
            var confirmation = confirm('You have made changes to this row. Are you sure you would like to delete it?');
            if (confirmation) {
                deleteRow($this);
            } else {
                return false;
            }
        }

        checkLastRow();
    });


    // Prevent the last job row from being deleted

    function checkLastRow() {
        var rowCount = $('#invoiceitems table tr').length;
        if (rowCount === 2) {
            $('.delete').addClass('disabled');
        } else {
            $('.delete').removeClass('disabled');
        }
    }

    checkLastRow();

	
	// Focus notes row when section is clicked
	
	$('#notes').on('click', function() {
		$(this).find('span').focus();	
	});

});