$(document).ready(function(){
    var old_name = $('#old_name').val();    
    if(old_name != ''){
        list_certificate.get_list();
    }

    $("#save_certificate").click(function () {
        let name = $(`#form-certificate [data-fieldname="name"]`).val();
		var args = {}
		Object.keys(list_certificate.fields).forEach(function (element) {
			if(element!= "name")
				args[element] = $(`#form-certificate [data-fieldname="${element}"]`).val();   
		})
		if(name){
			list_certificate.update_doc(name, args);
		}else{
			args["parent"] = old_name;
			args["parentfield"] = "certificates";
			args["parenttype"] = "Employee";
			list_certificate.create_doc(args);
		}		
		$('#modal-certificate').modal('close');
	});
	
	$("#btn-add-certificate").click(function () {
        if(old_name != ''){
            var item = {
                'name': '',
                'certificate': '',
                'expiry_date': ''
            };
            var modal = $("#" + $(this).attr("data-modal"));
            Object.keys(list_certificate.fields).forEach(function (element) {
                modal.find(`[data-fieldname="${element}"]`).val(item[element]);
            })
            modal.modal('open');
        }
    });    
});

//certificates
var options = {
    doctype: "Employee Certificates",
	parent: $('#list-certificates'),
	fields: {
        'name': 'Name',
		'certificate': 'CERTIFICATE & LISCENSE',
		'expiry_date': 'EXPIRATION DATE'
	}
};
var list_certificate = new xhrm.views.ListCRUD(options);
$.extend(list_certificate, {
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
					me.items = r.data.certificates;
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
				<th style=" border-right:none!important;"><b>CERTIFICATE & LISCENSE</b>
				</th>				
                <th style=" border-right:none!important;"><b>EXPIRATION DATE</b></th>    
				<th style=" border-right:none!important;width: 100px;"><b>Action</b>
				</th>
			</tr>`
		me.parent.html(th_html + html);
		me.bind_event();
	},
	get_item_html: function (item, item_index) {		
        return `
            <tr class="list-item">
                <td>${item.certificate || ''}</td>
                <td>${item.expiry_date || ''}</td>                
                <td>
                    <a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
                        <img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
                    </a>
                    <a style="float: right; padding-right: 10px;" href="#modal-certificate" class="btn-edit modal-trigger" data-name="${item.name}" data-index="${item_index}" data-modal="modal-certificate">Edit</a>
                </td>
            </tr>	
        `;		
	},
});