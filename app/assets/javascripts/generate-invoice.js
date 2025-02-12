$(document).ready(function() {
	var invoiceWrapper = $('#invoicewrapper');
	var editing = invoiceWrapper.hasClass('edit');
	var creating = invoiceWrapper.hasClass('new');
	if (creating || editing) {
		sessionStorage.removeItem("datePickersCache");
		sessionStorage.removeItem("invoiceType");
	}
});

$(document).on('turbolinks:visit', function() {
	$.datepicker.initialized = false;
});

$(document).on('turbolinks:load', function() {
	
	var $document = $(document);
	var invoiceWrapper = $('#invoicewrapper');
	var editing = invoiceWrapper.hasClass('edit');
	var creating = invoiceWrapper.hasClass('new');
	var showing = invoiceWrapper.hasClass('show');
	var profileEditing = $('#pagewrapper').hasClass('userpage');
	var pageBody = $('body');
	var isEstimatePage = pageBody.hasClass('isestimate');
	var isInvoicePage = pageBody.hasClass('isinvoice');

	// Add loading content to buttons on press

	pageBody.on('submit', 'form', function() { 
		var $this = $(this);
		if ($this.find('.willload').length) {
			var button = $this.find('.willload');

			if (!button.hasClass('hasloadingtext')) {

				button.addClass('hasloadingtext');

				var oldContent = ''

				if (button.is('input')) {
					button.prop('disabled', true);
					button.parents('form').submit();
					oldContent = button.val();
				} else {
					oldContent = button.text();
				}

				pageBody.append('<div class="hidden buttoncontent">' + oldContent + '</div>');
				
				button.addClass('loading');
				button.val('Loading...');

				button.text('Loading...');

			}
		}
		
	});


	// Extend jQuery to trim whitespace
	jQuery.fn.htmlClean = function() {
	    this.contents().filter(function() {
	        if (this.nodeType != 3) {
	            $(this).htmlClean();
	            return false;
	        }
	        else {
	            this.textContent = $.trim(this.textContent);
	            return !/\S/.test(this.nodeValue);
	        }
	    }).remove();
	    return this;
	}

	// Function to prevent pasting formatted text in content editable

	var _onPaste_StripFormatting_IEPaste = false;

        function OnPaste_StripFormatting(elem, e) {

            if (e.originalEvent && e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
                e.preventDefault();
                var text = e.originalEvent.originalEvent.clipboardData.getData('text/plain');
                window.document.execCommand('insertText', false, text);
            }
            else if (e.clipboardData && e.clipboardData.getData) {
                e.preventDefault();
                var text = e.clipboardData.getData('text/plain');
                window.document.execCommand('insertText', false, text);
            }
            else if (window.clipboardData && window.clipboardData.getData) {
                // Stop stack overflow
                if (!_onPaste_StripFormatting_IEPaste) {
                    _onPaste_StripFormatting_IEPaste = true;
                    e.preventDefault();
                    window.document.execCommand('ms-pasteTextOnly', false);
                }
                _onPaste_StripFormatting_IEPaste = false;
            }

        }


		// Bind the input fields and content editable fields.

		var contentEditable = $('[contenteditable=true]');

		// Prevent pasting with formatting

		function preventPasting() {
			var editables = document.querySelectorAll('[contenteditable=true]');

			[].forEach.call(editables, function(e) {

				e.addEventListener("paste", function(e) {

				// cancel paste
				e.preventDefault();

				// get text representation of clipboard
				var text = e.clipboardData.getData("text/plain");

				// insert text manually
				document.execCommand("insertHTML", false, text);
				
				});

			});
		}

		preventPasting();


		// Change input field when content editable changes
		$document.on('keydown keyup', '[contenteditable=true]', function() {
			var $this = $(this);
			
			var value = $this.text();

			if (value == '' || value == '<div></div>' || value == '<br>' || value == '<br/>' || value == '<p></p>') {
				$this.empty();
			}

			var item = $this.attr('name');
			var inputField = $this.prev(':input');

			if ($this.is('#e-clientname')) {
				inputField = $('#invoice_client_name');
			}

			if (inputField.is('textarea')) {
				value = $this.html();
			} 
			//var inputField = $('[name="' + item + '"]');

			inputField.val(value);

			if (inputField.is('textarea')) {
				inputField.val().replace(/<br>/gi,"\n")
			}

		});


		$('#invoiceitems :input').each(function() {
			var $this = $(this);
			var jobVal = $this.val();

			$this.next('[contenteditable=true]').html(jobVal);

		})

		// Change content editable when input changes
		$('input').on('keyup', function() {
			var value = $(this).val();
			var item = $(this).attr('name');
			var inputField = $('*[name="' + item + '"]');

			inputField.html(value);
		});

		// Prevent typing letters but allow select all with command and control
		function isNumber(e) {
			var a = [16, 190, 9, 37, 38, 39, 40, 46, 8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110];
			var k = e.which;

			var isMeta = false;

			if (e.metaKey || e.ctrlKey) {
				isMeta = true;
			}

			if (!isMeta && !(a.indexOf(k) >= 0)) {
				e.preventDefault();
			}
		}

		$document.on('keydown', '.e-quantity, .e-rate, #e-amountpaid, .e-amountpaid, .invoice_number_search, .onlynumber', function(e) {
			return isNumber(e);
		});


		// Prevent pasting in quantity and rate fields
		$document.on('paste', '.e-quantity, .e-rate, #e-amountpaid, .e-amountpaid, .invoice_number_search, .onlynumber', function(e) {
			e.preventDefault();
			$(this).text('');
		});


		// Tax section

		// Toggle things when tax box is checked

		var hasTaxToggle = $('.taxtoggle'),
			hasTaxHiddenField = $('*[name="invoice[has_tax]"]:not(:checkbox)'),
			hasTaxText = $('.hastaxtext'),
			taxSection = $('#taxinformation'),
			taxTextField = $('.tax-rate-box'),
			taxAmount = $('.e-taxamount'),
			taxInclusionCheckbox = $('.includedtoggle'),
			taxInclusionHiddenField;

		if (editing || creating) {
			taxInclusionHiddenField = $('*[name="invoice[tax_included]"]:not(:checkbox)');
		} else {
			taxInclusionHiddenField = $('*[name="user[setting_attributes][tax_included]"]:not(:checkbox)');
		}

		function toggleTax() {
			if (hasTaxToggle.is(':checked')) {
				taxSection.show();
				if (creating || editing) {
					hasTaxText.text('Has Tax');
				} else {
					hasTaxText.text('Add tax to invoice by default');
				}
				setInclusionText();
				creatingOrEditingCalculateTotal();
			} else {
				taxSection.hide();
				setTaxDefaults();
				if (creating || editing) {
					hasTaxText.text('No Tax');
				} else {
					hasTaxText.text('Do not add tax to invoice by default');
				}
				creatingOrEditingCalculateTotal();
			}
		}

		function setTaxDefaults() {
			taxAmount.html('0.0');
			taxTextField.val('0.0');
			taxInclusionCheckbox.attr('checked', false);
			taxInclusionHiddenField.val('0');
			setInclusionText();
		}

		var inclusionText = $('.inclusiontext');

		function setInclusionText() {
			if (taxInclusionCheckbox.is(':checked')) {
				if (creating || editing) {
					inclusionText.text('Included');
				} else {
					inclusionText.text('Include tax in invoice total price');
				}
				
			} else {
				if (creating || editing) {
					inclusionText.text('Not Included');
				} else {
					inclusionText.text('Do not include tax in invoice total price');
				}
				
			}
		}


		taxInclusionCheckbox.on('change', function() {
			setInclusionText();
			creatingOrEditingCalculateTotal();
		});

		hasTaxToggle.on('change', toggleTax);

		// Select all content for number divs
		pageBody.on('click', '.selectall, .e-quantity, .e-rate, .e-taxamount', function() {
			document.execCommand('selectAll', false, null);
		});

		// Set tax value
		function setTaxBounds() {
			var taxValue;

			if (creating || editing) {
				taxValue = parseFloat(taxAmount.text());
			} else {
				taxValue = parseFloat(taxTextField.val());
			}

			if (taxValue < 0 || isNaN(taxValue) || taxValue === '') {
				taxAmount.html('0.0');
				taxTextField.val('0.0');
			}
		}

		taxAmount.on('keyup', function() {
			setTaxBounds();
			creatingOrEditingCalculateTotal();
		});

		taxTextField.on('change keyup', function() {
			setTaxBounds();
			creatingOrEditingCalculateTotal();
		});

		function creatingOrEditingCalculateTotal() {
			if (editing || creating) {
				calculateTotal();
			} 
		}

		if (profileEditing) {
			toggleTax();
		}

		// Max length for tax box

		function checkMaxLength(el, maxLength, canHavDecimals) {
			var number = el.text();
			var decimalPlaces = 0;

			if (canHavDecimals) {
				var newLength = $.trim(number.replace('.', '')).length
				var decimalPosition = number.indexOf('.');

				if (decimalPosition > -1) {
					decimalPlaces = numDecimalPlaces(parseFloat(number));
					var range = window.getSelection().getRangeAt(0);
					var caretPosition = getCharacterOffsetWithin(range, el[0]);

					if (caretPosition > decimalPosition) {
						if (decimalPlaces >= 2) {
							return true;
						} else {
							return false;
						}
					}
				}

			} else {
				var newLength = $.trim(number).length
			}

			if (newLength >= maxLength) {
				return true
			} else {
				return false
			}
		}

		function getCharacterOffsetWithin(range, node) {
		    var treeWalker = document.createTreeWalker(
		        node,
		        NodeFilter.SHOW_TEXT,
		        function(node) {
		            var nodeRange = document.createRange();
		            nodeRange.selectNode(node);
		            return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ?
		                NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
		        },
		        false
		    );

		    var charCount = 0;
		    while (treeWalker.nextNode()) {
		        charCount += treeWalker.currentNode.length;
		    }
		    if (range.startContainer.nodeType == 3) {
		        charCount += range.startOffset;
		    }
		    return charCount;
		}

		function numDecimalPlaces(num) {
			var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
			if (!match) { return 0; }
			return Math.max(
			   0,
			   // Number of digits right of decimal point.
			   (match[1] ? match[1].length : 0)
			   // Adjust for scientific notation.
			   - (match[2] ? +match[2] : 0));
		}

		function getSelectionTextAndContainerElement() {
		    var text = "", containerElement = null;
		    if (typeof window.getSelection != "undefined") {
		        var sel = window.getSelection();
					if (sel.rangeCount) {
						var node = sel.getRangeAt(0).commonAncestorContainer;
						containerElement = node.nodeType == 1 ? node : node.parentNode;
						text = sel.toString();
					}
			    } else if (typeof document.selection != "undefined" &&
			               document.selection.type != "Control") {
			        var textRange = document.selection.createRange();
			        containerElement = textRange.parentElement();
			        text = textRange.text;
			    }
			    return {
			        text: text,
			        containerElement: containerElement
			    };
			}

			function numberTest(n) {
		 	return !isNaN(parseFloat(n)) && isFinite(n);
		}

		pageBody.on('keypress', '.e-taxamount, .e-quantity, .e-rate', function(e) {
			var keyCode = e.keyCode || e.which;
			var $this = $(this);

			var isDecimalPlace = (keyCode === 190 || keyCode == 110 || keyCode === 46);

			var selection = getSelectionTextAndContainerElement();
			var hasSelectedText = false;
		
			if (isDecimalPlace && ($this.text().indexOf(".") > -1) && selection.text.indexOf(".") === -1) {
				e.preventDefault();
				return false;
			} 

			if (checkMaxLength($this, 10, true)) {

				if ($(selection.containerElement).is($this) && numberTest(selection.text)) {
					hasSelectedText = true;
				}

				if (isDecimalPlace || hasSelectedText) {
					return true
				} else {
					e.preventDefault();
				}
			}
		});

		pageBody.on('keypress', '#e-invoicenumber[contenteditable="true"]', function(e) {
			var keyCode = e.keyCode || e.which;
			var $this = $(this);
			var isDecimalPlace = (keyCode === 190 || keyCode == 110 || keyCode === 46);

			if (isDecimalPlace) {
				e.preventDefault();
				return false;
			}

			var selection = getSelectionTextAndContainerElement();

			if (checkMaxLength($this, 15, false)) {
				if ($(selection.containerElement).is($this) && selection.text !== "") {
					return true
				} else {
					e.preventDefault();
				}
			}

		})


	// Set initial logo dimensions

	var invoiceLogoImage = $('.invoicelogoimage');
	if (invoiceLogoImage.length) {

		var targetWidth = parseInt(invoiceLogoImage.attr('data-width'));
		var targetHeight = parseInt(invoiceLogoImage.attr('data-height'));
	
		if (!isNaN(targetWidth) && !isNaN(targetHeight)) {

			if (creating || editing) {
				// Creating and Editing Pages
				var logoWrapper = $('#logoresize');
				var logoWrapperWidth = logoWrapper.width();
				if (targetWidth <= logoWrapperWidth) {
					logoWrapper.css({
						width: targetWidth,
						height: targetHeight
					});
					invoiceLogoImage.css({
						width: targetWidth,
						height: 'auto'
					});
				} else {
					logoWrapper.css({
						width: logoWrapperWidth,
						height: 'auto'
					});
					invoiceLogoImage.css({
						width: logoWrapperWidth,
						height: 'auto'
					});
				}
			} else {
				// Show Page
				var logoWrapper = $('#showlogowrapper');
				//var logoWrapperWidth = logoWrapper.width();
				logoWrapper.css({
					width: '100%',
					'max-width': targetWidth,
					height: 'auto'
				});
				invoiceLogoImage.css({
					width: '100%',
					height: 'auto'
				});
			}
		}
	}

	if (editing || creating) {
		$('.mobilecreatebutton').remove();

		// Toggle invoice number and estimate number
		var invoiceTypeSelect = $('#invoice_invoice_type');
		var invoiceNumberSpan = $('#e-invoicenumber');
		var estimateNumberSpan = $('#e-estimatenumber');
		var invoiceOnlyItems = $('.invoiceonly');
		var saveButton = $('#toolbarcontent .saveicon');

		var invoiceTypeCache = sessionStorage.getItem("invoiceType"),
			hasCachedInvoiceType;

		if (invoiceTypeCache && invoiceTypeCache.length) {
			hasCachedInvoiceType = true;
		} else {
			hasCachedInvoiceType = false;
		}

		function setInvoiceTypeField(isInitial) {
			var isEstimate = false;
			if (invoiceTypeSelect.length) {
				if (isInitial && hasCachedInvoiceType) {
					invoiceTypeSelect.val(invoiceTypeCache);
					if (invoiceTypeCache.toLowerCase() === 'estimate') {
						isEstimate = true;
					}
				} else {
					if (invoiceTypeSelect.val().toLowerCase() === 'estimate') {
						isEstimate = true;
					}
				}

				if (isEstimate) {
					invoiceNumberSpan.hide();
					estimateNumberSpan.show();
					saveButton.val("Save Estimate");

					if (!isInitial) {
						removeMaxDate();
						invoiceOnlyItems.hide();
					}
				} else {
					invoiceNumberSpan.show();
					estimateNumberSpan.hide();

					saveButton.val("Save Invoice");

					if (!isInitial) {
						setMinDate();
						invoiceOnlyItems.show();
					}
				}
			}
		}

		setInvoiceTypeField(true);

		invoiceTypeSelect.on('change', function() {
			setInvoiceTypeField(false);
		});

		// Set focus to textbox when control box is clicked
		$('.control').on('click', function() {
			var inputField = $(this).find('input');
			inputField.focus();
		});

		// Add active class when element is in focus
		var invoiceSetting = $('input');

		invoiceSetting.on('focus', function() {
			var $this = $(this);

			if (!$this.is('[readonly]')) {
				$(this).closest('.control').addClass('active');
			}
			
		});

		invoiceSetting.on('blur', function() {
			$(this).closest('.control').removeClass('active');
		});

		//Initialize datepickers
		var dateControl = $('.datecontrol');
		var dueDateControl = $('.duedatecontrol');

		// Store whether or not the datepickers have already been initialized by turbolinks
		var datePickersCache = sessionStorage.getItem("datePickersCache"),
			hasCachedDates;

		if (datePickersCache && datePickersCache.length) {
			hasCachedDates = true;
		} else {
			hasCachedDates = false;
		}

		var dateField, dueDateField;

		function setDateFields() {
			dateField = $('.datefield');
			dueDateField = $('.duedatefield');
		}

		setDateFields();

		var dateFieldHtmlCache, dueDateFieldHtmlCache;

		if (hasCachedDates) {
			dateFieldHtmlCache = sessionStorage.getItem("datePickerHtmlCache");
			dueDateFieldHtmlCache = sessionStorage.getItem("dueDatePickerHtmlCache");
		} else {
			dateFieldHtmlCache = dateField[0].outerHTML;
			dueDateFieldHtmlCache = dueDateField[0].outerHTML;
		}

		document.addEventListener("turbolinks:before-cache", function() {
			sessionStorage.setItem("datePickersCache", "true");
			sessionStorage.setItem("invoiceType", invoiceTypeSelect.val());
		});

		if (hasCachedDates) {
			$('.hasDatepicker').removeClass('hasDatepicker');
			setDateFields();
			jQuery.datepicker.dpDiv.appendTo( jQuery('body') );
		}

		$.datepicker.setDefaults({
			dateFormat: "MM d, yy",
			altFormat: "dd-mm-yy",
			showAnim: "",
			hideIfNoPrevNext: true
		});

		dateField.datepicker();

		dateField.datepicker('setDate', '+0');

		var term = $('.terms').find(':selected').data('term');

		dueDateField.datepicker();

		function setDueDate() {
			term = $('.terms').find(':selected').data('term');
			var newDate = dateField.datepicker('getDate');
			newDate.setDate(newDate.getDate() + term);
			dueDateField.datepicker('setDate', newDate);
		}

		// Disable choosing a due date prior to the invoice date;
		function setMinDate() {
			dueDateField.datepicker('option', 'minDate', dateField.datepicker('getDate'));
		}

		setMinDate();

		function setMaxDate() {
			dateField.datepicker('option', 'maxDate', dueDateField.datepicker('getDate'));
		}

		function removeMaxDate() {
			dateField.datepicker('option', 'maxDate', null);
		}

		// Clone the original values in the terms dropdown to use later
		var terms = $('.terms'),
			originalTerms = terms.html();


		// Change the due date when the dropdown changes
		terms.on('change', function() {
			var selectedTerm = $(this).find(':selected')
			term = selectedTerm.data('term');

			var otherTerms = $('.terms').not($(this));
			otherTerms.val(selectedTerm.val());

			setDueDate();
			setMaxDate();
			eDueDate.html(dueDateField.val());
		});

		// Change the due date when the initial date 
		dateField.on('change', function() {
			setMinDate();
			setDueDate();
			eDate.html($(this).val());
			eDueDate.html(dueDateField.val());
		});

		// Change terms based on two date fields

		var termsSelect = $('.terms');

		function setTerms() {
			var d1 = dateField.datepicker('getDate');
			var d2 = dueDateField.datepicker('getDate');

			// Get the difference between the two dates and then divide by the number of milliseconds in a day	
			//var diff = Math.floor((d2.getTime() - d1.getTime()) / 86400000);

			// Get the difference between two dates

			var timeDiff = Math.abs(d2.getTime() - d1.getTime());
			var diff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

			// Loop through the dropdown of terms to see if the difference exists. If it does, set that option to selected
			var exists = false;
			$('.terms option').each(function() {
				var $this = $(this);
				if ($this.data('term') === diff) {
					exists = true;
					termsSelect.val($this.text());
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
				terms.append('<option disabled>──────────</option><option ' + dataTerm + ' selected="selected">' + diff + ' ' + plural + '</option>');
				
			}
		}

		// Change the terms dropdown when the due date changes
		dueDateField.on('change', function() {
			setTerms();

			setMaxDate();
			eDate.html(dateField.val());
			eDueDate.html($(this).val());
		});


		// Add Date and Due Date inside invoice editor.
		var eDate = $('#e-date'),
			eDueDate = $('#e-duedate');


		if (editing) {
			var invoiceDate = dateField.attr('date');
			dateField.datepicker('setDate', invoiceDate);

			setMinDate();

			var invoiceDueDate = dueDateField.attr('date');
			dueDateField.datepicker('setDate', invoiceDueDate);

			if (isInvoicePage) {
				setMaxDate();
			} else {
				removeMaxDate();
			}

			setTerms();

		} else {
			setDueDate();
		}		


		eDate.html(dateField.val());
		eDueDate.html(dueDateField.val());

		var mobileSidebarWrapper = $('#mobilesidebarwrapper'),
			contentWrapper = $('#contentwrapper'),
			mobileSidebarButton = $('#mobilesidebar'),
			homePageWrapper = $('#pagewrapper');

		function toggleMobileSidebar() {
			
			mobileSidebarButton.toggleClass('open');
			mobileSidebarWrapper.toggleClass('open');
			contentWrapper.toggleClass('sidebaropen');
			homePageWrapper.toggleClass('sidebaropen');

		}

		function showMobileSidebar() {
			mobileSidebarButton.addClass('open');
			mobileSidebarWrapper.addClass('open');
			contentWrapper.addClass('sidebaropen');
			homePageWrapper.addClass('sidebaropen');
		}

		eDate.on('click focus keydown', function(e) {
			e.preventDefault();
			var $this = $(this);
			if (window.innerWidth <= 1020) {
				if (!mobileSidebarWrapper.hasClass('open')) {
					$this.blur();
					showMobileSidebar();
					setTimeout(function(){
						dateField.datepicker('show');
					}, 500);

				}
			} else {
				$this.blur();
				dateField.focus();
			}
		});



		eDueDate.on('click keydown', function(e) {
			e.preventDefault();
			var $this = $(this);
			if (window.innerWidth <= 1020) {
				if (!mobileSidebarWrapper.hasClass('open')) {
					$this.blur();
					showMobileSidebar();
					setTimeout(function(){
						dueDateField.datepicker('show');
					}, 500);

				}
			} else {
				$this.blur();
				dueDateField.focus();
			}
		});


		eDueDate.on('focus', function() {
			$(this).blur();
		})

		dateField.on('focus', function() {
			if (!mobileSidebarWrapper.hasClass('open') && window.innerWidth <= 1020) {
				dateField.datepicker('hide');
			}
		});

		dueDateField.on('focus', function() {
			if (!mobileSidebarWrapper.hasClass('open') && window.innerWidth <= 1020) {
				dueDateField.datepicker('hide');
			}
		});

		pageBody.on('click', '.datecontrol', function() {
			dateField.datepicker('show');
		});

		pageBody.on('click', '.duedatecontrol', function() {
			dueDateField.datepicker('show');
		});

		$document.on("click", function(e) {
		    var elem = $(e.target);
		    if(!elem.hasClass("hasDatepicker") && 
		        !elem.hasClass("ui-datepicker") && 
		        !elem.hasClass("ui-icon") && 
		        !elem.hasClass("ui-datepicker-next") && 
		        !elem.hasClass("ui-datepicker-prev") && 
		        !elem.hasClass("datecontrol") && 
		        !elem.hasClass("duedatecontrol") && 
		        !elem.is("#e-date") && 
		        !elem.is("#e-duedate") && 
		        !$(elem).parents(".ui-datepicker").length){
		            $('.hasDatepicker').datepicker('hide');
		    }
		});

		
		// Set focus to content editable when td is clicked

		var jobsTable = $('#invoiceitems table');

		jobsTable.on('click', 'td', function() {
			$(this).children('[contenteditable=true]').trigger('focus');
		});


		// Prevent scientific notation

		function toFixed(x) {
		  if (Math.abs(x) < 1.0) {
		    var e = parseInt(x.toString().split('e-')[1]);
		    if (e) {
		        x *= Math.pow(10,e-1);
		        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
		    }
		  } else {
		    var e = parseInt(x.toString().split('+')[1]);
		    if (e > 20) {
		        e -= 20;
		        x /= Math.pow(10,e);
		        x += (new Array(e+1)).join('0');
		    }
		  }
		  return x;
		}


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
				total = toFixed(total);
				amountCell.html('$ ' + (total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
			} else {
				amountCell.empty();
			}
		}



		// Calculate invoice total

		var totalBox = $('#invoiceamount');
		var totalHiddenField = $('#invoice_total');

		function calculateTotal() {
			var invoiceTotal = 0,
				addValue;

			$('.amountbox').filter(':visible').each(function() {
				addValue = Number($(this).html().replace(/[^0-9\.]+/g, ""));
				invoiceTotal += addValue;
			});

			if (hasTaxToggle.is(':checked') && !taxInclusionCheckbox.is(':checked')) {
				var taxValue = (parseFloat(taxAmount.text()) / 100) + 1
				invoiceTotal *= taxValue;
			}

			invoiceTotal = parseFloat(Math.round(invoiceTotal * 100) / 100).toFixed(2);

			if (!isNaN(invoiceTotal)) {
				invoiceTotal = toFixed(invoiceTotal);
				var totalText = invoiceTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				totalHiddenField.val(invoiceTotal);
				totalBox.html('$ ' + totalText);
			} else {
				totalHiddenField.val('0.00');
				totalBox.html('$ 0.00');
			}

		}

		calculateTotal();
		toggleTax();

		jobsTable.on('keyup blur', '.quantitycell', function() {
			calculateSubtotal('quantity', $(this));
			calculateTotal();
		});

		jobsTable.on('keyup blur', '.ratecell', function() {
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

		
		// Internet Explorer 11 and below do not handle position: absolute in a table cell well

		var isIE = pageBody.hasClass('windows internet explorer');

		function setJobControlsHeight() {
			if (isIE) {
				var jobControls = $('.jobcontrols').filter(':visible');

				jobControls.each(function() {
					var $this = $(this);
					var parentCell = $this.parent('.amountcell');
					var initialHeight = parentCell.outerHeight();
					var parentBottomOffset = parentCell.offset().top + initialHeight;
					
					$this.outerHeight(initialHeight);

					var thisBottomOffset = $this.offset().top + $this.outerHeight();

					if (thisBottomOffset != parentBottomOffset) {
						$this.outerHeight(initialHeight + 1);
					}

				});

				if (jobControls.length >= 1) {
					var lastControl = jobControls.last();
					lastControl.css({
						'height': lastControl.outerHeight() + 1
					});
				}

				
			}	
		}

		setJobControlsHeight();


		// Update the name attributes on each of the inputs in the jobs table to ensure everything saves correctly

		function updateNameValues() {
			var i = "-1"; // Value used to set the number in the name of each input field [0], [1], etc. Start at -1 to ignore the first row

			$('#invoiceitems tr').each(function() {
				var $this = $(this);

				$this.find('.job-description-box').attr('name','invoice[jobs_attributes][' + i + '][job_description]');
				$this.find('.job-quantity-box').attr('name','invoice[jobs_attributes][' + i + '][job_quantity]');
				$this.find('.job-rate-box').attr('name','invoice[jobs_attributes][' + i + '][job_rate]');
				
				if($this.find('.delete').hasClass('existing')) {
					var hiddenInput = $this.find('input[type="hidden"]');
					hiddenInput.attr('name','invoice[jobs_attributes][' + i + '][will_delete]');
				}

				i++
			})
		}


		// Add a new job item row when the insert button is clicked

		var afterContent = '<tr changed="false" class="jobrow"> <td align="left" class="jobdescriptioncell"> <textarea class="job-description-box"></textarea> <span class="e-jobdescription job_description" contenteditable="true" placeholder="Type a job description"></span> </td><td align="right" class="quantitycell"> <input type="text" class="job-quantity-box"> <span class="e-quantity job_quantity" contenteditable="true" placeholder="Quantity"></span> </td><td align="right" class="ratecell"> <input type="text" class="job-rate-box"> <span class="e-rate job_rate" contenteditable="true" placeholder="Rate"></span> </td><td align="right" class="amountcell"> <div class="amountbox"></div><div class="jobcontrols"> <div class="delete"></div><div class="insert"></div></div></td></tr>';

		jobsTable.on('click', '.insert', function() {
			var $this = $(this);
			var row = $this.parents('tr');

			//var descriptionContent = row.find('.e-jobdescription').text();
			//row.find('.job-description-box').val(descriptionContent);

			row.after(afterContent);

			row.next('tr').find('.e-jobdescription').focus();
		
			contentEditable = $('[contenteditable=true]');

			updateNameValues();
			checkLastRow();
			setBorders();
			preventPasting();
			setJobControlsHeight();
		});

		// When editing and the delete button is clicked. Change the hidden field to true to set the item up for deletion

		//$('.existing').on('click', function() {
		//	var hiddenInput = $(this).parents('tr').children(':input');
		//});

		// Keep track of what rows have changed

		jobsTable.on('keyup', 'span', function() {
			$(this).parents('tr').attr('changed', 'true');
			setJobControlsHeight();
		});


		// Set the first and last visible rows' jobcontrols to have correct borders

		function setBorders() {
			var jobsRows = jobsTable.find('.jobrow');
			var visibleJobRows = jobsRows.filter(':visible');

			jobsRows.each(function() {
				$(this).removeClass('firstrow lastrow');
			});

			visibleJobRows.first().addClass('firstrow');
			visibleJobRows.last().addClass('lastrow');
		}

		setBorders();

		// Delete job item row after delete button is clicked

		function deleteRow(el) {
			var tableRow = el.parents('tr');
			
			if (editing) {
				if (el.hasClass('existing')) {
					el.next(':input').attr('value','true');
					tableRow.hide();
				} else {
					tableRow.remove();
				}

				
				//tableRow.find(':input').val('1');
				
			} else if (creating) {
				tableRow.remove();
			}
		}

		jobsTable.on('click', '.delete', function() {
			var $this = $(this);
			var hasBeenEdited = $this.parents('tr').attr('changed');
			
			if ($this.hasClass('disabled')) {
				return false;
			} else if (hasBeenEdited === 'false') {
				deleteRow($this);
			} else {
				var confirmation = confirm('Are you sure you would like to delete this job?');
				if (confirmation) {
					deleteRow($this);
				} else {
					return false;
				}
			}

			calculateTotal();
			updateNameValues();
			checkLastRow();
			setBorders();
			setJobControlsHeight();
		});


		// Prevent the last job row from being deleted

		function checkLastRow() {
			var rowCount = $('#invoiceitems table tr:visible').length;
			if (rowCount === 2) {
				$('.delete').addClass('disabled');
			} else {
				$('.delete').removeClass('disabled');
			}
		}

		checkLastRow();


		// Focus notes row when section is clicked

		$('#notes').on('click', function() {
			$(this).find('#e-notes').focus();
		});

		// Select all of the span's content when user is tabbing to mimic the functionality of input fields.

		$('#invoice').on("keydown", '[contenteditable=true]', function(e) {
			var keyCode = e.keyCode || e.which;

			var $this = $(this);

			if (keyCode == 9 && e.shiftKey) {
				e.preventDefault();
				var prevVal = contentEditable.eq(contentEditable.index(this) - 1);
				prevVal.focus();
				document.execCommand('selectAll', false, null);

			} else if (keyCode == 9) {
				e.preventDefault();
				var nextVal = contentEditable.eq(contentEditable.index(this) + 1);
				nextVal.focus();
				document.execCommand('selectAll', false, null);
			}

		});



		// Ensure correct tab order after due date field tabbed

		dueDateField.on("keydown", function(e) {
			var keyCode = e.keyCode || e.which;

			if (keyCode == 9 && !e.shiftKey) {
				e.preventDefault();
				$('#e-clientname').focus();
			}
		});


		// Set notes section to the content of the hidden text field

		var notesText = $('#invoice_notes').val();
		$('#e-notes').html(notesText);


		$('span').each(function() {
			var $this = $(this);
			$this.htmlClean();
			if (!$this.text().replace(/\s/g, '').length) {
				$this.html('')
			}
		});


		// Only run code related to logo if the user has one uploaded

		if ($('#invoicelogo').length) {

			var hasLogo = $('#haslogo'),
				noLogo = $('#nologo');

			var newUrl = $('.addlogobutton').attr('data-logo-url');

			var currentLogo =  $('.addlogobutton').attr('data-logo-url');
			var oldLogo = $('.invoicelogoimage').attr('src');

			if (newUrl === '') {
				currentLogo = oldLogo;
			}

			// Save logo URL
			var logoField = $('#invoice_logo');
			var logoURL = logoField.val();

			$('.removelogo').on('click', function() {

				hasLogo.hide();
				noLogo.show();
				logoField.val('');
				$('#logoresize').removeAttr('style');

			});

			$('.addlogobutton').on('click', function() {

				resetLogoSize();
				hasLogo.show();
				noLogo.hide();

				$('#haslogo img').attr('src', currentLogo);
				logoURL = currentLogo;

				logoField.val(logoURL);

				setHiddenFieldDimensions();

			});


			// Allow logo to be resized;

			var logoDiv = $('#logoresize')
			var logo = $('#logoresize img');

			var logoOriginalWidth;
			var logoOriginalHeight;

			var logoSectionWidth = $('#invoicelogo').outerWidth();

			function getLogoSectionWidth() {
				logoSectionWidth = $('#invoicelogo').outerWidth();
			}

			var logoWidthField = $('.logowidthfield');
			var logoHeightField = $('.logoheightfield');

			function setHiddenFieldDimensions() {
				logoWidthField.val(Math.round(logoDiv.width()));
				logoHeightField.val(Math.round(logoDiv.height()));
				
			}

			logoDiv.resizable({
				minWidth: 50,
				minHeight: 50,
				maxWidth: logoSectionWidth,
				aspectRatio: true,
				resize: function(event, ui) {
					setHiddenFieldDimensions()
				},
				start: function() {
					logoDiv.addClass('isresizing');
				},
				stop: function() {
					logoDiv.removeClass('isresizing');
				}
			});

			logo.on('load', function() {
				logoOriginalWidth = logo.width();
				logoOriginalHeight = logo.height();

				logoDiv.css({
					width: logoOriginalWidth,
					height: logoOriginalHeight
				});

				logo.css({
					width: '100%',
					height: '100%'
				});

			});

			function getHeight(oldWidth,oldHeight,newWidth) {
				return (oldHeight * newWidth) / oldWidth;
			}

			var hasShrunkResize = false;
			var beforeShrunkWidth;

			var previousBrowserWidth = $(window).width();

			$(window).on('resize', function() {
				getLogoSectionWidth();
				logoDiv.resizable("option", "maxWidth", logoSectionWidth);

				if (logoDiv.outerWidth() > logoSectionWidth) {
					if (!hasShrunkResize) {
						beforeShrunkWidth = logoDiv.width();
						hasShrunkResize = true;
					}

					setAspectHeight();

					
					
				}

				if (hasShrunkResize && ($(window).width() > previousBrowserWidth)) {
					//hasShrunkResize = false;
					
					if (logoDiv.outerWidth() < logoSectionWidth && logoDiv.width() < beforeShrunkWidth) {

						setAspectHeight();

					}

				}


			});

			function setAspectHeight() {
				var oldWidth = logoDiv.width();
				logoDiv.css('width', logoSectionWidth);
				var newWidth = logoDiv.width();
				var oldHeight = logoDiv.height();

				var newHeight = getHeight(oldWidth, oldHeight, newWidth);
				logoDiv.css('height', newHeight);
				previousBrowserWidth = $(window).width();
			}
			
			function resetLogoSize() {
				hasShrunkResize = false;
				

				if (logoOriginalWidth === 0 || logoOriginalHeight === 0) {
					logoOriginalWidth = logo.attr('data-width');
					logoOriginalHeight = logo.attr('data-height');
				}

				if (currentLogo === oldLogo) {

					if (logoOriginalWidth === 'null' || logoOriginalHeight === 'null') {
						logoDiv.css({
							width: '100%',
							height: 'auto'
						});

						logo.css({
							width: '100%',
							height: 'auto'
						});
					} else {
						if (logoOriginalWidth > logoSectionWidth) {
							var newHeight = getHeight(logoOriginalWidth, logoOriginalHeight, logoSectionWidth);
							logoDiv.css({
								width: logoSectionWidth,
								height: newHeight
							});
						} else {
							logoDiv.css({
								width: logoOriginalWidth,
								height: logoOriginalHeight
							});
						}
					}


				} else {
					logoDiv.css({
						width: '100%',
						height: 'auto'
					});
				}
				
			}


		// End logo code	
		}


		



	}

	// Code just for the show page

	if (showing) {

		$('span').each(function() {

			var $this = $(this);

			if (!$this.text().replace(/\s/g, '').length) {

				if ($this.prev('br').length) {
					$this.prev('br').remove();
				} else {
					$this.next('br').remove();
				}

				if (!$this.parent().is('#mobilesidebar')) {
					$this.remove();
				}
			}

		});
		
		var notesSection = $('#e-notes');

		if (notesSection.is(':empty')) {
			notesSection.parent('section').remove();

			$('#invoicetotal').css('border-bottom','none');

		}

	}

});

