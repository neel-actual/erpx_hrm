import frappe
import datetime
import frappe.desk.reportview
from frappe.utils.xlsxutils import make_xlsx


@frappe.whitelist()
def make_salary(expense_claim):
    expense_claim_month = get_month(str(frappe.db.get_value("Expense Claim",expense_claim,"posting_date")))["month"]
    employee = str(frappe.db.get_value("Expense Claim",expense_claim,"employee"))
    claim_amount = float(frappe.db.get_value("Expense Claim",expense_claim,"grand_total"))
    expense_claim_year = get_month(str(frappe.db.get_value("Expense Claim",expense_claim,"posting_date")))["year"]
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
            return "Expense claim added"
        else:
            ss = frappe.get_doc("Salary Slip", get_salary_slip)
            ss.append("earnings",{
            "salary_component": "Reimbursement",
            "amount": claim_amount})				
            ss.save()	
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
    # frappe.msgprint(str(department))
    # dep_name = frappe.db.get_value("Department",{"department_name":department},"name")
    approver_val = frappe.db.get_value("Department Approver",{"parent":department,"parentfield":"expense_approvers","approver":approver},"approver")
    if not approver_val:
        ss = frappe.get_doc("Department", department)
        ss.append("expense_approvers",{
        "approver": approver})				
        ss.save()	
        return "Approver added"
        # frappe.db.set_value("Department Approver",{"parent":dep_name,"parentfield":"expense_approvers"},"approver",approver)
    # frappe.msgprint(str(approver_val))

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


