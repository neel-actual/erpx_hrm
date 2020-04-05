import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    valid_roles = ['HR Manager'] 
    if not ("HR Manager" in frappe.get_roles()): 
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)), 
      frappe.PermissionError) 
    
    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    return context