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

    return context
