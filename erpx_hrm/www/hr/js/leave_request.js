var request_leave_fields = [
	"leave_type",
	"from_date",
	"to_date",
	"half_day",
	"description",
	"leave_approver"
]

$(document).ready(function () {

	//Request History
	var request_history = $('#request_history').DataTable();

	$('#i_filter_leave_type').change(function(){
		var filter_leave_type = $("#i_filter_leave_type").val();
		request_history.column(0).search(filter_leave_type, true, false, false).draw();
	});

	$('.clr-filter').click(function(){
        location.reload(true);
	});
	
	// Summay
	frappe.call({
        method: "erpnext.hr.doctype.leave_application.leave_application.get_leave_details",
        args: {
			employee: glb_employee,
			date: moment().format("YYYY-MM-DD")
        },
        callback: function (r) {
			let arrColor = ["blue", "purple", "pink", "red"];
			let i = 0;
			$.each( r.message.leave_allocation, function( key, val ) {
				let j = i%4;
				$(`
					<div class="col s6 m6 l6 xl3">
						<div class="circle ${arrColor[j]}">
							<div class="card-content center">
								<h4 class="card-stats-number white-text">${val.remaining_leaves}</h4>
								<p class="card-stats-title white-text">
									<span>available</span>
								</p>
							</div>
						</div>
						<p style="margin-top: 10px;text-align: center;">${key}</p>
					</div>
				`).appendTo($("#html_balancesummary"));
				i++;

			});			
        }
    });

	//Request Leave

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