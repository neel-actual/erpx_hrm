var leave_period_fields = [
	"from_date",
	"to_date",
	"company",
	"is_active",
	"optional_holiday_list"
]

var holiday_fields = [
	"from_date",
	"to_date",
]

var leave_type_fields = [
	"leave_type_name",
	"max_leaves_allowed",
	"is_carry_forward",
	"is_earned_leave",	
	"earned_leave_frequency",
	"rounding"
]

$(document).ready(function () {
	$("#btn-save-leave-period").click(function () {
		let name = $(`#form-leave-period [data-fieldname="name"]`).val();
		var args = {}
        leave_period_fields.forEach(element => {
            args[element] = $(`#form-leave-period [data-fieldname="${element}"]`).val();   
		});

		args["is_active"] = 1;
		
		if (!name){
			frappe.ajax({
				url: "/api/resource/Leave Period",
				args: args,
				callback: function (r) {
					M.toast({
						html: "Added Successfully!"
					})
					location.reload();		
				}
			})
		}else{
			frappe.ajax({
				type: "PUT",
				url: `/api/resource/Leave Period/${name}`,
				args: args,
				callback: function (r) {
					if (!r.exc) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		}		
	});

	$("#btn-save-holiday").click(function () {
		let name = $(`#form-holiday [data-fieldname="name"]`).val();
		var args = {}
        holiday_fields.forEach(element => {
            args[element] = $(`#form-holiday [data-fieldname="${element}"]`).val();   
		});
		
		if (!name){
			frappe.ajax({
				url: "/api/resource/Holiday List",
				args: args,
				callback: function (r) {
					M.toast({
						html: "Added Successfully!"
					})
					location.reload();		
				}
			})
		}else{
			frappe.ajax({
				type: "PUT",
				url: `/api/resource/Holiday List/${name}`,
				args: args,
				callback: function (r) {
					if (!r.exc) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		}		
	});

	//list holidays
	if(glb_holiday_list_name!=""){
		list_holiday.get_list();
	}

	$("#save_holiday").click(function () {
        let name = $(`#form-holiday-edit [data-fieldname="name"]`).val();
		var args = {}
		Object.keys(list_holiday.fields).forEach(function (element) {
			if(element!= "name")
				args[element] = $(`#form-holiday-edit [data-fieldname="${element}"]`).val();   
		})
		if(name){
			list_holiday.update_doc(name, args);
		}else{
			args["parent"] = glb_holiday_list_name;
			args["parentfield"] = "holidays";
			args["parenttype"] = "Holiday List";
			list_holiday.create_doc(args);
		}		
		$('#modal-holiday').modal('close');
	});
	
	$("#btn-add-holiday").click(function () {
		var item = {
			"name" : "",
			"holiday_date" : "",
			"description" : "",
		};
		var modal = $("#" + $(this).attr("data-modal"));
		Object.keys(list_holiday.fields).forEach(function (element) {
			modal.find(`[data-fieldname="${element}"]`).val(item[element]);
		})
		modal.modal('open');
	});

	$("#select-leave-type").change(function () {
		let leave_type = $(this).val();
		if(leave_type!=""){
			show_detail_leave_type(leave_type);
		}else{
			$("#form-leave-type").empty();
		}		
	});
});

var show_detail_leave_type = function(leave_type){
	frappe.call({
		method: "erpx_hrm.utils.leave_type.show_detail",
		args : {
			name : leave_type
		},
		callback: function(r) {
			$("#form-leave-type").html("<hr><br>" + r.message);
			$("#form-leave-type #earned_leave_frequency").formSelect();
			$("#form-leave-type #rounding").formSelect();
			bind_leave_type();
		}
	});
}

var bind_leave_type = function(){
	$("#form-leave-type #is_earned_leave").change(function(){
		if ($(this).is(':checked')) {
			$("#form-leave-type #div_earned_leave_frequency").show();
			$("#form-leave-type #div_rounding").show();
		}else{
			$("#form-leave-type #div_earned_leave_frequency").hide();
			$("#form-leave-type #div_rounding").hide();
		}
	})

	$("#form-leave-type #is_earned_leave").trigger("change");

	$("#form-leave-type #btn-delete-leave-type").click(function () {
		let name = $(`#form-leave-type [data-fieldname="name"]`).val();
		if (name){
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
						url: `/api/resource/Leave Type/${name}`,
						callback: function (r) {
							M.toast({
								html: __("Deleted Successfully!")
							});
							location.reload();
						}
					});
				}
			})
			return false;
		}	
	});

	$("#form-leave-type #btn-save-leave-type").click(function () {
		let name = $(`#form-leave-type [data-fieldname="name"]`).val();
		var args = {}
        leave_type_fields.forEach(element => {
			args[element] = $(`#form-leave-type [data-fieldname="${element}"]`).val();
			if(element=="is_carry_forward" || element=="is_earned_leave"){
				args[element] = $(`#form-leave-type [data-fieldname="${element}"]:checked`).val() || 0;
			}
		});
		
		if (!name){
			frappe.ajax({
				url: "/api/resource/Leave Type",
				args: args,
				callback: function (r) {
					M.toast({
						html: "Added Successfully!"
					})
					location.reload();		
				}
			})
		}else{
			frappe.ajax({
				type: "PUT",
				url: `/api/resource/Leave Type/${name}`,
				args: args,
				callback: function (r) {
					if (!r.exc) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		}		
	});
}

//holiday
var options = {
    doctype: "Holiday",
	parent: $('#list-holiday'),
	fields: {
		'name': 'Name',
		'holiday_date': 'Date',
		'description': 'Description'
	}
};
var list_holiday = new xhrm.views.ListCRUD(options);

$.extend(list_holiday, {
    get_list: function () {
		var me = this;
		frappe.ajax({
			type: "GET",
			url: `/api/resource/Holiday List/${glb_holiday_list_name}`,
			callback: function (r) {
				me.items = [];
				if (!r.exc) {
					me.items = r.data.holidays;
					me.render_list(me.items);
				}
			}
		});
	},
	render_list: function (data) {
		var me = this;
		let html = '';
		if (data.length) {
			html = data.map(me.get_item_html).join('');
		} else {
			html = ``;
		}
		let th_html = `
			<tr style="background-color: #eff1f9;">
				<th style=" border-right:none!important;width: 50px;"><b>Date</b>
				</th>
				<th style=" border-right:none!important;width: 150px;">
					<b>Description</b></th>
				<th style=" border-right:none!important;width: 100px;"><b>Action</b>
				</th>
			</tr>`
		me.parent.html(th_html + html);
		me.bind_event();
	},
	get_item_html: function (item, item_index) {
		if (item.description != "Saturday" && item.description != "Sunday"){
			return `
				<tr class="list-item">
					<td>${item.holiday_date}</td>
					<td>${item.description}</td>
					<td>
						<a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
							<img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
						</a>
						<a style="float: right; padding-right: 10px;" href="#modal-holiday" class="btn-edit modal-trigger" data-name="${item.name}" data-index="${item_index}" data-modal="modal-holiday">Edit</a>
					</td>
				</tr>	
			`;
		}
	},
});

var leave_policy_detail_fields = [
	"leave_type",
	"annual_allocation",
]
//Leave Policy Detail
var options = {
    doctype: "Leave Policy Detail",
	parent: $('#list_leave_policy_detail'),
	fields: {
		'name': 'Name',
		'leave_type': 'Leave Type',
		'annual_allocation': 'Annual Allocation'
	}
};
var list_leave_policy_detail = new xhrm.views.ListCRUD(options);

$.extend(list_leave_policy_detail, {
    get_list: function () {
		var me = this;
		frappe.ajax({
			type: "GET",
			url: `/api/resource/Leave Policy/${glb_leave_policy_name}`,
			callback: function (r) {
				me.items = [];
				if (!r.exc) {
					me.items = r.data.leave_policy_details;
					me.render_list(me.items);
				}
			}
		});
	},
	render_list: function (data) {
		var me = this;
		let html = '';
		if (data.length) {
			html = data.map(me.get_item_html).join('');
		} else {
			html = ``;
		}
		let th_html = `
				<tr style="background-color: #eff1f9;">
				<th style=" border-right:none!important;width: 150px;"><b>Leave Type</b></th>
				<th style=" border-right:none!important;width: 100px;"><b>Allocation</b></th>
				<th style=" border-right:none!important;width: 100px;"><b>Action</b></th>
			</tr>`
		me.parent.html(th_html + html);
		me.bind_event();
	},
	get_item_html: function (item, item_index) {
		return `
			<tr class="list-item">
				<td>${item.leave_type}</td>
				<td>${item.annual_allocation}</td>
				<td>
					<a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
						<img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
					</a>
					<a style="float: right; padding-right: 10px;" href="#modal-leave-policy-detail" class="btn-edit modal-trigger" data-name="${item.name}" data-index="${item_index}" data-modal="modal-leave-policy-detail">Edit</a>
				</td>
			</tr>	
		`;
	},
});

$(document).ready(function () {
	//list leave_policy_details
	if(glb_leave_policy_name!=""){
		list_leave_policy_detail.get_list();
	}

	$("#btn_save_leave_policy_detail").click(function () {
		let name = $(`#form_leave_policy_detail [data-fieldname="name"]`).val();
		var args = {}
        leave_policy_detail_fields.forEach(element => {
            args[element] = $(`#form_leave_policy_detail [data-fieldname="${element}"]`).val();   
		});
		
		if (!name){
			frappe.ajax({
				url: "/api/resource/Leave Policy Detail",
				args: args,
				callback: function (r) {
					M.toast({
						html: "Added Successfully!"
					})
					location.reload();		
				}
			})
		}else{
			frappe.ajax({
				type: "PUT",
				url: `/api/resource/Leave Policy Detail/${name}`,
				args: args,
				callback: function (r) {
					if (!r.exc) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		}		
	});	

	$("#save_leave_policy_detail").click(function () {
        let name = $(`#form_leave_policy_detail_edit [data-fieldname="name"]`).val();
		var args = {}
		Object.keys(list_leave_policy_detail.fields).forEach(function (element) {
			if(element!= "name")
				args[element] = $(`#form_leave_policy_detail_edit [data-fieldname="${element}"]`).val();   
		})
		if(name){
			list_leave_policy_detail.update_doc(name, args);
		}else{
			args["parent"] = glb_leave_policy_name;
			args["parentfield"] = "leave_policy_details";
			args["parenttype"] = "leave_policy_detail List";
			list_leave_policy_detail.create_doc(args);
		}		
		$('#modal-leave-policy-detail').modal('close');
	});
	
	$("#btn_add_leave_policy_detail").click(function () {
		var item = {
			"name" : "",
			"leave_policy_detail_date" : "",
			"description" : "",
		};
		var modal = $("#" + $(this).attr("data-modal"));
		Object.keys(list_leave_policy_detail.fields).forEach(function (element) {
			modal.find(`[data-fieldname="${element}"]`).val(item[element]);
		})
		modal.modal('open');
	});

})