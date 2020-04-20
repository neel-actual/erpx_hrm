import frappe
import json
from frappe import _
import datetime

def get_context(context):        
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect
    

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()    
    # get employee        
    name = frappe.form_dict.name
    if name:
        employee = frappe.get_doc("Employee", name)
        if not employee:
            frappe.throw(_('{0} not exist').format(', '.join(name)))
    else:    
        employee = frappe.new_doc("Employee")    
    context.employee = employee or None
    context.series = ["BAYO-BOD-.###", "BAYO-DIR-.###", "BAYO-CON-.###", "BAYO-.YY.MM.-.###"]    
    context.maritalStatus = ["Single", "Married", "Divorced", "Widowed"]
    context.spouseWorking = ["Working", "Not Working"]
    context.qualification_level = ["Graduate", "Post Graduate", "Under Graduate"]
    context.salaryBasic = ["Monthly", "Daily"]

    reportToDepartment = ''
    reportToImage = ''
    if employee.reports_to:
        report_to_info = frappe.get_doc("Employee", employee.reports_to, ("department", "user_id")) or None        
        if report_to_info:
            reportToDepartment = report_to_info.department
            reportToImage = frappe.get_value("User", report_to_info.user_id, "user_image")            

    context.reportToDepartment = reportToDepartment    
    context.reportToImage = reportToImage

    #Check permission   
    beep_roles = ["HR Manager", "Expense Approver", "Expense Verified", "Leave Approver","Employee"]
    user_role_list = frappe.db.sql_list("""
							select r.role from `tabUser` u
                            left join `tabHas Role` r ON  r.parent = u.name
                            where u.name = %(user_name)s""", {"user_name": frappe.session.user})  

    #Get beep's role for user
    beep_user_role_list = []
    for i_user_role in user_role_list:
        if i_user_role in beep_roles:
            beep_user_role_list.append(i_user_role)

    #Get permissions for user on beep's role
    permission_list = {
        "Basic Information" : {"canView": False, "canEdit": False},
        "All About Me" : {"canView": False, "canEdit": False},
        "Certificate and License" : {"canView": False, "canEdit": False},
        "Compensation and Bank Information" : {"canView": False, "canEdit": False},
        "Compensation History" : {"canView": False, "canEdit": False},
        "Disciplinary Action" : {"canView": False, "canEdit": False},
        "Emergency Contact" : {"canView": False, "canEdit": False},
        "Family Information" : {"canView": False, "canEdit": False},
        "Personal Information" : {"canView": False, "canEdit": False},
        "Qualifications" : {"canView": False, "canEdit": False}
    }

    #Validate my employee
    employee_list = frappe.db.sql_list("""
        select e.name from `tabUser` u
        left join `tabEmployee` e ON  e.user_id = u.name
        where u.name = %(user_name)s""", {"user_name": frappe.session.user})  
    my_employee = False
    for i_employee in employee_list:
        if i_employee == employee.name:
            my_employee = True
            break

    for i_beep_user_role in beep_user_role_list:
        section_permission = frappe.get_all("Section Permission", fields = ["section", "permission"], filters={"role": i_beep_user_role})
        for i_section_permission in section_permission:            
            if not permission_list[i_section_permission.section]["canEdit"]:
                if i_section_permission.permission == "All Employees view and edit":
                    permission_list[i_section_permission.section]["canEdit"] = True
                    permission_list[i_section_permission.section]["canView"] = True
                elif i_section_permission.permission == "My view and edit":
                    if my_employee:
                        permission_list[i_section_permission.section]["canEdit"] = True
                        permission_list[i_section_permission.section]["canView"] = True
            if not permission_list[i_section_permission.section]["canView"]:
                if i_section_permission.permission == "All Employees view only":                    
                    permission_list[i_section_permission.section]["canView"] = True
                elif i_section_permission.permission == "My view only":
                    if my_employee:                        
                        permission_list[i_section_permission.section]["canView"] = True
    
    context.permission_list = permission_list   

    #Employee's image
    employeeImage = ""
    if employee:
        employeeImage = frappe.get_value("User", employee.user_id, "user_image") 
    context.employeeImage = employeeImage

    return context
