$(document).ready(function () {
    var $navs = $('#nav-mobile').children().clone();

    $('#slide-out').append($navs);


    window.logout = function() {
		return frappe.call({
			method:'logout',
			callback: function(r) {
				if(r.exc) { return; }
				window.location.href = '/';
			}
		});
	}
});