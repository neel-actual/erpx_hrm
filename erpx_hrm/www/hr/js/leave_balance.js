$(document).ready(function () {	
	if(glb_employee!=""){
		$('#frmUpdateLeaveBalance #hCurrentEmployeeName').val(glb_employee);
		$("#filter_employee").val(glb_employee);
		get_balance_summary(glb_employee);
		get_balance_history_change(glb_employee);
	}
	$("#filter_employee").change(function(){
		get_balance_summary($(this).val());	
		get_balance_history_change($(this).val());
	});

	$('#file-request').change(function(){
		if($(this).val() != ''){
			$('#btn_import').show();
		}else
			$('#btn_import').hide();
	});

	//Import leave balance
	$('#btn_import').click(function(){
		var file = $("#file-request").get(0).files[0];
		if (file){
			var reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (evt) {
				var csv = evt.target.result;
				if(csv){
					var lines = csv.split(/\r\n|\n/);
					var data = [];
					var employee = '', leave_type = '', new_balance = '';
					for (var j=1; j<lines.length; j++) {
						var values = lines[j].split(','); 						
						if(values.length != 3) continue;

						employee = values[0] ? values[0] : '';
						leave_type = values[1] ? values[1] : '';
						new_balance = values[2] ? values[2] : '';

						if(employee != '' && leave_type != '' && new_balance != ''){
							data.push({
								employee: employee,
								leave_type: leave_type,
								new_balance: new_balance
							});
						}
					}					

					frappe.call({
						method: "erpx_hrm.utils.leave_application.import_update_leave_balance",
						args: {
							data: data													
						},
						callback: function (r) {
							location.reload();	
						}
					});
				}
			}
			reader.onerror = function (evt) {
				M.toast({
					html: "Error on read file content!"
				});	
			}
		}else{
			M.toast({
				html: "Please upload file to import!"
			});		
		}
	});
});
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

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
						employee: employee,
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
					get_balance_history_change(employee);										
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

var get_balance_history_change = function(employee){
	if(!employee || employee == '')	return;
	
	$("#collapse-table").html(`
		<li>
                <table style="font-size: 14px;" >
                  <tr style="border-bottom: 1px solid lightgray !important;font-size: 14px;background-color: #f9f9f9; width: 100%!important;" >

                    <th style="border-right:none!important;width: 300px;">Type</th>
                    <th style="border-right:none!important;">Updated Date</th>
                    <th style="border-right:none!important;">Before</th>
                    <th style="border-right:none!important;">After</th>

                  </tr>
                </table>
              </li>  
	`);
	frappe.call({
        method: "erpx_hrm.utils.leave_application.get_balance_history",
        args: {
			employee: employee			
        },
        callback: function (r) {			
			let i = 0;
			if(r.message)
				if(Object.keys(r.message).length >0){
					$.each( r.message, function( key, val ) {					
						$(`
						<li>
						<div class="collapsible-header" style="padding: 0 !important;">
						<table>
							<tr style="font-size: 13px;" class="collapsible" data-collapsible="accordion">
							<td style="width: 300px;">
							${val.leave_type || ''}
							</td>
							<td>${val.posting_date || ''}</td>
							<td>
							${val.current_cycle || ''} days
							</td>
							<td>${val.new_balance || ''} days</td>
							</tr>
						</table>
						</div>
						<div class="collapsible-body" style="padding:0 !important;">
						<div>
							<table>
							<tbody style="border:none !important;">
							<tr style="font-size: 13px;">
								<td style="width: 100px;">
								Reason
								</td>
								<td style="width: 50px;">
								:
								</td>
								<td >
								${val.reason || ''}
								</td>
							</tr>
							</tbody>
							</table>
						</div>
						</div>
					</li>
						`).appendTo($("#collapse-table"));
					});
				}else{
					$("#collapse-table").empty();
				}		
        }
    });
}