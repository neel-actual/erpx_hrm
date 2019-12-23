import frappe
import json
import datetime
now = datetime.datetime.now()


def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.current_year = now.year
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")
    context.employee = frappe.get_all("Employee",fields=['name','employee_name','department','branch','employment_type','salary_mode','designation','image',"salary_amount","employee_epf_rate","total_socso_rate","total_eis_rate","zakat_amount","employee_socso_rate","employer_socso_rate","employer_epf"])

    return context