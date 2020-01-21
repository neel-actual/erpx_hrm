$(document).ready(function () {
	console.log(glb_employee);
	if(glb_employee!=""){
		$("#filter_employee").val(glb_employee);
		get_balance_summary(glb_employee);
	}
	$("#filter_employee").change(function(){
		get_balance_summary($(this).val());	
	});
});


var get_balance_summary = function(employee){
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
						<div class="circles col s6 m6 l6 xl3 center">
							<div class="circle ${arrColor[j]}" style="width: 120px; height: 120px;">
							<div class="card-content center">
								<h4 class="card-stats-number white-text">${val.remaining_leaves}</h4>
								<p class="card-stats-title white-text">
								<span>available</span>
								</p>
							</div>
							</div>
							<p style="margin-top: 10px;">${key}</p>
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


