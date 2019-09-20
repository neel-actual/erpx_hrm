$(document).ready(function () {
	var FRAPPE_CLIENT = 'frappe.client';

	//initialize materialize
	$('.modal').modal();

	window.hrm = (function () {

		return {
			//frappe logout
			logout: function () {
				return frappe.call({
					method:'logout',
					callback: function(r) {
						if(r.exc) { return; }
						window.location.href = '/';
					}
				});
			},
			list: function (opts) {
				return new Promise(function (resolve, reject) {
					try {
						frappe.call({
							method: FRAPPE_CLIENT + '.get_list',
							args: {
								doctype: opts.doctype,
								fields: opts.fields,
								filters: opts.filters,
								order_by: opts.order_by,
								limit_start: opts.limit_start,
								limit_page_length: opts.limit_page_length,
								parent: opts.parent
							},
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},
			get: function (opts) {
				return new Promise(function (resolve, reject) {
					try {
						frappe.call({
							method: FRAPPE_CLIENT + '.get',
							args: {
								doctype: opts.doctype,
								name: opts.name,
								filters: opts.filters,
								parent: opts.parent
							},
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},
			upsert: function (doctype, data) {
				return this.get({
					doctype: doctype,
					name: data.name,
				}).then(function (res) {
					var old_data;

					if (res && res.message) {
						old_data = res.message;
						Object.keys(data).forEach(function (key) { old_data[key] = data[key]; });

						return new Promise(function (resolve, reject) {
							try {
								frappe.call({
									method: FRAPPE_CLIENT + '.save',
									args: {
										doc: old_data,
									},
									callback: resolve
								});
							} catch (e) { reject(e); }
						});
					}
					else {
						//TODO: need to insert
					}
				});
			}
		}
	}());
});