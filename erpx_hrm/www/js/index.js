var _val = $.fn.val;
$.fn.val = function (value) {
    var self = $(this);
	var select = self.hasClass("datepicker");
    if (value === undefined) {
			if(select){
				let o =  _val.apply(this, arguments);
				if(typeof o =="string" && o){
					let o2 = o.split('-');
					return o2[2] + "-" + o2[1] + "-" + o2[0];
				}
				return o;			
			}else{
				return  _val.apply(this, arguments);
			}        
    } else {
        return _val.apply(this, arguments);
    }
} 

$(document).ready(function () {
	$('.datepicker').datepicker({
		format: "dd-mm-yyyy"
   });
	// var isFirefox = typeof InstallTrigger !== 'undefined';
	// //Hide 
	// if (isFirefox) {
	// 	$(".firefox").show();
	// } else {
	// 	$(".firefox").hide();
	// }

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

	//set avatar
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
			get_value: function (doctype,fieldname,filters) {
				return new Promise(function (resolve, reject) {
					try {
						frappe.call({
							method: FRAPPE_CLIENT + '.get_value',
							args: {
								doctype: doctype,
								fieldname: fieldname,
								filters: filters,
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
			},
			custom_update: function (doctype, data) {
				var name,
					clone = Object.assign({}, data);

				return new Promise(function (resolve, reject) {
					try {
						name = clone.name;
						delete clone.name; //do not update name
						frappe.call({
							method: 'erpx_hrm.api.set_value_custom',
							args: {
								doctype: doctype,
								name: name,
								fieldname: clone
							},
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},
			get_single_child:function (doctype,fields) {
				// var name,
				// 	clone = Object.assign({}, data);
				// get value of child table from single doctype, Pass value of single doctype and field list from child table and it will return field name and its value as dictionary.

				return new Promise(function (resolve, reject) {
					try {
						
						frappe.call({
							method: "erpx_hrm.api.get_singles",
							args: {
								doctype: doctype,
								fields_list: fields
								
							},
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},
			update_single_child:function (doctype, data) {
				// Update child table value under single doctype
				var parent,
				clone = Object.assign({}, data);

				return new Promise(function (resolve, reject) {
					try {
						parent = clone.name;
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
			},
			add_child_item:function (args) {
				// add row into child table of single doctype

				return new Promise(function (resolve, reject) {
					try {
						
						frappe.call({
							method: "erpx_hrm.api.add_child_item",
							args: args,
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},
			update_child_item:function (args) {
				// update row into child table of single doctype

				return new Promise(function (resolve, reject) {
					try {
						
						frappe.call({
							method: "erpx_hrm.api.update_child_item",
							args: args,
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},

			get_child_item: function (args) {
				// update row into child table of single doctype

				return new Promise(function (resolve, reject) {
					try {
						
						frappe.call({
							method: "erpx_hrm.api.get_child",
							args: args,
							callback: resolve
						});
					} catch (e) { reject(e); }
				});
			},
			get_payroll: function (args) {
				// update row into child table of single doctype

				return new Promise(function (resolve, reject) {
					try {
						
						frappe.call({
							method: "erpx_hrm.api.get_employee_payroll_info",
							args: args,
							callback: resolve
						  });
					} catch (e) { reject(e); }
				});
			}
		}
	}());
});