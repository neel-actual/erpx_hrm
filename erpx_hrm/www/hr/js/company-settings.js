$(document).ready(function () {
	$("#file-change-logo").on('change', function() {
		var file = this.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			var srcBase64 = reader.result;
			frappe.ajax({
				type: "POST",
				url: `/api/method/erpx_hrm.utils.company.upload_company_logo`,
				no_stringify: 1,
				args: {
					filename : file.name,
					filedata : srcBase64
				},
				callback: function (r) {
					if (!r.exc_type) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		};
		reader.readAsDataURL(file);
	});

	//branch
	list_branch.get_list();

    $("#save_branch_add").click(function () {
        var branch_name = $("#branch_title_add").val();
        $("#branch_title_add").val("");
        $("#modal-add").modal("close");
        list_branch.create_doc({ "designation_name": branch_name });
    });

    $("#save_branch_edit").click(function () {
        var old_name = $("#modal-rename-branch").find("#old_name").val();
        var new_name = $("#modal-rename-branch").find("#new_name").val();
        $("#modal-rename-branch").modal("close");
        list_branch.rename_doc({
            "doctype": list_branch.doctype,
            "merge": 0,
            "old": old_name,
            "new": new_name
        });
    });
});
var rename_company_name = function(){
	var old_name = company_name;
	var new_name = $("#company_name").val();
	if(new_name){
		frappe.ajax({
			type: "POST",
			url: `/api/method/frappe.model.rename_doc.rename_doc`,
			no_stringify: 1,
			args: {
				"doctype": "Company",
				"merge": 0,
				"old": old_name,
				"new": new_name
			},
			callback: function (r) {
				if (r.message) {
					M.toast({
						html: "Updated Successfully!"
					})
					location.reload();
				}
			}
		});
	}	
};

//branch
var options = {
    doctype: "Branch",
	parent: $('#list-branch'),
	fields: {
		'branch': 'Branch name',
		'address_line_1': 'Street Address',
		'city': 'City',
		'pincode': 'Post Code',
		'state': 'State',
		'country': 'Country',
		'time_zone': 'Timezone',
		'language': 'Language',
		'date_format': 'Date Format',
		'monday': 'Monday',
		'tuesday': 'Tuesday',
		'wednesday': 'Wednesday',
		'thursday': 'Thursday',
		'friday': 'Friday',
		'saturday': 'Saturday',
		'sunday': 'Sunday',
	}
};
var list_branch = new xhrm.views.ListCRUD(options);
$.extend(list_branch, {
    get_item_html: function (item, i) {
		return `
		<div data-name="${item.name}">
			<div style="margin-left: 2%;" class="input-field col s12">
			<h4 style="position: absolute;float: left; font-size: 16px;">
				${item.name}
				<p style="display: inline-block;background-color: #00aeef;color: white;padding: 0px 10px;border-radius: 10px;font-size: 11px;margin-left: 10px;">
				HQ</p>
			</h4>
			<br><br>
			<span class="col xl10 l10 m6 s6" style="float: left; font-size: 14px; color: darkgrey;padding-left: 0px;">
				72-3 Jalan PJU 5/22 Encorp Strand,<br> Pusat Perdagangan
			</span>
			<img style="margin-right: 4%; font-size: 20px;height: 36px !important;"
				class="right waves-effect waves-light btn btn-edit modal-trigger" href="#modal-branch-edit" data-modal="modal-branch-edit" data-name="${item.name}" data-index="${i}" src="/icons/icon-65.png">
			</div>
		</div>
		`;
    }
});
