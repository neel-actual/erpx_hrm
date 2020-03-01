import frappe
import datetime
from frappe.utils import cstr
import frappe.handler

@frappe.whitelist()
def upload_file():
	# Upload file
	file = frappe.handler.uploadfile()
	return file
