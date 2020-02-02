import frappe
import datetime
import frappe.desk.reportview
from frappe.utils.xlsxutils import make_xlsx
import json
from frappe import utils



@frappe.whitelist()
def make_salary(expense_claim,submit_month,submit_year):
    # expense_claim_month = get_month(str(frappe.db.get_value("Expense Claim",expense_claim,"posting_date")))["month"]
    expense_claim_month = submit_month
    employee = str(frappe.db.get_value("Expense Claim",expense_claim,"employee"))
    claim_amount = float(frappe.db.get_value("Expense Claim",expense_claim,"grand_total"))
    # expense_claim_year = get_month(str(frappe.db.get_value("Expense Claim",expense_claim,"posting_date")))["year"]
    expense_claim_year = submit_year
    # Get month of expense claim
    get_salary_slip = frappe.db.get_value("Salary Slip",{"salary_month":expense_claim_month,"salary_year":expense_claim_year,"employee":employee},"name")
    # Get slary slip of same month and year


    if get_salary_slip:
        earnings = frappe.get_all("Salary Detail",filters={"parent":get_salary_slip,"parentfield": "earnings"},fields=["salary_component","amount"])
        
        # Check if reimbursement present in salary slip or not
        if "Reimbursement" in [ec['salary_component'] for ec in earnings]:
            reimb_amt = 0
            for sc in earnings:
                if sc['salary_component'] == "Reimbursement":
                    reimb_amt = sc['amount']
            frappe.db.set_value("Salary Detail",{"parent":get_salary_slip,"parentfield": "earnings","salary_component":"Reimbursement"},"amount",float(reimb_amt+claim_amount))
            frappe.db.set_value("Expense Claim",expense_claim,"status","Paid")
            return "Expense claim added"
        else:
            ss = frappe.get_doc("Salary Slip", get_salary_slip)
            ss.append("earnings",{
            "salary_component": "Reimbursement",
            "amount": claim_amount})				
            ss.save()	
            frappe.db.set_value("Expense Claim",expense_claim,"status","Paid")
            return "Expense claim added"
    else:
        object = frappe.get_doc({
            "doctype":"Salary Slip",
            "employee":employee,
            "salary_month":expense_claim_month,
            "salary_year":expense_claim_year,
            "earnings":[{
                "salary_component":"Reimbursement",
                "amount":float(claim_amount)
            }]
            })
        object.flags.ignore_permissions = True
        object.insert()
        frappe.db.set_value("Expense Claim",expense_claim,"status","Paid")
        return "Salary slip Added!"


    

    # if get_salary_slip:
    #     salary_slip_doc = frappe.get_doc("Salary Slip",str(get_salary_slip))
        
        
    #     flag = 0
    #     for e in salary_slip_doc.earnings:
    #         if e.salary_component == "Reimbursement":
    #             flag = 1
                
    #     if flag == 0:        
    #         salary_slip_doc.earnings.append({
    #             "salary_component":"Reimbursement",
    #             "amount":claim_amount
    #         })
        
    #     # frappe.throw(str(basic))

    #     return salary_slip_doc
    # else:
    #     return "No Salary Slip Found"



def get_month(date):
    result_date = datetime.datetime.strptime(str(date), "%Y-%m-%d")
    return {
        "month":result_date.month,
        "year":result_date.year
        }


@frappe.whitelist()
def download_expense_claim_report():
    report_data = frappe.desk.reportview.execute("Expense Claim", filters = [["approval_status","=","Approved"]],
    fields = ["name"],
    limit_start=0, limit_page_length=0, order_by = "name", as_list=True)
    
    return make_xlsx(report_data,"demo_sheet")


@frappe.whitelist()
def create_payment(expense_voucher):
    object = frappe.get_doc({
    "doctype":"Payment Entry",
    "payment_type":"Pay",
    "mode_of_payment":"Cash",
    "party_type":"Employee",
    "party":frappe.db.get_value("Expense Claim",str(expense_voucher),"employee"),
    "paid_amount":float(frappe.db.get_value("Expense Claim",str(expense_voucher),"grand_total")),
    "received_amount":0.001,
    "paid_from": frappe.db.get_value("Company",str(frappe.db.get_value("Expense Claim",str(expense_voucher),"company")),"default_cash_account"),
    "paid_to":frappe.db.get_value("Company",str(frappe.db.get_value("Expense Claim",str(expense_voucher),"company")),"default_expense_claim_payable_account"),
    "references":[{
        "reference_doctype":"Expense Claim",
        "reference_name":str(expense_voucher),
        "allocated_amount":float(frappe.db.get_value("Expense Claim",str(expense_voucher),"grand_total"))
    }]
    })
    object.flags.ignore_permissions = True
    object.insert()
    object.submit()
    frappe.db.set_value("Expense Claim",str(expense_voucher),"status","Paid")
    return "Payment Added!"


@frappe.whitelist()
def set_department_approver(department,approver):
    approver_val = frappe.db.get_value("Department Approver",{"parent":department,"parentfield":"expense_approvers","approver":approver},"approver")
    if not approver_val:
        ss = frappe.get_doc("Department", department)
        ss.append("expense_approvers",{
        "approver": approver})				
        ss.save()	
        return "Approver added"

@frappe.whitelist()
def get_department_approver(department):
    app_string = ""
    app_list = []
    approver_val = frappe.get_all("Department Approver",{"parent":department,"parentfield":"expense_approvers"},"approver")
    if len(approver_val) != 0:
        for app in approver_val:
            app_list.append(app.approver)
        app_string = ','.join(app_list)
    else:
        app_string = "No Approver Added!"     
    

    
    return app_list


@frappe.whitelist()
def delete_department_approver(department,approver):
    approver_val = frappe.db.get_value("Department Approver",{"parent":department,"parentfield":"expense_approvers","approver":approver},"approver")
    if approver_val:
        delete_app = frappe.db.sql("""delete from `tabDepartment Approver` where parent = %s and parentfield = "expense_approvers" and approver = %s""", (department,approver))    
        frappe.db.commit()
        return delete_app
    else:
        return "No Record Found!"
        # frappe.db.set_value("Department Approver",{"parent":dep_name,"parentfield":"expense_approvers"},"approver",approver)
    # frappe.msgprint(str(approver_val))

@frappe.whitelist()
def add_expense_type(title,account,desc,claim_limit):
    object = frappe.get_doc({
    "doctype":"Expense Claim Type",
    "expense_type":title,
    "claim_limit":claim_limit,
    "description":desc,
   
    "accounts":[{
        "company":str(frappe.db.get_value("Global Defaults",None,"default_company")),
        "default_account":account,
    }]
    })
    object.flags.ignore_permissions = True
    object.insert()
    return object

@frappe.whitelist()
def delete_expense_type(doctype,name):
    frappe.delete_doc(doctype, name, ignore_missing=False)
    return "Expense Claim Deleted!"

@frappe.whitelist()
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

    return approvers

@frappe.whitelist()
def create_claim(expense_approver,requester,claim_type,expenses):
    object = frappe.get_doc({
    "doctype":"Expense Claim",
    "expense_approver":expense_approver,
    "employee":requester,
    "reimbursement_type":claim_type,
    "expenses":json.loads(expenses)
    })
    object.flags.ignore_permissions = True
    object.insert()

    return object

@frappe.whitelist()
def upload_file():
    ret = frappe.get_doc({
    "doctype": "File",
    "attached_to_name": "HR-EXP-2019-00011",
    "attached_to_doctype": "Expense Claim",
    "attached_to_field": frappe.form_dict.docfield,
    "file_url": frappe.form_dict.file_url,
    "file_name": frappe.form_dict.filename,
    "is_private": frappe.utils.cint(frappe.form_dict.is_private),
    "content": frappe.form_dict.filedata,
    "decode": True
    })
    ret.save()


@frappe.whitelist()
def get_singles(doctype,fields_list):
    ret = frappe.get_all(doctype,filters=[["parent", "=", None]],fields=fields_list)
    # ret = frappe.db.get_values("SOCSO Details",
    #     fieldname=["min_monthly_wages","max_monthly_wages","employers_contribution","employees_contribution","employer_contribution_second"],
    #     filters={
    #         "parent": None
    #     },
    #     as_dict=True
    # )
    return ret


@frappe.whitelist()
def add_child_item(child_doctype,child_doc_field,parent_doctype,parent_doc_name,check_filters,check_field,new_obj):
    
    # child_doctype = child doctype name e.g. "Addition"
    # child_doc_field = child doctype field name e.g. "addition_item"
    # parent_doctype = Parent Doctype Name e.g. "Payroll Setting"
    # parent_doc_name = Parent doctype name e.g. TD-001 or None for single doctype
    # check_filters = filter value to verify report_data
    # check_field = name field or key field to check whether data exist or not
    # new_obj = new value need to enter

    check_val = frappe.get_all(child_doctype,filters=json.loads(check_filters),fields=["name1"] )
    
    if len(check_val) < 1:
        ss = frappe.get_doc(parent_doctype,parent_doc_name)
        ss.append(child_doc_field,json.loads(new_obj))				
        ss.save()	
        return "New Value Added"
    else:
        return "Value Already Exist"

@frappe.whitelist()
def update_child_item(child_doctype,child_doc_field,parent_doctype,parent_doc_name,check_filters,check_field,new_obj):
    doc = frappe.get_doc(parent_doctype,parent_doc_name)
    child_doc_name = frappe.get_all(child_doctype,filters=json.loads(check_filters),fields=["name"] )
    # frappe.throw(str(child_doctype)+str(child_doc_name)+str(check_filters))
    child = doc.getone({"doctype": child_doctype, "name": str(child_doc_name[0].name)})
    # frappe.throw(str(json.loads(new_obj)))
    child.update(json.loads(new_obj))

    
    child.save()
    doc.save()
    # frappe.throw(str(child.name1))
    return "Child Successfully Updated!"
    
@frappe.whitelist()
def get_child(doctype,filters,fields):
    return frappe.get_all(doctype,filters=filters,fields=fields)

@frappe.whitelist()
def get_employee_payroll_info(employee = None):
    object = frappe.get_all("Employee",filters={"status":"Active","name":employee},fields = ['name','employee_name','department','branch','employment_type','salary_mode','designation','image',"salary_amount","employee_epf_rate","additional_epf","employee_socso_rate","employee_eis_rate","total_socso_rate","total_eis_rate","zakat_amount","employer_socso_rate","employer_epf","residence_status","marital_status","number_of_children","spouse_working","accumulated_salary","accumulated_epf","additional_employer_epf","employer_eis_rate","is_disabled","spouse_disable","past_deduction","accumulated_socso","accumulated_mtd","accumulated_zakat","accumulated_eis"])

    for obj in object:
        add=0.00
        ded=0.00
        over=0.00
        additional = frappe.db.sql("""select sum(default_amount) as additional from `tabAdditionals` where parent = %s and parentfield = "addition_items" group by parent""",(obj.name))
        if additional:
            add = additional[0][0]
        deduction = frappe.db.sql("""select sum(default_amount) as additional from `tabAdditionals` where parent = %s and parentfield = "deduction_item" group by parent""",(obj.name))
        if deduction:
            ded = deduction[0][0]
        
        overtime = frappe.db.sql("""select sum(default_amount) as additional from `tabAdditionals` where parent = %s and parentfield = "overtime_item" group by parent""",(obj.name))
        if overtime:
            over = overtime[0][0]
        
        
        obj["addition_amount"] = add
        obj["deduction_amount"] = ded
        obj["overtime_amount"] = over
    return object
   
@frappe.whitelist()
def create_payroll_entry(month,year,type,user,pay_details,total_net_pay,total_epf,total_pcb,total_eis,total_socso,total_pay):
    object = frappe.get_doc({

    "doctype":"HRM Payroll Entry",
    "status":"Pending",
    "payroll_month":month,
    "payroll_year":year,
    "payroll_type":type,
    "submitted_by":user,
    "total_net_pay":total_net_pay,
    "total_epf":total_epf,
    "total_pcb":total_pcb,
    "total_eis":total_eis,
    "total_socso":total_socso,
    "total_pay":total_pay,
    "payroll_details":json.loads(pay_details)
    })
    object.flags.ignore_permissions = True
    object.insert()

    return object.name

@frappe.whitelist()
def make_payslip(pay_list):
    pay_list = json.loads(pay_list)
    for pay in pay_list:
        
    # return pay_list
    # # employee => Name Of Employee
    # # submit_month => Payroll Month
    # # submit_year => Payroll Year
    # # earnings => All Earnings component in dictionory
    # # deduction => All Deductions component in dictionory
    # # pay_name => Payroll Entry Name
        
        get_salary_slip = frappe.db.get_value("Salary Slip",{"salary_month":int(pay['month']),"salary_year":int(pay['year']),"employee":str(pay['employee'])},"name")
        if get_salary_slip:
            # earnings = frappe.get_all("Salary Detail",filters={"parent":get_salary_slip,"parentfield": "earnings"},fields=["salary_component","amount"])
            
            ss = frappe.get_doc("Salary Slip", get_salary_slip)
            for earn in pay['earning']:
                ss.append("earnings",earn)
            for ded in pay['deduction']:
                ss.append("deductions",ded)
            				
            ss.save()	
            ss.submit()
            # frappe.db.set_value("HRM Payroll Entry",pay_name,"status","Completed")
            # return "Salary Slip added for :" + str(pay['employee']) 
            # return "Salary Slip Exist"
        else:
            object = frappe.get_doc({
                "doctype":"Salary Slip",
                "employee":pay['employee'],
                "salary_month":str(pay['month']).zfill(2),
                "salary_year":str(pay['year']).zfill(2),
                "earnings":pay['earning'],
                "deductions":pay['deduction']
                })
            object.flags.ignore_permissions = True
            object.insert()
            object.submit()

            # frappe.db.set_value("HRM Payroll Entry",pay_name,"status","Paid")
            # return "Salary Slip added for :" + pay['employee']
    frappe.db.set_value("HRM Payroll Entry",pay['payname'],"status","Completed")
    frappe.db.set_value("HRM Payroll Entry",pay['payname'],"docstatus",1)




