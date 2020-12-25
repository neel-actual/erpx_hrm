from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.permissions import add_user_permission, remove_user_permission, \
	set_user_permission_if_allowed, has_permission

def after_rename(doc, method=None, *args, **kwargs):
	if doc.alternate_staff_id != doc.name:
		frappe.db.set_value('Employee', doc.name, 'alternate_staff_id', doc.name)

def autoname(doc, method):
	if doc.naming_series:
		doc.name = doc.alternate_staff_id

@frappe.whitelist()
def upload_employee_image():

	doctype = "Employee"
	docname = frappe.form_dict.docname

	frappe.form_dict.from_form = 1
	frappe.form_dict.doctype = doctype
	frappe.form_dict.folder = "Home"

	#Delete all files
	for fid in [ d.name for d in frappe.get_all("File", fields=["name"], filters={"attached_to_doctype": doctype, "attached_to_name": docname})]:
		frappe.delete_doc('File', fid)

	# Upload file
	file = frappe.handler.uploadfile()
	if file:
		frappe.db.set_value(doctype, docname, "image", file.file_url)

	return file

@frappe.whitelist()
def on_update(doc, method):
	if doc.leave_approver:
		employee_add_user_permission(doc, doc.leave_approver)

	if doc.reports_to:
		reports_to = frappe.get_value("Employee", doc.reports_to, "user_id")
		print(reports_to)
		if reports_to:
			employee_add_user_permission(doc, reports_to)
		

def employee_add_user_permission(doc, user_id):

	# If not set any Employee no need to set
	employee_user_permission_exists = frappe.db.exists('User Permission', {
		'allow': 'Employee',
		'user': user_id
	})
	if not employee_user_permission_exists: return
	
	# If set 1 employee need to add
	employee_user_permission_exists = frappe.db.exists('User Permission', {
		'allow': 'Employee',
		'for_value': doc.name,
		'user': user_id
	})
	if employee_user_permission_exists: return

	result = add_user_permission("Employee", doc.name, user_id, ignore_permissions=True)
	set_user_permission_if_allowed("Company", doc.company, user_id)	

@frappe.whitelist()
def get_employee_list():
	employees = frappe.db.sql("""
        select e.* from `tabEmployee` e
        left join `tabUser` u ON  e.user_id = u.name and u.name not in ('Administrator', 'Guest')                
        """, as_dict=True) 
	return employees or None