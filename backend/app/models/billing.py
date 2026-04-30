from pydantic import BaseModel
from typing import List
from datetime import date

class BillingSummary(BaseModel):
    current_month_total: float
    last_month_total: float
    projected_month_end: float
    percent_change: float

class ServiceBilling(BaseModel):
    service_name: str
    cost_usd: float
    percentage_of_total: float

class DailyBilling(BaseModel):
    date: date
    cost_usd: float
