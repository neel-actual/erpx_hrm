import frappe
import json
from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    
    employee = frappe.db.get_value("Employee", {"user_id": context.user}, "name") or ""
    context.employee = employee

    valid_roles = ['HR Manager']
    
    if not frappe.utils.is_subset(valid_roles, frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)
    
    context.list_employee = frappe.db.get_all("Employee", filters={"status":"Active"}, fields=['name','employee_name','employment_type','image','reports_to'])
    context.list_leave_type = frappe.db.get_all("Leave Type",fields=["name"])

    #Get list of Update Leave Balance
    list_update_leave_balance = ""
    if employee:
        list_update_leave_balance = frappe.db.get_all("Update Leave Balance", filters={"employee": employee}, fields=['leave_type','posting_date','current_cycle','new_balance','reason'])
    context.list_update_leave_balance = list_update_leave_balance

    return context