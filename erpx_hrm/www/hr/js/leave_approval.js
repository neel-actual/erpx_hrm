$(document).ready(function () {
	$('.approve_leave').click(function(){
		let doctype = "Leave Application";
		let name = $(this).attr("data-name");
		frappe.ajax({
			type: "PUT",
			url: `/api/resource/${doctype}/${name}`,
			args: {
				"status": "Approved",
				"docstatus" : 1
			},
			callback: function (r) {
				if (!r.exc) {
					M.toast({
						html: "Updated Successfully!"
					})
					location.reload(true);
				}
			}
		});
		return false;
	});

	$('.reject_leave').click(function(){
		let doctype = "Leave Application";
		let name = $(this).attr("data-name");
		frappe.ajax({
			type: "PUT",
			url: `/api/resource/${doctype}/${name}`,
			args: {
				"status": "Rejected",
				"docstatus" : 1
			},
			callback: function (r) {
				if (!r.exc) {
					M.toast({
						html: "Updated Successfully!"
					})
					location.reload(true);
				}
			}
		});
		return false;
	});

	$('.delete_leave').click(function(){
		let doctype = "Leave Application";
		let name = $(this).attr("data-name");
		let docstatus = $(this).attr("data-docstatus");
		if(docstatus!=1){
			// delete_leave(name);
		}else{
			cancel_leave(name);//.then(delete_leave(name));
		}
		return false;
	});
});

var delete_leave = function(name){
	let doctype = "Leave Application";
	frappe.ajax({
		type: "DELETE",
		url: `/api/resource/${doctype}/${name}`,
		callback: function (r) {
			M.toast({
				html: __("Deleted Successfully!")
			});
			location.reload(true);
		}
	});
}

var cancel_leave = function(name){
	let doctype = "Leave Application";
	return frappe.ajax({
		type: "PUT",
		url: `/api/resource/${doctype}/${name}`,
		args: {
			"docstatus" : 2
		},
		callback: function (r) {
			M.toast({
				html: __("Deleted Successfully!")
			});
			location.reload(true);
		}
	});
}