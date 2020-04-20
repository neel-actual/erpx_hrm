from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.permissions import add_user_permission, remove_user_permission, \
	set_user_permission_if_allowed, has_permission

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

	if not has_permission('User Permission', ptype='write', raise_exception=False): return

	employee_user_permission_exists = frappe.db.exists('User Permission', {
		'allow': 'Employee',
		'for_value': doc.name,
		'user': user_id
	})
	if employee_user_permission_exists: return

	result = add_user_permission("Employee", doc.name, user_id)
	set_user_permission_if_allowed("Company", doc.company, user_id)	
