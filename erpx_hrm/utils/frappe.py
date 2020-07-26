import frappe
import datetime
from frappe.utils import cstr
import frappe.handler
from frappe import _

@frappe.whitelist()
def upload_file():
	# Upload file
	file = frappe.handler.uploadfile()
	return file

@frappe.whitelist()
def send_mail(recipient, subject, message):
	try:
		sender = frappe.session.user
		frappe.sendmail(
			recipients = recipient,
			sender = sender,
			subject = subject,
			message = message,
			reply_to = sender
		)
		frappe.msgprint(_("Email sent to {0}").format(recipient))
	except frappe.OutgoingEmailError:	
	  	return "Error"
	return "Success"
 