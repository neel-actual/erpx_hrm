var request_leave_fields = [
	"leave_type",
	"from_date",
	"to_date",
	"half_day",
	"description",
	"leave_approver"
]

$(document).ready(function () {
	load_leave_approver_select($(`#form-request-leave [data-fieldname="leave_approver"]`), glb_employee);

    $("#btn-request-leave").click(function () {
		var args = {}
        request_leave_fields.forEach(element => {
            if($(`#form-request-leave [data-fieldname="${element}"]`).val()){
				args[element] = $(`#form-request-leave [data-fieldname="${element}"]`).val();
				if(element=="half_day"){
					args[element] = $(`#form-request-leave [data-fieldname="${element}"]:checked`).val() || 0;
				}
            }     
		});
		args.employee = glb_employee;

		if(!args.employee){
			M.toast({
				html: "This user doesn't have employee"
			})
			return false;
		}
		if(!glb_holiday_list){
			M.toast({
				html: "This employee is not set Holiday List"
			})
			return false;
		}		

		frappe.ajax({
			url: "/api/resource/Leave Application",
			args: args,
			callback: function (r) {
				console.log(r);
				if (!r.exc) {
					M.toast({
						html: "Added Successfully!"
					})
					location.reload(true);
				}
			}
		});
	});
});

var load_leave_approver_select = function (select_id, employee) {

    var arr = [];

    frappe.call({
        method: "erpx_hrm.api.get_approvers",
        args: {
            employee: employee,
            doctype: "Leave Application",
        },
        callback: function (r) {
			let selected = "";
            r.message[0].forEach(function(row, index){
				if(index==0){
					selected = row;
				}
				arr.push({key:row, value: row});
			});
            xhrm.utils.optionArray(select_id, arr, selected);
            select_id.formSelect();
        }
    });
}