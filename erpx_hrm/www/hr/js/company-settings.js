$(document).ready(function () {
	$("#file-change-logo").on('change', function() {
		var file = this.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			var srcBase64 = reader.result;
			frappe.ajax({
				type: "POST",
				url: `/api/method/erpx_hrm.utils.company.upload_company_logo`,
				no_stringify: 1,
				args: {
					filename : file.name,
					filedata : srcBase64
				},
				callback: function (r) {
					if (!r.exc_type) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		};
		reader.readAsDataURL(file);
	});
});
var rename_company_name = function(){
	var old_name = company_name;
	var new_name = $("#company_name").val();
	if(new_name){
		frappe.ajax({
			type: "POST",
			url: `/api/method/frappe.model.rename_doc.rename_doc`,
			no_stringify: 1,
			args: {
				"doctype": "Company",
				"merge": 0,
				"old": old_name,
				"new": new_name
			},
			callback: function (r) {
				if (r.message) {
					M.toast({
						html: "Updated Successfully!"
					})
					location.reload();
				}
			}
		});
	}	
};
