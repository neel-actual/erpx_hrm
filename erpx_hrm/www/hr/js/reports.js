$(document).ready(function () {
	$('#btn_profile_download').click(function(){		
		if($("#profile_employee").val()){
			profile_download_one($("#profile_employee").val());
		}else{
			profile_download_all();
		}
	});
})

var profile_download_one = function(employee){
	let url = `/api/method/frappe.utils.print_format.download_pdf?doctype=Employee&name=${employee}&format=Employee&no_letterhead=0&_lang=en`;
	window.open(url, "_blank");
}
var profile_download_all = function(){
	var args = {
		cmd: 'erpx_hrm.utils.query_report.export_query',
		report_name: "Profile Employees",
		file_format_type: "Excel",
		filters: {},
	}

	let url = '/api/method/' + args.cmd + frappe.utils.make_query_string(args, false);
	window.location.href = url;
}