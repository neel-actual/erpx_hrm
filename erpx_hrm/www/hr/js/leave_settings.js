var leave_period_fields = [
	"from_date",
	"to_date",
	"company",
	"is_active",
	"optional_holiday_list"
]

$(document).ready(function () {
	$("#btn-save-leave-period").click(function () {
		let name = $(`#form-leave-period [data-fieldname="name"]`).val();
		var args = {}
        leave_period_fields.forEach(element => {
            args[element] = $(`#form-leave-period [data-fieldname="${element}"]`).val();   
		});

		args["is_active"] = 1;
		
		if (!name){
			frappe.ajax({
				url: "/api/resource/Leave Period",
				args: args,
				callback: function (r) {
					M.toast({
						html: "Added Successfully!"
					})
					location.reload();		
				}
			})
		}else{
			frappe.ajax({
				type: "PUT",
				url: `/api/resource/Leave Period/${name}`,
				args: args,
				callback: function (r) {
					if (!r.exc) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		}		
	});
});
