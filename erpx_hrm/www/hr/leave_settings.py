import frappe
import json
from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    context.employee = frappe.db.get_value("Employee", {"user_id": context.user}, "name") or ""

    valid_roles = ['HR Manager']
    
    if not frappe.utils.is_subset(valid_roles, frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)

    return context