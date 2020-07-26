// Copyright (c) 2020, Neel Singh and contributors
// For license information, please see license.txt

frappe.ui.form.on('Update Leave Balance', {
	// refresh: function(frm) {

	// }
	leave_type: function(frm) {
		get_leave_allocation(frm);
	},
	employee: function(frm) {
		get_leave_allocation(frm);
	}
});

var get_leave_allocation = function(frm){
	if(frm.doc.leave_type && frm.doc.employee){
		frappe.call({
			method: "erpx_hrm.utils.leave_application.get_leave_allocation",
			args: {
				employee: frm.doc.employee,
				leave_type: frm.doc.leave_type
			},
			callback: function (r) {
				if(r.message){
					var data = r.message;
					if(data.name)
						frm.set_value("leave_allocation", r.message.name);
					if(data.from_date)
						frm.set_value("from_date", r.message.from_date);
					if(data.to_date)
						frm.set_value("to_date", r.message.to_date);
					if(data.total_leaves_allocated)
						frm.set_value("current_cycle", r.message.total_leaves_allocated);					
					get_total_balance(frm);
				}else{
					frappe.msgprint(__("Can not find match Leave Allocation"));
					frm.set_value("leave_allocation", "");
				}				
			}
		});
	}
}

var get_total_balance = function(frm){
	console.log("get_total_balance");
}
