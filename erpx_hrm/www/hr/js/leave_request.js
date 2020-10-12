var request_leave_fields = [
	"leave_type",
	"emergency",
	"from_date",
	"to_date",
	"half_day",
	"half_day_shift",
	"half_day_date",
	"description",
	"leave_approver"
]

$(document).ready(function () {

	var request_history = $('#request_history').DataTable({
		"order":[1,'asc'],
		"columnDefs": [
            {
                "targets": [ 1 ],
                "visible": false,
            },
            {
                "targets": [ 2 ],
                "visible": false
            }
        ]
	});

	$('#i_filter_leave_type').change(function(){ 
		var filter_leave_type = $("#i_filter_leave_type").val(); 
		request_history.column(0).search(filter_leave_type, true, false, false).draw();
	});
	
	$('.date-range-filter').change( function() {
		request_history.draw();
	});

	$('.clr_filter_requesthistory').click(function(){		
		$('.i_filter_requesthistory').val("");
		$("#i_filter_leave_type").formSelect();
		request_history.search('').columns().search('').draw();
	});

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
					<div class="col s6 m6 l6 xl4 pt-2" style="min-height:180px">
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
				if(element=="half_day" || element=="emergency"){
					args[element] = $(`#form-request-leave [data-fieldname="${element}"]:checked`).length ? 1 : 0;
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
		
		if(!args["half_day"]){
			args["half_day_shift"] = "";
		}else if(!args["half_day_shift"]){
			M.toast({
				html: "Half Day Shift is required"
			})
			return false;
		}

		frappe.ajax({
			url: "/api/resource/Leave Application",
			args: args,
			callback: function (r) {
				upload_file_request(r);				
			}
		})
	});

	$("#file-request").change(function(){
		if($("#file-request").val() != '')
			$('#btn-view-file').show();
		else
			$('#btn-view-file').hide();
	});

	//Clone leave
	console.log(glb_leave_name);
	if(glb_leave_name!=""){
		cloneLeaveRequest(glb_leave_name);
	}	
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

var upload_file_request = function(r){
	if (!r.exc) {
		var doc = r.data;
		var file = $("#file-request").get(0).files[0];
		
		if (file){
			var reader = new FileReader();
			reader.onload = function(){
				var srcBase64 = reader.result;
				frappe.ajax({
					type: "POST",
					url: `/api/method/erpx_hrm.utils.frappe.upload_file`,
					no_stringify: 1,
					args: {
						name : "file",
						filename : file.name,
						filedata : srcBase64,
						doctype: "Leave Application",
						docname: doc.name,
						folder: "Home/Attachments",
						is_private: 1,
						from_form : 1
					},
					callback: function (r) {
						if (!r.exc_type) {
							M.toast({
								html: "Added Successfully!"
							})
							location.reload();
						}
					}
				});
			};
			reader.readAsDataURL(file);
		}else{
			M.toast({
				html: "Added Successfully!"
			})
			location.reload();
		}
	}
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

// Extend dataTables search
$.fn.dataTable.ext.search.push(
	function (settings, data, dataIndex) {
		let min = $('#i_filter_from_date').val();
		let max = $('#i_filter_to_date').val();
		let from_date = data[1];
		let to_date = data[2];
		
		if( min!="" && moment(from_date).isBefore(min)	){
			return false;
		}
		if( max!="" && moment(to_date).isAfter(max)	){
			return false;
		}
		return true;
	}
);

function openUploadFile(){	
	if($("#file-request").val() != ''){						
		window.open((window.URL || window.webkitURL).createObjectURL($("#file-request").get(0).files[0]), '_blank');
	}		
}

function copyLeaveRequest(name){
	window.location.href = "/hr/leave-request?name="+name;
}

function cloneLeaveRequest(name){
	let doctype = "Leave Application";
	frappe.ajax({
		type: "GET",
		url: `/api/resource/${doctype}/${name}`,
		callback: function (r) {
			if (!r.exc) {
				M.toast({
					html: "Copied this leave. Please review and submit it.!"
				})
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
			}
		}
	});
}