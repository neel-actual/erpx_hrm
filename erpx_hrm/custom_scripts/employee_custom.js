frappe.ui.form.on("Employee", {
	refresh: function (frm) {
		if (!frm.doc.__islocal) {
			frm.set_df_property("alternate_staff_id", "read_only", 1);
		}
	}
});