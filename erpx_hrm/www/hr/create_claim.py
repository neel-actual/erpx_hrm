import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.employee = frappe.get_all("Employee",fields = ["name","employee_name"])
    context.claim_type = frappe.get_all("Expense Claim Type",fields = ["name"])
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")

    return context