$(document).ready(function(){
    var old_name = $('#old_name').val();    
    if(old_name != ''){
        list_family.get_list();
    }

    $("#save_family").click(function () {
        let name = $(`#form-family [data-fieldname="name"]`).val();
		var args = {}
		Object.keys(list_family.fields).forEach(function (element) {
			if(element!= "name")
				args[element] = $(`#form-family [data-fieldname="${element}"]`).val();   
		})
		if(name){
			list_family.update_doc(name, args);
		}else{
			args["parent"] = old_name;
			args["parentfield"] = "families";
			args["parenttype"] = "Employee";
			list_family.create_doc(args);
		}		
		$('#modal-family').modal('close');
	});
	
	$("#btn-add-family").click(function () {
        if(old_name != ''){
            var item = {
                'name': '',
                'full_name': '',
				'relationship': '',
				'birth_date': '',
				'phone_no': '',
            };
            var modal = $("#" + $(this).attr("data-modal"));
            Object.keys(list_family.fields).forEach(function (element) {
                modal.find(`[data-fieldname="${element}"]`).val(item[element]);
            })
            modal.modal('open');
        }
    });    
});

//families
var options = {
    doctype: "Employee Family",
	parent: $('#list-families'),
	fields: {
        'name': 'Name',
		'full_name': 'NAME',
		'relationship': 'RELATIONSHIP',
		'birth_date' : 'DATE OF BIRTH',
		'phone_no' : 'PHONE NO.'
	}
};
var list_family = new xhrm.views.ListCRUD(options);
$.extend(list_family, {
    get_list: function () {
        var old_name = $('#old_name').val();
        if(old_name == '')  return false;
		var me = this;
		frappe.ajax({
			type: "GET",
			url: `/api/resource/Employee/${old_name}`,
			callback: function (r) {
				me.items = [];
				if (!r.exc) {
					me.items = r.data.families;
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
				<th style=" border-right:none!important;"><b>NAME</b>
				</th>				
				<th style=" border-right:none!important;"><b>RELATIONSHIP</b></th>    
				<th style=" border-right:none!important;"><b>DATE OF BIRTH</b></th>    
				<th style=" border-right:none!important;"><b>PHONE NO.</b></th>    
				<th style=" border-right:none!important;width: 100px;"><b>Action</b>
				</th>
			</tr>`
		me.parent.html(th_html + html);
		me.bind_event();
	},
	get_item_html: function (item, item_index) {		
        return `
            <tr class="list-item">
                <td>${item.full_name || ''}</td>
				<td>${item.relationship || ''}</td>                
				<td>${item.birth_date || ''}</td>                
				<td>${item.phone_no || ''}</td>                
                <td>
                    <a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
                        <img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
                    </a>
                    <a style="float: right; padding-right: 10px;" href="#modal-family" class="btn-edit modal-trigger" data-name="${item.name}" data-index="${item_index}" data-modal="modal-family">Edit</a>
                </td>
            </tr>	
        `;		
	},
});