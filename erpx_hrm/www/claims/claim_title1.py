import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.currency = frappe.db.get_value("Global Defaults",None,"default_currency")   
     

    return context

# @frappe.whitelist()
# def update_expense_claim():
#     return 1