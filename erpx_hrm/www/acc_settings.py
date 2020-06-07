import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    
    doc_user = frappe.get_doc("User", frappe.session.user)
    context.user_full_name = doc_user.full_name

    #Get employee's full name
    employee_name = frappe.db.get_value("Employee", {"user_id": context.user}, "employee_name") or ""    
    if employee_name:
        context.user_full_name = employee_name

    context.stop_birthday_reminders = frappe.db.get_single_value("HR Settings", "stop_birthday_reminders") or 0

    return context
