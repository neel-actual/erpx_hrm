from __future__ import unicode_literals
import frappe
from frappe import _

active_domains = frappe.get_active_domains()

def get_data():
    return [
        {
            "label": _("ERPX Human Resource Module"),
            "items": []
        }
    ]