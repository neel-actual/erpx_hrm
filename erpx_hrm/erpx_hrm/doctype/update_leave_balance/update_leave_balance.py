# -*- coding: utf-8 -*-
# Copyright (c) 2020, Neel Singh and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils import today, flt
from frappe import _, msgprint, throw
from erpx_hrm.utils.leave_application import get_leave_allocation
from erpnext.hr.doctype.leave_application.leave_application import get_leave_balance_on

class UpdateLeaveBalance(Document):
	def validate(self):
		self.posting_date = today()
		
		#Update Leave Allocation
		leave_allocation = get_leave_allocation(self.employee, self.leave_type)
		if leave_allocation:
			leave_allocation = frappe.get_doc("Leave Allocation", leave_allocation.name)
			self.leave_allocation = leave_allocation.name
			#Total Balance
			self.total_balance = get_leave_balance_on(self.employee, self.leave_type, self.posting_date, self.posting_date,
				consider_all_leaves_in_the_allocation_period=True)
			#TODO Update info leave_allocation
			self.from_date = leave_allocation.from_date
			self.to_date = leave_allocation.to_date
			self.current_cycle = leave_allocation.total_leaves_allocated
			
			#Update_leave_ledger_entry
			update_leave_ledger_entry(leave_allocation.name, self.new_balance, self.total_balance)
		else:
			frappe.throw(_("Can not find match Leave Allocation"))
			
@frappe.whitelist()
def update_leave_ledger_entry(leave_allocation_name, new_balance, total_balance):	
	frappe.errprint(leave_allocation_name)
	if leave_allocation_name and new_balance and total_balance:
		#Update leave Ledger Entry  		
		leave_ledger_entry = frappe.get_doc("Leave Ledger Entry", {"transaction_name": leave_allocation_name})		
		frappe.errprint(leave_ledger_entry)
		if leave_ledger_entry:
			new_balance = flt(new_balance)
			total_balance = flt(total_balance)
			new_leaves = (new_balance - total_balance) + leave_ledger_entry.leaves

			#Update Leave Ledger Entry
			frappe.db.sql("""update `tabLeave Ledger Entry` 
				set leaves=%(leaves)s where name = %(name)s """,{
					"name": leave_ledger_entry.name,
					"leaves": new_leaves				
			})

			#Update leave allocation	
			frappe.db.set_value("Leave Allocation", leave_allocation_name, "total_leaves_allocated", new_balance)
			return True
		
	return False
