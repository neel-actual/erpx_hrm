$(document).ready(function(){
    var old_name = $('#old_name').val();    
    if(old_name != ''){
        list_qualification.get_list();
    }

    $("#save_qualification").click(function () {
        let name = $(`#form-qualification [data-fieldname="name"]`).val();
		var args = {}
		Object.keys(list_qualification.fields).forEach(function (element) {
			if(element!= "name")
				args[element] = $(`#form-qualification [data-fieldname="${element}"]`).val();   
		})
		if(name){
			list_qualification.update_doc(name, args);
		}else{
			args["parent"] = old_name;
			args["parentfield"] = "education";
			args["parenttype"] = "Employee";
			list_qualification.create_doc(args);
		}		
		$('#modal-qualification').modal('close');
	});
	
	$("#btn-add-qualification").click(function () {
        if(old_name != ''){
            var item = {
                'name': '',
                'school_univ': '',
                'level': '',
                'year_of_passing': ''
            };
            var modal = $("#" + $(this).attr("data-modal"));
            Object.keys(list_qualification.fields).forEach(function (element) {
                modal.find(`[data-fieldname="${element}"]`).val(item[element]);
            })
            modal.modal('open');
        }
    });    
});

//Qualifications
var options = {
    doctype: "Employee Education",
	parent: $('#list-qualifications'),
	fields: {
        'name': 'Name',
		'school_univ': 'INSTITUTION',
		'level': 'QUALIFICATION TYPE / LEVEL',
		'year_of_passing': 'YEAR COMPLETED'
	}
};
var list_qualification = new xhrm.views.ListCRUD(options);
$.extend(list_qualification, {
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
					me.items = r.data.education;
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
				<th style=" border-right:none!important;"><b>QUALIFICATION TYPE / LEVEL</b>
				</th>
				<th style=" border-right:none!important;">
                    <b>YEAR COMPLETED</b></th>
                    <th style=" border-right:none!important;"><b>INSTITUTION</b></th>    
				<th style=" border-right:none!important;width: 100px;"><b>Action</b>
				</th>
			</tr>`
		me.parent.html(th_html + html);
		me.bind_event();
	},
	get_item_html: function (item, item_index) {		
        return `
            <tr class="list-item">
                <td>${item.level}</td>
                <td>${item.year_of_passing}</td>
                <td>${item.school_univ}</td>                                
                <td>
                    <a href="#" class="modal-trigger btn-delete" data-name="${item.name}">
                        <img class="img-del-dep" src="/icons/icon-58.png" width="21" height="21">
                    </a>
                    <a style="float: right; padding-right: 10px;" href="#modal-qualification" class="btn-edit modal-trigger" data-name="${item.name}" data-index="${item_index}" data-modal="modal-qualification">Edit</a>
                </td>
            </tr>	
        `;		
	},
});