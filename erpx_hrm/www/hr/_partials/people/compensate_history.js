$(document).ready(function(){
    var old_name = $('#divBasicInfo #old_name').val();    
    if(old_name != ''){
        list_compensate_history.get_list();
    }

    $("#save_compensate_history").click(function () {
        let name = $(`#form-compensate-history [data-fieldname="name"]`).val();
		var args = {}
		Object.keys(list_compensate_history.fields).forEach(function (element) {
			if(element!= "name")
				args[element] = $(`#form-compensate-history [data-fieldname="${element}"]`).val();   
		})
		if(name){
			list_compensate_history.update_doc(name, args);
		}else{
			args["parent"] = old_name;
			args["parentfield"] = "compensates";
			args["parenttype"] = "Employee";
			list_compensate_history.create_doc(args);
		}		
		$('#modal-compensate-history').modal('close');
	});
	
	$("#btn-add-compensate-history").click(function () {
        if(old_name != ''){
            var item = {
                'name': '',
                'type': '',
				'date': '',
				'amount': ''
            };
            var modal = $("#" + $(this).attr("data-modal"));
            Object.keys(list_compensate_history.fields).forEach(function (element) {
                modal.find(`[data-fieldname="${element}"]`).val(item[element]);
            })
            modal.modal('open');
        }
    });    
});

//compensate-historys
var options = {
    doctype: "Employee Compensate",
	parent: $('#list-compensate-historys'),
	fields: {
        'name': 'Name',
		'type': 'TYPE',
		'date': 'DATE',
		'amount': 'AMOUNT',
		'reason': 'REASON'
	}
};
var list_compensate_history = new xhrm.views.ListCRUD(options);
$.extend(list_compensate_history, {
    get_list: function () {
        var old_name = $('#divBasicInfo #old_name').val();
        if(old_name == '')  return false;
		var me = this;
		frappe.ajax({
			type: "GET",
			url: `/api/resource/Employee/${old_name}`,
			callback: function (r) {
				me.items = [];
				if (!r.exc) {
					me.items = r.data.compensates;
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
				<th style=" border-right:none!important;"><b>DATE</b>
				</th>				
				<th style=" border-right:none!important;"><b>AMOUNT</b></th>    
				<th style=" border-right:none!important;"><b>TYPE</b></th>    
				<th style=" border-right:none!important;"><b>REASON</b></th>    
				<th style=" border-right:none!important;width: 100px;"><b>Action</b>
				</th>
			</tr>`
		me.parent.html(th_html + html);
		me.bind_event();
	},
	get_item_html: function (item, item_index) {		
        return `
            <tr class="list-item">
                <td>${item.date}</td>
				<td>${item.amount}</td>                
				<td>${item.type}</td>
				<td>${item.reason}</td>
                <td>
                    <a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
                        <img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
                    </a>
                    <a style="float: right; padding-right: 10px;" href="#modal-compensate-history" class="btn-edit modal-trigger" data-name="${item.name}" data-index="${item_index}" data-modal="modal-compensate-history">Edit</a>
                </td>
            </tr>	
        `;		
	},
});