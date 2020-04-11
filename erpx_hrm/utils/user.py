import frappe
import datetime
from frappe.utils import cstr
import frappe.handler
import ast

@frappe.whitelist()
def upload_user_image():

	doctype = "User"
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

@frappe.whitelist()
def add_role_from_array(arr_user, arr_all_user, role_name):
	#check arr_user			
	if arr_user != "":		
		objUser = ast.literal_eval(arr_user)		
		for _user in objUser:
			user = frappe.get_doc("User", _user) 			
			if not frappe.db.exists("Has Role", {"parent": user.name, "role": role_name}):						
				user.add_roles(role_name)
	
	#check for arr_all_user
	if arr_all_user != "":		
		objAllUser = ast.literal_eval(arr_all_user)
		for _user1 in objAllUser:
			user1 = frappe.get_doc("User", _user1)  			
			if frappe.db.exists("Has Role", {"parent": user1.name, "role": role_name}):				
				user1.remove_roles(role_name)
