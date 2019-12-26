console.log(frappe.get_cookie("user_image"));
$(document).ready(function () {

	let user_image = frappe.get_cookie("user_image");

	if(user_image) {
		$(".img-acc-settings").css("background-image",`url(${user_image})`);
	}

	$("#file-acc").on('change', function() {
		var file = this.files[0];
		var reader = new FileReader();
		var doctype = "User";
		var docname = "vincent@erpx.com.my";
		reader.onload = function(){
			var srcBase64 = reader.result;
			frappe.ajax({
				type: "POST",
				url: `/api/method/erpx_hrm.utils.user.upload_user_image`,
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
});
