import frappe
import json
from datetime import timedelta, date

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
    
    #Get employee info
    employee = frappe.get_doc("Employee", {"user_id": context.user}, 
                        ("image", "employee_name", "date_of_joining", "company", "date_of_birth", "branch")) or ""            
    context.employee = employee or None                    

    #Get branch info    
    branch = ""
    if employee and employee.branch:
        branch = frappe.get_doc("Branch", {"name": employee.branch}) or ""                
    context.branch = branch or None

    #Get Lis of Leave Application info
    from_date = date.today().strftime("%Y-%m-%d")
    to_date = (date.today() + timedelta(days=7)).strftime("%Y-%m-%d")

    leave_application_list = frappe.db.sql("""select e.image, l.employee, l.employee_name, from_date, to_date, group_concat(IF(l.from_date != l.to_date, CONCAT_WS('->',l.from_date,l.to_date), l.to_date)  SEPARATOR '<br>') as leave_date 
        from `tabLeave Application` as l
        inner join `tabEmployee` as e on l.employee = e.name 
        where 
            ((from_date >= %s and from_date <= %s) or (to_date >= %s and to_date <= %s)) 
            and l.docstatus = 1 and l.status = "Approved"
        group by l.employee
        """, (from_date, to_date, from_date, to_date), as_dict = True)
    
    context.leave_application_list = leave_application_list or None    

    #Get list of employee info
    employee_list = frappe.db.sql("""select image, employee_name, date_of_birth 
        from `tabEmployee` 
        where DayOfYear(date_of_birth) between DayOfYear(%s) and DayOfYear(%s)
        """, (from_date, to_date), as_dict = True)        
    context.employee_list = employee_list or None 

    return context
