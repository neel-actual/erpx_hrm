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
	$("#btn-add-branch").click(function () {		
		var modal = $("#" + $(this).attr("data-modal"));
		Object.keys(list_branch.fields).forEach(function (element) {			
			modal.find(`[data-fieldname="${element}"]`).val('');
			if(modal.find(`[id="${element}"]`).prop("id") == 'time_zone'){
				load_timezone_select($('#form_branch_add #time_zone'), '');
			}else if(modal.find(`[id="${element}"]`).prop("id") == 'date_format'){
				load_date_format_select($('#form_branch_add #date_format'), '');
			}else if ($(`#form_branch_add [data-fieldname="${element}"]`).prop("type") == "checkbox"){				
				modal.find(`[data-fieldname="${element}"]`).prop('checked', false);
			}	
		})
		modal.modal('open');
	});
    $("#save_branch_add").click(function () {
        var args = {}
		Object.keys(list_branch.fields).forEach(function (element) {			
			if ($(`#form_branch_add [data-fieldname="${element}"]`).prop("type") == "checkbox"){				
				if($(`#form_branch_add [data-fieldname="${element}"]`).is(":checked"))
					args[element] = 1;
				else
					args[element] = 0;
			}else{
				args[element] = $(`#form_branch_add [data-fieldname="${element}"]`).val();   						
			}			
		});
		list_branch.create_doc(args);
		$("#modal-branch-add").modal("close");
    });

    $("#save_branch_edit").click(function () {
        var args = {}
		Object.keys(list_branch.fields).forEach(function (element) {						
			if ($(`#form_branch_edit [data-fieldname="${element}"]`).prop("type") == "checkbox"){				
				if($(`#form_branch_edit [data-fieldname="${element}"]`).is(":checked"))
					args[element] = 1;
				else
					args[element] = 0;
			}else{
				args[element] = $(`#form_branch_edit [data-fieldname="${element}"]`).val();   
			}
		});
        $("#modal-branch-edit").modal("close");
        list_branch.update_doc($(`#form_branch_edit #branch`).val(), args);
	});
	
	//Holiday
	list_holiday.get_list();
	$("#btn-add-holiday").click(function () {
		var item = {
			"name" : "",
			"from_date" : "",
			"to_date" : "",
		};
		var modal = $("#" + $(this).attr("data-modal"));
		Object.keys(list_holiday.fields).forEach(function (element) {
			modal.find(`[data-fieldname="${element}"]`).val(item[element]);
		})
		modal.modal('open');
	});
	$("#save_holiday_add").click(function () {				
        var args = {}
		Object.keys(list_holiday.fields).forEach(function (element) {			
			args[element] = $(`#form-holiday-add [data-fieldname="${element}"]`).val();   						
		});
		list_holiday.create_doc(args);
		$("#modal-add-holiday").modal("close");
    });
    $("#save_holiday_edit").click(function () {
        var args = {}
		Object.keys(list_holiday.fields).forEach(function (element) {			
			args[element] = $(`#form-holiday-edit [data-fieldname="${element}"]`).val();   
		})
        $("#modal-edit-holiday").modal("close");
        list_holiday.update_doc($(`#form-holiday-edit #old_name`).val(), args);
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
		'branch_type': 'Branch Type',
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
				${item.country}</p>
			</h4>
			<br><br>
			<span class="col xl10 l10 m6 s6" style="float: left; font-size: 14px; color: darkgrey;padding-left: 0px;">
				${item.address_line_1} ${item.city},<br> ${item.state} 
			</span>			
			<a href="#" class="right modal-trigger btn-delete" data-name="${item.name}">
			<img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
			</a>			
			<a style="margin-right: 10px;" href="#modal-branch-edit" class="right btn-edit modal-trigger" data-name="${item.name}" data-index="${i}" data-modal="modal-branch-edit">Edit</a>	
			</div>
		</div>
		`;
    },bind_event: function () {
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
						no_stringify: 1,
						args:{name:name},
						callback: function (r) {							
							M.toast({
								html: "Deleted Successfully!"
							})
							list_branch.get_list();							
						}
					});
				}
			})
			return false;
		});	
		me.parent.find(".btn-edit").click(function () {		
			var item = me.items[$(this).attr("data-index")];			
			var name = $(this).attr("data-name");
			var modal = $("#" + $(this).attr("data-modal"));									
			Object.keys(me.fields).forEach(function (key) {				
				modal.find(`[data-fieldname="${key}"]`).val(item[key]);
				if(modal.find(`[id="${key}"]`).prop("id") == 'time_zone'){
					load_timezone_select($('#form_branch_edit #time_zone'), item[key]);
				}else if(modal.find(`[id="${key}"]`).prop("id") == 'date_format'){
					load_date_format_select($('#form_branch_edit #date_format'), item[key]);
				}
				else if (modal.find(`[data-fieldname="${key}"]`).prop("tagName") == "SELECT"){
					modal.find(`[data-fieldname="${key}"]`).formSelect();
				}else if (modal.find(`[data-fieldname="${key}"]`).prop("type") == "checkbox"){
					if(item[key] == 1)
						modal.find(`[data-fieldname="${key}"]`).prop('checked', 'checked');
					else
						modal.find(`[data-fieldname="${key}"]`).prop('checked', false);
				}
			});
		});	
	}
});

//holiday
var options = {
    doctype: "Holiday List",
	parent: $('#list-holiday'),
	fields: {
		'holiday_list_name': 'Holiday Name',
		'from_date': 'From Date',
		'to_date': 'To Date',		
	}
};
var list_holiday = new xhrm.views.ListCRUD(options);
$.extend(list_holiday, {
	render_list: function (data) {
		var me = this;
		let html = '';
		if (data.length) {
			html = data.map(me.get_item_html).join('');
		} else {
			html = ``;
		}
		let th_html = `
			<tr style="font-size: 16px; background-color: #e8ebf7; width: 100%!important;">
				<th style="border-right:none!important;width: 40%">Holiday Name</th>
				<th style="border-right:none!important;width: 20%">From Date</th>
				<th style="border-right:none!important;width: 20%">To Date</th>
				<th style="border-right:none!important;width: 20%">Action</th>
			</tr>`;
		me.parent.html(th_html + html);
		me.bind_event();
	},
    get_item_html: function (item, i) {
		return `
		<tr>
			<td>${item.holiday_list_name}</td>
			<td>${ item.from_date }</td>
			<td>${ item.to_date }</td>
			<td>
			<a href="#" class="modal-trigger btn-delete" data-name="${item.holiday_list_name}">
				<img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
			</a>			
			<a style="float: right; padding-right: 10px;" href="#modal-edit-holiday" class="btn-edit modal-trigger" data-name="${item.holiday_list_name}" data-index="${i}" data-modal="modal-edit-holiday">Edit</a>
			</td>
		</tr>		
		`;
    },bind_event: function () {
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
						no_stringify: 1,
						args:{name:name},
						callback: function (r) {							
							M.toast({
								html: "Deleted Successfully!"
							})
							list_holiday.get_list();							
						}
					});
				}
			})
			return false;
		});	
		me.parent.find(".btn-edit").click(function () {			
			var item = me.items[$(this).attr("data-index")];			
			var name = $(this).attr("data-name");
			var modal = $("#" + $(this).attr("data-modal"));			
			modal.find("#old_name").val(name);
			Object.keys(me.fields).forEach(function (key) {
				modal.find(`[data-fieldname="${key}"]`).val(item[key]);
				if (modal.find(`[data-fieldname="${key}"]`).prop("tagName") == "SELECT"){
					modal.find(`[data-fieldname="${key}"]`).formSelect();
				}
			})
		});	
	}
});


var load_timezone_select = function (timezone_select_id, selected) {
    var all = "------";
    var arr = [{key: all, value: all}];

    frappe.call({
        method: "frappe.core.doctype.user.user.get_timezones",
        args: {            
        },
        callback: function (r) {    
			if (!r.exc) {
                r.message.timezones.forEach((_key, _val) => arr.push({key:_key, value: _key}));
            }        
            xhrm.utils.optionArray(timezone_select_id, arr, selected);
            timezone_select_id.formSelect();
        }
    });
}

var load_date_format_select = function (dateformat_select_id, selected) {
    var all = "------";
    var arr = [{key: all, value: all}];
    var dateFormatArr = [
		"yyyy-mm-dd",
		"dd-mm-yyyy",
		"dd/mm/yyyy",
		"dd.mm.yyyy",
		"mm/dd/yyyy",
		"mm-dd-yyyy"
	];
	dateFormatArr.forEach((_key, _val) => arr.push({key:_key, value: _key}));			
	xhrm.utils.optionArray(dateformat_select_id, arr, selected);
	dateformat_select_id.formSelect();
        
}