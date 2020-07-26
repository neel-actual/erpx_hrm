var current_role_name = '';
function openEditPeople(role_name){
	current_role_name = role_name;
	var dataArray1 = [];
	var roleUsers = role_list.find((r) => { return r.name === role_name }).user_list;
	
	$('#transfer1').html('');
	var settings1 = {
		"dataArray": dataArray1,
		"itemName": "name",
		"valueName": "value",
		"rightTabNameText": "All People",
		"tabNameText": "People belong to this Role",
		"callable": function (items) {
			//console.dir(items)
		}
	};
	settings1.tabNameText = "People belong to " + role_name;
	$.each( all_user, function( key, val ) {
		if($.inArray( val, roleUsers )  !== -1)
			dataArray1.push({
				name: val,
				value: val,				
			});
		else
			dataArray1.push({
				name: val,
				value: val,
				selected: true,				
			});
	});	
	$("#transfer1").transfer(settings1);
}
function saveEditPeople(){
	arr_all_user = [];
	arr_user = [];
	$('#transfer1 .transfer-double-content-right li:not(.selected-hidden) input[type="checkbox"]').each(function(){
		arr_all_user.push($(this).val());
	});
	$('#transfer1 .transfer-double-content-left li:not(.selected-hidden) input[type="checkbox"]').each(function(){
		arr_user.push($(this).val());
	});
	update_role_users(arr_user, arr_all_user, current_role_name);
	$('#modal-epml-ppl').modal('close');
}
$(document).ready(function () {
	
});
var update_role_users = function(arr_user, arr_all_user, role_name){	
	frappe.call({
		method: "erpx_hrm.utils.user.add_role_from_array",
		args : {
			arr_user : arr_user,
			arr_all_user: arr_all_user,
			role_name: role_name
		},
		callback: function(r) {
			location.reload();
		}
	});
}

//Edit permission
var permission_fields = [
	"Basic Information",
	"All About Me",
	"Certificate and License",
	"Compensation and Bank Information",
	"Compensation History",
	"Disciplinary Action",
	"Emergency Contact",
	"Family Information",
	"Personal Information",
	"Qualifications"
];
function openEditPermission(role_name){
	$('#modal-empl-per #sRoleName').html(role_name);
	$('#modal-empl-per #per_role_name').val(role_name);		

	$.each(permission_fields, function (key, element) {	
		$(`#modal-empl-per [data-fieldvalue="${element}"]`).attr('old_name', '');
		$(`#modal-empl-per [data-fieldvalue="${element}"]`).val('').formSelect();
	});
	frappe.call({
		method: "frappe.client.get_list",
		args: {
			doctype: "Section Permission",
			fields: ["*"],
			filters: [["role", "=", role_name]],
			limit_page_length: 0
		},
		callback: function (r) {
			r.message.forEach(function(element, index){
				$(`#modal-empl-per [data-fieldvalue="${element.section}"]`).attr('old_name', element.name);
				$(`#modal-empl-per [data-fieldvalue="${element.section}"]`).val(element.permission).formSelect();
			});	
		}
	});	
}

$(document).ready(function(){	
	$('#modal-empl-per #btn_save_permission').click(function(){				
		var per_role_name = $('#modal-empl-per #per_role_name').val();		
		
        $.each(permission_fields, function (key, element) {			   		
			var url = '/api/resource/Section Permission';    
			var type = 'POST';		
			var old_name = $(`#modal-empl-per [data-fieldvalue="${element}"]`).attr('old_name');
			if(old_name != ''){
				url += '/' + old_name;
				type = 'PUT';
			}	
			var permission = $(`#modal-empl-per [data-fieldvalue="${element}"]`).val();  			
			var args = {
				section: element,
				role: per_role_name,
				permission: permission
			};     
			frappe.ajax({
				type: type,
				url: url,
				args: args,
				callback: function (r) {
					if (!r.exc_type) {                
						
					}
				}
			}); 		
			//location.reload();				
			$('#modal-empl-per').modal('close');
        });    
	});
});