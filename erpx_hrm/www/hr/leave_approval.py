import frappe
import json

from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    valid_roles = ['Leave Approver']
    
    if not frappe.utils.is_subset(valid_roles, frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)
    
    context.leave_requests = frappe.db.sql("""
		select la.*, f.file_name, f.file_url
        from `tabLeave Application` la
        left join `tabFile` f on f.attached_to_doctype = "Leave Application" and f.attached_to_name = la.name
		where la.docstatus = 0
	""", as_dict=True)

    context.leave_historys = frappe.db.sql("""
		select la.*, f.file_name, f.file_url
        from `tabLeave Application` la
        left join `tabFile` f on f.attached_to_doctype = "Leave Application" and f.attached_to_name = la.name
		where la.docstatus = 1
	""", as_dict=True)

    return context