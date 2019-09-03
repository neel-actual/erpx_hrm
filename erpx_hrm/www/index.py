import frappe
import json

def get_context(context):
    context.user = frappe.session.user
    return context