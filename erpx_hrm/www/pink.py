import frappe
#import json


no_cache = True

def get_context(context):
    context['custom'] = 'hi'
