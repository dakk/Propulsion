(function($){
	$.fn.tree = function() {
		this.find('li:not(.item)').each(function() {
			var $this,$menu,$title,$arrow;
			
			$this = $(this);
			$this.addClass('submenu');
			$title = $this.children('div.menu_title:first');
			$arrow = $title.children('div.arrow:first');
			$menu = $this.children('ul:first');
			$menu.hide();
			$title.click(function() {
				if ($arrow.hasClass('right_arrow')) {
					$arrow.removeClass('right_arrow');
					$arrow.addClass('down_arrow');
				} else {
					$arrow.removeClass('down_arrow');
					$arrow.addClass('right_arrow');
				}
				$menu.slideToggle('fast');
			});
		});
	};
})(jQuery);