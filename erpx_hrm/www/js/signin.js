$(function () {
    "use strict";

    $('.login-form').on('submit', function (e) {
        var args = {};

        e.preventDefault();

        args.cmd = 'login';
		args.usr = frappe.utils.xss_sanitise(($("#username").val() || "").trim());
		args.pwd = $("#password").val();
		args.device = "desktop";
		if(!args.usr || !args.pwd) {

			return false;
		}
		return false;
    });
});