$(document).ready(function () {
	console.log(glb_employee);
	if(glb_employee!=""){
		$('#frmUpdateLeaveBalance #hCurrentEmployeeName').val(glb_employee);
		$("#filter_employee").val(glb_employee);
		get_balance_summary(glb_employee);
	}
	$("#filter_employee").change(function(){
		get_balance_summary($(this).val());	
	});
});


var get_balance_summary = function(employee){
	$("#html_balancesummary").empty();
	$('#frmUpdateLeaveBalance #hCurrentEmployeeName').val(employee);
	frappe.call({
        method: "erpnext.hr.doctype.leave_application.leave_application.get_leave_details",
        args: {
			employee: employee,
			date: moment().format("YYYY-MM-DD")
        },
        callback: function (r) {
			let arrColor = ["blue", "purple", "pink", "red"];
			let i = 0;
			if(Object.keys(r.message.leave_allocation).length >0){
				$.each( r.message.leave_allocation, function( key, val ) {
					let j = i%4;
					console.log(key);
					$(`
						<div onclick="openUpdateLeaveBalance('${key}', '${val.total_leaves}', '${val.remaining_leaves}')" class="col s12 m6 l6 xl3 pt-2" style="min-height:200px; text-align: center;cursor: pointer;">
							<div class="circle ${arrColor[j]}" style="width: 120px; height: 120px;">
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
			}else{
				$("#html_balancesummary").empty();
			}		
        }
    });
}


function saveLeaveBalance(){
	var new_balance = $(`#modal-update #frmUpdateLeaveBalance #new_balance`).val();
	if(new_balance != ''){
		try{
			new_balance = parseFloat(new_balance);
		}catch(err){
			new_balance = -1;
		}
		if(new_balance > -1){	
			var leave_allocation_name = $('#frmUpdateLeaveBalance #hLeave_allocation_name').val();		
			var employee = $('#frmUpdateLeaveBalance #hCurrentEmployeeName').val();			
			var total_balance = $(`#modal-update #frmUpdateLeaveBalance #total_balance`).val();

			//Update Leave allocation
			frappe.call({
				method: "erpx_hrm.utils.leave_application.update_leave_allocation",
				args: {
					employee: employee,
					leave_allocation_name: leave_allocation_name,
					new_balance: new_balance,
					total_balance: total_balance,
					formData: {
						employee_name: $(`#modal-update #frmUpdateLeaveBalance #employee_name`).val(),
						leave_type: $(`#modal-update #frmUpdateLeaveBalance #leave_type`).val(),
						from_date: $(`#modal-update #frmUpdateLeaveBalance #from_date`).val(),
						to_date: $(`#modal-update #frmUpdateLeaveBalance #to_date`).val(),
						current_cycle: $(`#modal-update #frmUpdateLeaveBalance #current_cycle`).val(),
						new_balance: $(`#modal-update #frmUpdateLeaveBalance #new_balance`).val(),
						total_balance: $(`#modal-update #frmUpdateLeaveBalance #total_balance`).val(),
						reason: $(`#modal-update #frmUpdateLeaveBalance #reason`).val()
					}
				},
				callback: function (r) {
					$('#modal-update').modal('close');
					get_balance_summary(employee);										
				}
			});			
		}
	}
}

function openUpdateLeaveBalance(leave_type, currentBalance, remainBalance){	
	var employee = $('#frmUpdateLeaveBalance #hCurrentEmployeeName').val();
	
	if(employee != ''){
		frappe.call({
			method: "erpx_hrm.utils.leave_application.get_leave_allocation",
			args: {
				employee: employee,
				date: moment().format("YYYY-MM-DD"),
				leave_type: leave_type
			},
			callback: function (r) {
				var leave_allocation_name = r.message.name;
				if(leave_allocation_name != ''){
					$('#frmUpdateLeaveBalance #hLeave_allocation_name').val(leave_allocation_name);
					frappe.ajax({
						type: "GET",
						url: `/api/resource/Leave Allocation/${leave_allocation_name}`,
						callback: function (r) {
							var data = r.data;
							$(`#modal-update #frmUpdateLeaveBalance #employee_name`).val(data.employee_name);
							$(`#modal-update #frmUpdateLeaveBalance #leave_type`).val(data.leave_type);
							$(`#modal-update #frmUpdateLeaveBalance #from_date`).val(data.from_date);
							$(`#modal-update #frmUpdateLeaveBalance #to_date`).val(data.to_date);
							$(`#modal-update #frmUpdateLeaveBalance #current_cycle`).val(currentBalance);
							$(`#modal-update #frmUpdateLeaveBalance #new_balance`).val(0);
							$(`#modal-update #frmUpdateLeaveBalance #total_balance`).val(remainBalance);
							$(`#modal-update #frmUpdateLeaveBalance #reason`).val('');
						}
					});
				}				
			}
		});
		$('#modal-update').modal('open');
	}
	
}