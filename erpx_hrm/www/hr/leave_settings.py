import frappe
import json
from frappe import _
from frappe.utils import nowdate
from erpnext import get_default_company

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    context.employee = frappe.db.get_value("Employee", {"user_id": context.user}, "name") or ""

    valid_roles = ['HR Manager']
    
    if not frappe.utils.is_subset(valid_roles, frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)

    
    company = get_default_company()
    leave_period = get_leave_period(nowdate(), nowdate(), company)

    if leave_period:
        context.leave_period = leave_period[0]
    else:
        context.leave_period = frappe.get_doc("Leave Period")
    
    # context.leave_period = leave_period[0]
    context.list_company = frappe.db.get_all("Company",fields=["company_name"])
    context.list_holiday = frappe.db.get_all("Holiday List",fields=["holiday_list_name"])

    holiday_list_name = frappe.get_cached_value('Company',  company,  "default_holiday_list")

    if holiday_list_name:
        context.holiday_list_name = holiday_list_name
        context.holiday = frappe.get_doc("Holiday List", holiday_list_name)
    else:
        context.holiday = frappe.get_doc("Holiday List")
        context.holiday_list_name = ""
    
    context.list_leave_type = frappe.db.get_all("Leave Type",fields=["name"])

    return context


def get_leave_period(from_date, to_date, company):
	leave_period = frappe.db.sql("""
		select name, from_date, to_date, company, optional_holiday_list
		from `tabLeave Period`
		where company=%(company)s and is_active=1
			and (from_date between %(from_date)s and %(to_date)s
				or to_date between %(from_date)s and %(to_date)s
				or (from_date < %(from_date)s and to_date > %(to_date)s))
	""", {
		"from_date": from_date,
		"to_date": to_date,
		"company": company
	}, as_dict=1)

	if leave_period:
		return leave_period