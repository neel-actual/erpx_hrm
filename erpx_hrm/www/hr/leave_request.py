import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    context.employee = frappe.db.get_value("Employee", {"user_id": context.user}, "name") or ""
    context.holiday_list = frappe.db.get_value("Employee", {"user_id": context.user}, "holiday_list") or ""

    return context