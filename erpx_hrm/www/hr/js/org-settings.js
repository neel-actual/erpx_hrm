$(document).ready(function(){
    $('#save_job_add').click(function(){
        var job_name  = $('#job_title_add').val();
        $('#job_title_add').val('');
        $('#modal-add').modal('close');
        create_job(job_name);
    });

});

function create_job(job_name) {
    frappe.ajax({
		url: "/api/resource/Designation",
		args: {
            "designation_name": job_name
        },
		callback: function(r){
            if (!r.exc) {
                M.toast({
                    html: 'Job Title Added Successfully!'
                })
                // $( "#typetab" ).load( "set-claim-type.html #typetab" );
                //window.location.reload();
            }
            else{
                    
            }
		}
	});
}