$(document).ready(function () {
	var request_history = $('#request_history').DataTable({
		"columnDefs": [
            {
                "targets": [ 6 ],
                "visible": false,
            },
            {
                "targets": [ 7 ],
                "visible": false
            }
        ]
	});
	
	$('#i_filter_employeee').change(function(){ 
		var i_filter_employeee = $("#i_filter_employeee").val(); 
		request_history.column(0).search(i_filter_employeee, true, false, false).draw();
	});
	$('#i_filter_eave_type').change(function(){ 
		var i_filter_eave_type = $("#i_filter_eave_type").val(); 
		request_history.column(1).search(i_filter_eave_type, true, false, false).draw();
	});
	$('#i_filter_leave_status').change(function(){ 
		var i_filter_leave_status = $("#i_filter_leave_status").val(); 
		request_history.column(3).search(i_filter_leave_status, true, false, false).draw();
	});
	
	$('.date-range-filter').change( function() {
		request_history.draw();
	});

	$('.clr_filter_requesthistory').click(function(){		
		$('.i_filter_requesthistory').val("");
		$("#i_filter_leave_type").formSelect();
		$("#i_filter_leave_type").formSelect();
		$("#i_filter_leave_type").formSelect();
		request_history.search('').columns().search('').draw();
	});

	$('.approve_leave').click(function(){
		let doctype = "Leave Application";
		let name = $(this).attr("data-name");
		frappe.ajax({
			type: "PUT",
			url: `/api/resource/${doctype}/${name}`,
			args: {
				"status": "Approved",
				"docstatus" : 1
			},
			callback: function (r) {
				if (!r.exc) {
					M.toast({
						html: "Updated Successfully!"
					})
					location.reload(true);
				}
			}
		});
		return false;
	});

	$('.reject_leave').click(function(){
		let doctype = "Leave Application";
		let name = $(this).attr("data-name");
		frappe.ajax({
			type: "PUT",
			url: `/api/resource/${doctype}/${name}`,
			args: {
				"status": "Rejected",
				"docstatus" : 1
			},
			callback: function (r) {
				if (!r.exc) {
					M.toast({
						html: "Updated Successfully!"
					})
					location.reload(true);
				}
			}
		});
		return false;
	});

	$('.delete_leave').click(function(){
		let doctype = "Leave Application";
		let name = $(this).attr("data-name");
		let docstatus = $(this).attr("data-docstatus");
		if(docstatus!=1){
			// delete_leave(name);
		}else{
			cancel_leave(name);//.then(delete_leave(name));
		}
		return false;
	});
});

var delete_leave = function(name){
	let doctype = "Leave Application";
	frappe.ajax({
		type: "DELETE",
		url: `/api/resource/${doctype}/${name}`,
		callback: function (r) {
			M.toast({
				html: __("Deleted Successfully!")
			});
			location.reload(true);
		}
	});
}

var cancel_leave = function(name){
	let doctype = "Leave Application";
	return frappe.ajax({
		type: "PUT",
		url: `/api/resource/${doctype}/${name}`,
		args: {
			"docstatus" : 2
		},
		callback: function (r) {
			M.toast({
				html: __("Deleted Successfully!")
			});
			location.reload(true);
		}
	});
}

// Extend dataTables search
$.fn.dataTable.ext.search.push(
	function (settings, data, dataIndex) {
		let min = $('#i_filter_from_date').val();
		let max = $('#i_filter_to_date').val();
		let from_date = data[6];
		let to_date = data[7];
		
		if( min!="" && moment(from_date).isBefore(min)	){
			return false;
		}
		if( max!="" && moment(to_date).isAfter(max)	){
			return false;
		}
		return true;
	}
);