var request_leave_fields = [
	"leave_type",
	"emergency",
	"from_date",
	"to_date",
	"half_day",
	"half_day_shift",
	"half_day_date",
	"description",
	"leave_approver",
	"employee",
	"name",
]

$(document).ready(function () {
	
	$("#half_day").prop("checked", false);
	toggle_div_half_day();
	toggle_div_emergency();

	$('#leave_request_from_date').change(function(){
		toggle_div_half_day();
	});
	$('#leave_request_to_date').change(function(){
		toggle_div_half_day();
	});

	$('#half_day').change(function(){
		toggle_div_half_day();
	});

	$('#leave_request_leave_type').change(function(){
		toggle_div_emergency();
	});

	//Request Leave

	load_leave_approver_select($(`#form-request-leave [data-fieldname="leave_approver"]`), glb_employee);

    $("#btn-request-leave").click(function () {
		var args = {}
        request_leave_fields.forEach(element => {
            if($(`#form-request-leave [data-fieldname="${element}"]`).val()){
				args[element] = $(`#form-request-leave [data-fieldname="${element}"]`).val();
				if(element=="half_day" || element=="emergency"){
					args[element] = $(`#form-request-leave [data-fieldname="${element}"]:checked`).length ? 1 : 0;
				}
            }     
		});

		let name = $(`#form-request-leave [data-fieldname="name"]`).val();

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
		if(!args["half_day"]){
			args["half_day_shift"] = "";
		}else if(!args["half_day_shift"]){
			M.toast({
				html: "Half Day Shift is required"
			})
			return false;
		}

		frappe.ajax({
			type: "PUT",
			url: `/api/resource/Leave Application/${name}`,
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
	});

	$("#file-request").change(function(){
		if($("#file-request").val() != '')
			$('#btn-view-file').show();
		else
			$('#btn-view-file').hide();
	});
});

var toggle_div_emergency = function(){
	
	if($('#leave_request_leave_type').val() == "Annual Leave"){
		$("#div_emergency").show();
		return;
	}
	$("#emergency").prop("checked", false);
	$("#div_emergency").hide();
	
}


var toggle_div_half_day = function(){
	if($("#half_day").is(":checked")){
		$('#div_half_day_shift').show();
	}else{
		$('#div_half_day_shift').hide();
		$("#div_half_day_date").hide();
		$("#leave_request_half_day_date")[0].value="";
		return;
	}
	if(!($('#leave_request_from_date').val() && $('#leave_request_to_date').val())){
		$("#leave_request_half_day_date")[0].value="";
		$("#div_half_day_date").hide();
		return;
	}
	if($('#leave_request_from_date').val() == $('#leave_request_to_date').val()){
		$("#leave_request_half_day_date")[0].value="";
		$("#div_half_day_date").hide();
		return;
	}
	if($("#leave_request_half_day_date").val() == ""){
		$("#leave_request_half_day_date")[0].value= $('#leave_request_from_date').val();
	}
	$("#div_half_day_date").show();	
}

var load_leave_approver_select = function (select_id, employee) {

    var arr = [];

    frappe.call({
        method: "frappe.desk.search.search_link",
        args: {
			query: "erpx_hrm.utils.department_approver.get_approvers",
			doctype: "User",
			txt: "",
			filters: {
				employee: employee,
            	doctype: "Leave Application",
			}            
        },
        callback: function (r) {
			let selected = "";
            r.results.forEach(function(row, index){
				if(index==0){
					selected = row.value;
				}
				arr.push({key:row.value, value: row.value});
			});
            xhrm.utils.optionArray(select_id, arr, selected);
            select_id.formSelect();
        }
    });
}

function editLeaveRequest(name){
	let doctype = "Leave Application";
	frappe.ajax({
		type: "GET",
		url: `/api/resource/${doctype}/${name}`,
		callback: function (r) {
			if (!r.exc) {
				let data = r.data;
				request_leave_fields.forEach(element => {
					$(`#form-request-leave [data-fieldname="${element}"]`).val(data[element]);

					if ($(`#form-request-leave [data-fieldname="${element}"]`).prop("tagName") == "SELECT"){
						$(`#form-request-leave [data-fieldname="${element}"]`).formSelect();
					}
					if(data[element]==1 && (element=="half_day" || element=="emergency")){
						$(`#form-request-leave [data-fieldname="${element}"]`).prop( "checked", true);
						$(`#form-request-leave [data-fieldname="${element}"]`).trigger("change");
					}else{
						$(`#form-request-leave [data-fieldname="${element}"]`).prop( "checked", false);
						$(`#form-request-leave [data-fieldname="${element}"]`).trigger("change");
					}    
				});
				load_leave_approver_select($(`#form-request-leave [data-fieldname="leave_approver"]`), $(`#form-request-leave [data-fieldname="employee"]`).val());
			}
		}
	});
}