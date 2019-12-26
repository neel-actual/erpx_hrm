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
	ajax: function (opts) {
		if (typeof arguments[0] === 'string') {
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
				404: function () {
					M.toast({
						html: __("Not found")
					})
				},
				403: function () {
					M.toast({
						html: __("Not permitted")
					})
				},
				202: function () {
					if (opts.callback)
						opts.callback();
					if (opts.success)
						opts.success();
				},
				200: function (data) {
					if (opts.callback)
						opts.callback(data);
					if (opts.success)
						opts.success(data);
				}
			}
		}).always(function (data) {
			if (opts.freeze) {
				frappe.unfreeze();
			}

			// executed before statusCode functions
			if (data.responseText) {
				try {
					data = JSON.parse(data.responseText);
				} catch (e) {
					data = {};
				}
			}
			frappe.process_response(opts, data);
		});
	},
	prepare_call_ajax: function (opts) {
		if (opts.btn) {
			$(opts.btn).prop("disabled", true);
		}

		if (opts.msg) {
			$(opts.msg).toggle(false);
		}

		if (!opts.args) opts.args = {};

		// method
		if (opts.method) {
			opts.args.cmd = opts.method;
		}

		// stringify
		if(!opts.no_stringify){
			opts.args = { "data": JSON.stringify(opts.args) };
		}
		
		if (!opts.no_spinner) {
			//NProgress.start();
		}
	},
	process_response: function (opts, data) {
		//if(!opts.no_spinner) NProgress.done();

		if (opts.btn) {
			$(opts.btn).prop("disabled", false);
		}

		if (data._server_messages) {
			var server_messages = JSON.parse(data._server_messages || '[]');
			server_messages = $.map(server_messages, function (v) {
				// temp fix for messages sent as dict
				try {
					return JSON.parse(v).message;
				} catch (e) {
					return v;
				}
			}).join('<br>');

			if (opts.error_msg) {
				$(opts.error_msg).html(server_messages).toggle(true);
			} else {
				M.toast({
					html: server_messages
				})
			}
		}

		if (data.exc) {
			try {
				var err = JSON.parse(data.exc);
				if ($.isArray(err)) {
					err = err.join("\n");
				}
				console.error ? console.error(err) : console.log(err);
			} catch (e) {
				console.log(data.exc);
			}

		} else {

		}
		if (opts.msg && data.message) {
			$(opts.msg).html(data.message).toggle(true);
		}

		if (opts.always) {
			opts.always(data);
		}
	}
});


frappe.provide("xhrm.views");

xhrm.views.ListCRUD = Class.extend({
	init: function (opts) {
		$.extend(this, opts);
	},
	get_doc: function (name) {
		var me = this;
		return frappe.ajax({
			type: "GET",
			url: `/api/resource/${me.doctype}/${name}`
		});
	},
	create_doc: function (args) {
		var me = this;
		frappe.ajax({
			url: `/api/resource/${me.doctype}`,
			args: args,
			callback: function (r) {
				if (!r.exc) {
					M.toast({
						html: "Added Successfully!"
					})
					me.get_list();
				}
			}
		});
	},
	rename_doc: function (args) {
		var me = this;
		frappe.call({
			method: "frappe.model.rename_doc.rename_doc",
			args: args,
			callback: function (r) {
				if (!r.exc) {
					me.get_list();
				}
			}
		});
	},
	update_doc: function (name, args) {
		var me = this;
		frappe.ajax({
			type: "PUT",
			url: `/api/resource/${me.doctype}/${name}`,
			args: args,
			callback: function (r) {
				if (!r.exc) {
					M.toast({
						html: "Updated Successfully!"
					})
					me.get_list();
				}
			}
		});
	},
	get_list: function () {
		var me = this;
		frappe.call({
			method: "frappe.client.get_list",
			args: {
				doctype: me.doctype,
				fields: ["*"],
				limit_page_length: 0
			},
			callback: function (r) {
				if (!r.exc) {
					me.render_list(r.message);
				}
			}
		});
	},
	render_list: function (data) {
		var me = this;
		let html = '';
		if (data.length) {
			html = data.map(me.get_item_html).join('');
		} else {
			html = `<li class="text-center">
					<span class="text-muted">${__('No Item')}</span>
				</li>`;
		}
		me.parent.html(`<ul class="content-width">${html}</ul>`);
		me.bind_event();
	},
	get_item_html: function (item) {
		return `
			<li class="list-item">
				<span>${item.name}
				<a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
					<img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
				</a>
				<a style="float: right; padding-right: 10px;" href="#modal-rename-job" class="btn-rename modal-trigger" data-name="${item.name}" data-modal="modal-rename-job">Edit</a>
				</span>
			</li>
		`;
	},
	bind_event: function () {
		var me = this;
		me.parent.find(".btn-delete").click(function () {
			var name = $(this).attr("data-name");
			var row = $(this).closest(".list-item");
			swal({
				title: "Are you sure you want to delete?",
				icon: 'warning',
				buttons: {
					cancel: true,
					delete: 'Yes, Delete It'
				}
			}).then(function (result) {
				if (result) {
					frappe.ajax({
						type: "DELETE",
						url: `/api/resource/${me.doctype}/${name}`,
						callback: function (r) {
							M.toast({
								html: __("Deleted Successfully!")
							});
							row.remove();
						}
					});
				}
			})
			return false;
		});
		me.parent.find(".btn-rename").click(function () {
			var name = $(this).attr("data-name");
			var modal = $("#" + $(this).attr("data-modal"));
			modal.find("#old_name").val(name);
			modal.find("#new_name").val(name);
		});
	}
});

frappe.provide("xhrm.utils");

xhrm.utils.optionJSON = function (self, newOptions, selectedOption) {
	var self = $(self);
	if (self.prop)
		var options = self.prop('options');
	else
		var options = self.attr('options');

	$('option', self).remove();
	$.each(newOptions, function (val, text) {
		options[options.length] = new Option(text, val);
	});
	self.val(selectedOption);
};


xhrm.utils.optionArray = function (self, newOptions, selectedOption) {
	var self = $(self);
	if (self.prop)
		var options = self.prop('options');
	else
		var options = self.attr('options');

	$('option', self).remove();

	if (options != undefined) {
		$.each(newOptions, function (index, option) {
			options[options.length] = new Option(option.value, option.key);
		});
		self.val(selectedOption);
	}
};

window.__ = function(txt, replace) {
	if(!txt)
		return txt;
	if(typeof(txt) != "string")
		return txt;
	var ret = frappe._messages[txt.replace(/\n/g, "")] || txt;
	if(replace && typeof(replace) === "object") {
		ret = txt.format(replace);
	}
	return ret;
};

String.prototype.format = function() {
	var str = this;
	for (var i = 0; i < arguments.length; i++) {       
	  var reg = new RegExp("\\{" + i + "\\}", "gm");             
	  str = str.replace(reg, arguments[i]);
	}
	return str;
  }