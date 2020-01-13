$(document).ready(function () {

    list_job.get_list();
    list_department.get_list();

    $("#save_job_add").click(function () {
        var job_name = $("#job_title_add").val();
        $("#job_title_add").val("");
        $("#modal-add").modal("close");
        list_job.create_doc({ "designation_name": job_name });
    });

    $("#save_job_edit").click(function () {
        var old_name = $("#modal-rename-job").find("#old_name").val();
        var new_name = $("#modal-rename-job").find("#new_name").val();
        $("#modal-rename-job").modal("close");
        list_job.rename_doc({
            "doctype": list_job.doctype,
            "merge": 0,
            "old": old_name,
            "new": new_name
        });
    });

    $("#save_department_add").click(function () {
        var department_name = form_department_add.find("#department_name").val();
        var parent_department = form_department_add.find("#parent_department").val();
        var is_group = form_department_add.find("#is_group:checked").val() || 0;

        list_department.create_doc({
            "department_name": department_name,
            "parent_department": parent_department,
            "is_group": is_group
        });
        show_form_department_add();
    });

    $("#save_department_edit").click(function () {
        var name = form_department_edit.find("#name").val();
        var department_name = form_department_edit.find("#department_name").val();
        var parent_department = form_department_edit.find("#parent_department").val();
        var is_group = form_department_edit.find("#is_group:checked").val() || 0;
        
        list_department.update_doc(name, {
            "department_name": department_name,
            "parent_department": parent_department,
            "is_group": is_group
        });
        show_form_department_add();
    });

    $("#cancel_department_edit").click(function () {
        show_form_department_add();
    });
    show_form_department_add();
});

//job
var options = {
    doctype: "Designation",
    parent: $('#list-job')
};
var list_job = new xhrm.views.ListCRUD(options);

//department
var options = {
    doctype: "Department",
    parent: $('#list-department')
};
var list_department = new xhrm.views.ListCRUD(options);

var form_department_add = $("#form-department-add");
var form_department_edit = $("#form-department-edit");

$.extend(list_department, {
    get_list: function () {
        var me = this;
        this.parent.find(`li[data-name="All Departments"]`).empty();
		frappe.call({
			method: "erpx_hrm.utils.settings.get_department_tree",
			args: {},
			callback: function (r) {
				if (!r.exc) {
					me.render_list(r.message);
				}
			}
		});
    },
    render_list: function (data) {
		var me = this;
		let html = '';
		if (data) {
            this.render_children_of_all_nodes(data);
		} else {
			html = `<li class="text-center">
					<span class="text-muted">${__('No Item')}</span>
				</li>`;
		}
		me.bind_event();
    },
    render_children_of_all_nodes: function(data_list) {
		data_list.map(d => { this.render_node_children(d.parent, d.data);});
	},

	render_node_children: function(parent, data_set) {
        var me = this;
        var node = this.parent.find(`li[data-name="${parent}"]`);
		var html = "";
		if (data_set) {
			$.each(data_set, (i, data) => {
				html += me.get_item_html(data);
			});
        }
		$(`<ul style="padding-left:30px; margin-top:15px;">${html}</ul>`).appendTo(node);
    },
    
    get_item_html: function (item) {
        if(item.is_group ==1){
            return `<li data-name="${item.name}" class="list-item bold" style="margin-bottom: 15px;">
                <a class="waves-effect waves-cyan" >
                    <img style="margin-right: 8px;" width="21" height="21" class="sidenav-icon" src="/icons/icon-61.png">
                    <span class="menu-title" style="vertical-align: top">${item.department_name}</span>
                </a>
                <a href="#" class="btn-delete" data-name="${item.name}">
                    <img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
                </a>
                <a style="float: right; padding-right:10px;" href="#" class="btn-rename" data-name="${item.name}">Edit</a>
            </li>`;
        }else{
            return `<li data-name="${item.name}" class="list-item bold" style="margin-bottom: 15px;">
                <a class="waves-effect waves-cyan" >
                    <img style="margin-right: 8px;" width="21" height="21" class="sidenav-icon" src="/icons/icon-32.png">
                    <span class="menu-title" style="vertical-align: top">${item.department_name}</span>
                </a>
                <a href="#" class="btn-delete" data-name="${item.name}">
                    <img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
                </a>
                <a style="float: right; padding-right:10px;" href="#" class="btn-rename" data-name="${item.name}">Edit</a>
            </li>`;
        }
    },
    bind_event: function () {
		var me = this;
		me.parent.find(".btn-delete").click(function () {
			var name = $(this).attr("data-name");
			var row = $(this).closest(".list-item");
			swal({
				title: "Are you sure you want to delete?",
				icon: 'warning',
				buttons: {
					cancel: true,
					delete: 'Yes, Delete It'
				}
			}).then(function (result) {
				if (result) {
					frappe.ajax({
						type: "DELETE",
						url: `/api/resource/${me.doctype}/${name}`,
						callback: function (r) {
							M.toast({
								html: __("Deleted Successfully!")
							});
                            row.remove();
						}
					});
				}
            })
            show_form_department_add();
			return false;
		});
		me.parent.find(".btn-rename").click(function () {
            // show_form_department_edit();
            var name = $(this).attr("data-name");
            me.get_doc(name).then((r) => {
                let doc = r.data;
				load_form_department_edit(doc);
			})            
        });
        show_form_department_add();
    }
});
var show_form_department_add = function () {
    load_group_department_select(form_department_add.find('#parent_department'));
    form_department_add.find("#department_name").val("");
    form_department_add.find("#is_group").prop("checked", false);
    form_department_add.show();
    form_department_edit.hide();    
}
var show_form_department_edit = function () {
    load_group_department_select(form_department_edit.find('#parent_department'));
    form_department_edit.find("#department_name").val("");
    form_department_edit.find("#is_group").prop("checked", false);
    form_department_edit.show();
    form_department_add.hide();    
}
var load_form_department_edit = function (doc) {
    load_group_department_select(form_department_edit.find('#parent_department'),doc.parent_department);
    form_department_edit.find("#name").val(doc.name);
    form_department_edit.find("#department_name").val(doc.department_name);
    form_department_edit.find("#is_group").prop("checked", doc.is_group?true:false);
    form_department_edit.show();
    form_department_add.hide();    
}
var load_group_department_select = function (department_select_id, department="All Departments") {

    var all_department = "All Departments";
    var arr_department = [{key: all_department, value: all_department}];

    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Department",
            order_by: "name",
            fields: ["name","department_name"],
            filters: [["is_group", "=", 1], ["name", "!=", "All Departments"]],
            limit_page_length: 0
        },
        callback: function (r) {
            if (!r.exc) {
                r.message.forEach(row => arr_department.push({key:row.name, value: row.department_name}));
            }
            xhrm.utils.optionArray(department_select_id, arr_department, department);
            department_select_id.formSelect();
        }
    });
}