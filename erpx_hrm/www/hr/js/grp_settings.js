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