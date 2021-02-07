import frappe
import json
from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    employee = frappe.db.get_value("Employee", {"user_id": context.user}, "name") or ""
    context.employee = employee
    context.holiday_list = frappe.db.get_value("Employee", {"user_id": context.user}, "holiday_list") or ""

    valid_roles = ['Employee']
    
    if not frappe.utils.is_subset(valid_roles, frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)
        
    department = frappe.db.get_value("Employee", {"user_id": context.user}, "department") or ""

    context.department = department

    context.leave_all = frappe.db.sql("""
		select la.*, e.preferred_name
        from `tabLeave Application` la
        left join `tabEmployee` e on e.name = la.employee
		where la.status = %(status)s and la.docstatus = 1
	""",{
        "status": "Approved"
    }, as_dict=True, debug=1)

    context.leave_department = frappe.db.sql("""
		select la.*, e.preferred_name
        from `tabLeave Application` la
        left join `tabEmployee` e on e.name = la.employee
		where la.status = %(status)s and la.docstatus = 1 and la.department = %(department)s
	""",{
        "status": "Approved",
        "department": department
    }, as_dict=True, debug=1)

    context.leave_employee = frappe.db.sql("""
		select la.*, e.preferred_name
        from `tabLeave Application` la
        left join `tabEmployee` e on e.name = la.employee
		where la.status = %(status)s and la.docstatus = 1 and la.employee = %(employee)s
	""",{
        "status": "Approved",
        "employee": employee
    }, as_dict=True, debug=1)

    context.list_leave_type = frappe.db.sql("""
		select lt.name
        from `tabLeave Type` lt
		where lt.disabled = 0 order by lt.weightage asc
	""", as_dict=True, debug=1)


    return context