$(document).ready(function () {
	var employee_list = $('#employee_list').DataTable({
        
    });

    $('#i_filter_job_title').change(function(){ 
		var i_filter_job_title = $("#i_filter_job_title").val(); 
		employee_list.column(1).search(i_filter_job_title, true, false, false).draw();
    });
    $('#i_filter_department').change(function(){ 
		var i_filter_department = $("#i_filter_department").val(); 
		employee_list.column(2).search(i_filter_department, true, false, false).draw();
    });
    $('#i_filter_role').change(function(){ 
		var i_filter_role = $("#i_filter_role").val(); 
		employee_list.column(4).search(i_filter_role, true, false, false).draw();
    });
    $('#i_filter_office').change(function(){ 
		var i_filter_office = $("#i_filter_office").val(); 
		employee_list.column(5).search(i_filter_office, true, false, false).draw();
    });
    $('#i_filter_status').change(function(){ 
		var i_filter_status = $("#i_filter_status").val(); 
		employee_list.column(6).search(i_filter_status, true, false, false).draw();
	});
});