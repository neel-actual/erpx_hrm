

$(document).ready(function() {
	var options = {
        doctype: "Designation",
        parent: $('#list-job'),
	};
	var list_job = new xhrm.views.ListCRUD(options);

    $("#save_job_add").click(function(){
        var job_name  = $("#job_title_add").val();
        $("#job_title_add").val("");
        $("#modal-add").modal("close");
        list_job.create_doc({"designation_name": job_name});
    });

    $("#save_job_edit").click(function(){
        var old_name  = $("#modal-rename-job").find("#old_name").val();
        var new_name  = $("#modal-rename-job").find("#new_name").val();
        $("#modal-rename-job").modal("close");
        list_job.rename_doc({
            "doctype": list_job.doctype,
            "merge": 0,
            "old": old_name,
            "new": new_name
        });
    });
    
});