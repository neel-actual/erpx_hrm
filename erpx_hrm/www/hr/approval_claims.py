import frappe
import json
from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect
    
    valid_roles = ['Expense Approver', 'Expense Verified']
    if not ("Expense Approver" in frappe.get_roles() or "Expense Verified" in frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)

    context.currency = frappe.db.get_value("HRM Setting",None,"currency")