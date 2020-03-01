import frappe
import datetime
from frappe.utils import cstr
import frappe.handler

@frappe.whitelist()
def upload_user_image():

	doctype = "User";
	docname = frappe.session.user

	frappe.form_dict.from_form = 1
	frappe.form_dict.doctype = doctype
	frappe.form_dict.docname = docname
	frappe.form_dict.folder = "Home"

	#Delete all files
	for fid in [ d.name for d in frappe.get_all("File", fields=["name"], filters={"attached_to_doctype": doctype, "attached_to_name": docname})]:
		frappe.delete_doc('File', fid)

	# Upload file
	file = frappe.handler.uploadfile()
	if file:
		frappe.db.set_value(doctype, docname, "user_image", file.file_url)

	return file
