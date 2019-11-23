/*================================================================================
	Item Name: Materialize - Material Design Admin Template
	Version: 5.0
	Author: PIXINVENT
	Author URL: https://themeforest.net/user/pixinvent/portfolio
================================================================================

NOTE:
------
PLACE HERE YOUR OWN JS CODES AND IF NEEDED.
WE WILL RELEASE FUTURE UPDATES SO IN ORDER TO NOT OVERWRITE YOUR CUSTOM SCRIPT IT'S BETTER LIKE THIS. */

frappe.provide("frappe");
$.extend(frappe, {
	ajax: function(opts) {
		if (typeof arguments[0]==='string') {
			opts = {
				url: arguments[0],
				args: arguments[1],
				callback: arguments[2]
			}
		}

		frappe.prepare_call_ajax(opts);

		return $.ajax({
			type: opts.type || "POST",
			url: opts.url,
			data: opts.args,
			dataType: "json",
			headers: { "X-Frappe-CSRF-Token": frappe.csrf_token },
			statusCode: opts.statusCode || {
				404: function() {
					frappe.msgprint(__("Not found"));
				},
				403: function() {
					frappe.msgprint(__("Not permitted"));
				},
				200: function(data) {
					if(opts.callback)
						opts.callback(data);
					if(opts.success)
						opts.success(data);
				}
			}
		}).always(function(data) {
			if(opts.freeze) {
				frappe.unfreeze();
			}

			// executed before statusCode functions
			if(data.responseText) {
				try {
					data = JSON.parse(data.responseText);
				} catch (e) {
					data = {};
				}
			}
			frappe.process_response(opts, data);
		});
	},
	prepare_call_ajax: function(opts) {
		if(opts.btn) {
			$(opts.btn).prop("disabled", true);
		}

		if(opts.msg) {
			$(opts.msg).toggle(false);
		}

		if(!opts.args) opts.args = {};

		// method
		if(opts.method) {
			opts.args.cmd = opts.method;
		}

		// stringify
		opts.args = {"data":JSON.stringify(opts.args)};

		if(!opts.no_spinner) {
			//NProgress.start();
		}
	},
    process_response: function(opts, data) {
		//if(!opts.no_spinner) NProgress.done();

		if(opts.btn) {
			$(opts.btn).prop("disabled", false);
		}

		if (data._server_messages) {
			var server_messages = JSON.parse(data._server_messages || '[]');
			server_messages = $.map(server_messages, function(v) {
				// temp fix for messages sent as dict
				try {
					return JSON.parse(v).message;
				} catch (e) {
					return v;
				}
			}).join('<br>');

			if(opts.error_msg) {
				$(opts.error_msg).html(server_messages).toggle(true);
			} else {
				M.toast({
					html: server_messages
				})
			}
		}

		if(data.exc) {
			try {
				var err = JSON.parse(data.exc);
				if($.isArray(err)) {
					err = err.join("\n");
				}
				console.error ? console.error(err) : console.log(err);
			} catch(e) {
				console.log(data.exc);
			}

		} else{

		}
		if(opts.msg && data.message) {
			$(opts.msg).html(data.message).toggle(true);
		}

		if(opts.always) {
			opts.always(data);
		}
	}
});