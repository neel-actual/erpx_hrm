import frappe
import json
from erpx_hrm.utils.user import get_users_by_role

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.employee = frappe.db.get_value("Employee",{"user_id":frappe.session.user},"name")
    context.user = frappe.session.user
    context.roles = frappe.get_roles(frappe.session.user)
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.currency = frappe.db.get_value("Global Defaults",None,"default_currency")   
    context.site_url = frappe.utils.get_url()

    context.user_approvers = get_users_by_role("Expense Verified")     

    return context

# @frappe.whitelist()
# def update_expense_claim():
#     return 1