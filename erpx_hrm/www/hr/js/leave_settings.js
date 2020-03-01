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
			frappe.call({
				method: "erpx_hrm.utils.leave_type.show_detail",
				args : {
					name : leave_type
				},
				callback: function(r) {
					$("#div-leave-type").html(r.message);
				}
			});
		}else{
			$("#div-leave-type").empty();
		}

		
	});

	
});

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
