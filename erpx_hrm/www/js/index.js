$(document).ready(function () {
	var FRAPPE_CLIENT = 'frappe.client',
		CURRENT_URL = location.href
			.replace('http://', '')
			.replace('https://', '')
			.replace(location.host, '')
			.replace(/#$/, '')
			.split('?')[0];

	//initialize materialize
	$('.modal').modal();

	console.log(CURRENT_URL);
	//highlight module
	$('.navbar ul a[href="/' + CURRENT_URL.split('/')[1] + '"]').addClass('active');

	//highlight & expand submodule
	$('.sidenav li a[href="'+ CURRENT_URL + '"]')
		.addClass('active')
		.closest('ul').closest('li').addClass('active open').find('> div').show();

	$('#nav-avatar').html(frappe.avatar());


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
			update: function (doctype, data) {
				var name,
					clone = Object.assign({}, data);

				return new Promise(function (resolve, reject) {
					try {
						name = clone.name;
						delete clone.name; //do not update name
						frappe.call({
							method: FRAPPE_CLIENT + '.set_value',
							args: {
								doctype: doctype,
								name: name,
								fieldname: clone
							},
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			}
		}
	}());
});