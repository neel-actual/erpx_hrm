import frappe

def validate(self,method):
    if self.approval_status == "Pending":
        frappe.sendmail(recipients=self.expense_verifier,
        subject="Expense Verification",
		message= "New Expense Claim has been created by {0} with reference: <b>{1}</b>. Please Verify it.".format(self.employee_name,self.name))
    if self.approval_status == "Verified":
        frappe.sendmail(recipients=self.expense_approver,
        subject="Expense Approval",
		message= "New Expense Claim has been Assigned by {0} with reference <b>{1}</b>. Please approve it.".format(self.employee_name,self.name))