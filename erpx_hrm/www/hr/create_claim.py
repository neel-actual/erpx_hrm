import frappe
import json

def get_context(context):
    
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.csrf_token = frappe.sessions.get_csrf_token()
    employee = frappe.db.get_value("Employee",{"user_id":frappe.session.user},"name")    
    context.user = frappe.session.user
    context.employee_id = employee
    context.employee_name = frappe.db.get_value("Employee",employee,"employee_name")
    context.department = frappe.db.get_value("Employee",employee,"department")
    context.approver = get_approvers("Expense Claim",employee)
    
    context.employee = frappe.get_all("Employee",fields = ["name","employee_name"])
    context.claim_type = frappe.get_all("Expense Claim Type",fields = ["name"])
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")

    return context


def get_approvers(employee,doctype):
    # frappe.throw("here")

	# if not employee:
	# 	frappe.throw(_("Please select Employee Record first."))

    approvers = []
    department_details = {}
    department_list = []
    employee_department = frappe.get_value("Employee", employee, "department")
    if employee_department:
        department_details = frappe.db.get_value("Department", {"name": employee_department}, ["lft", "rgt"], as_dict=True)
    if department_details:
        department_list = frappe.db.sql("""select name from `tabDepartment` where lft <= %s
            and rgt >= %s
            and disabled=0
            order by lft desc""", (department_details.lft, department_details.rgt), as_list = True)

    if doctype == "Leave Application":
        parentfield = "leave_approvers"
    else:
        parentfield = "expense_approvers"
    if department_list:
        for d in department_list:
            approvers += frappe.db.sql("""select user.name from
                tabUser user, `tabDepartment Approver` approver where
                approver.parent = %s
                and approver.parentfield = %s
                and approver.approver=user.name""",(d, parentfield), as_list=True)
        frappe.throw(str(approvers))

    return approvers