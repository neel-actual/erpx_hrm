import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.user_doc = frappe.session
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.emp_doc = frappe.get_list('Employee',
                                      { 'company_email': frappe.session.user },
                                      ['name', 'company', 'date_of_joining', 'branch']
                                      )

    return context