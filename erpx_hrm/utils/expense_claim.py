# -*- coding: utf-8 -*-
# Copyright (c) 2018, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import flt

@frappe.whitelist()
def validate_limit_amount(expense_type, amount):
	data = {
		"result": 1,
		"claim_limit" : 0
	}
	expense_type = expense_type.replace("&amp;", "&")
	claim_limit = frappe.get_value("Expense Claim Type", expense_type, "claim_limit")
	if claim_limit:
		data["claim_limit"] = claim_limit
		if flt(amount) > flt(claim_limit):
			data["message"] = _("Please enter a value less than or equal to {0}.").format(claim_limit)
			data["result"] = 0
	return data

@frappe.whitelist()
def show_limit_amount(expense_type):
	data = {
		"result": 0,
		"claim_limit" : 0
	}
	expense_type = expense_type.replace("&amp;", "&")
	claim_limit = frappe.get_value("Expense Claim Type", expense_type, "claim_limit")
	if claim_limit:
		data["claim_limit"] = claim_limit
		data["result"] = 1
	return data
