$(document).ready(function() {

if ($('#pdfinvoicewrapper').length) {

	var pageHeight = 958; 
  
	function getPageNum(el) {
		var elOffset = el.offset().top + el.outerHeight() + 49;
		var pageNum = Math.ceil(parseFloat(elOffset / pageHeight));

		return pageNum
	}

	var currentPageNum = 1

	$('tr').each(function() {
		var $this = $(this);
		//var elOffset = $this.offset().top + $this.outerHeight();
		var pageNum = getPageNum($this);
		//var pageOffset = elOffset - ((pageNum - 1) * pageHeight)
		//var offsetCheck = pageHeight - pageOffset;
		//var prevRow = $this.prevAll('tr').first();

		if (pageNum != currentPageNum) {
			$this.addClass('firstrow');
			$this.prev('td').addClass('lastrow');
			currentPageNum = pageNum;
		}

	});

}

});