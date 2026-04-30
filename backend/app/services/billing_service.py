from google.cloud import bigquery
from app.config import settings
from app.models.billing import BillingSummary, ServiceBilling, DailyBilling
from typing import List
from datetime import datetime, timedelta
import calendar
import logging

logger = logging.getLogger(__name__)

class BillingService:
    def __init__(self):
        self.client = bigquery.Client(project=settings.gcp_project_id)
        self.table_id = f"{settings.gcp_project_id}.{settings.gcp_billing_dataset}.{settings.gcp_billing_table}"

    async def get_summary(self) -> BillingSummary:
        try:
            now = datetime.utcnow()
            first_day_current = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            last_day_prev = first_day_current - timedelta(days=1)
            first_day_prev = last_day_prev.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

            # Query for current month spend
            query_current = f"""
                SELECT SUM(cost) as total_cost
                FROM `{self.table_id}`
                WHERE _PARTITIONDATE >= '{first_day_current.date()}'
            """
            
            # Query for last month spend
            query_prev = f"""
                SELECT SUM(cost) as total_cost
                FROM `{self.table_id}`
                WHERE _PARTITIONDATE >= '{first_day_prev.date()}' 
                AND _PARTITIONDATE <= '{last_day_prev.date()}'
            """

            # Run queries
            current_job = self.client.query(query_current)
            prev_job = self.client.query(query_prev)
            
            current_res = list(current_job.result())
            prev_res = list(prev_job.result())
            
            current_spend = current_res[0].total_cost or 0.0
            prev_spend = prev_res[0].total_cost or 0.0
            
            # Projections
            days_elapsed = now.day
            total_days = calendar.monthrange(now.year, now.month)[1]
            projected = (current_spend / days_elapsed) * total_days if days_elapsed > 0 else 0.0
            
            percent_change = ((current_spend - prev_spend) / prev_spend * 100) if prev_spend > 0 else 0.0
            
            return BillingSummary(
                current_month_total=round(current_spend, 2),
                last_month_total=round(prev_spend, 2),
                projected_month_end=round(projected, 2),
                percent_change=round(percent_change, 2)
            )
        except Exception as e:
            logger.error(f"Error fetching billing summary: {str(e)}")
            # Return zeros if billing export is not configured or fails
            return BillingSummary(
                current_month_total=0.0,
                last_month_total=0.0,
                projected_month_end=0.0,
                percent_change=0.0
            )

    async def get_by_service(self) -> List[ServiceBilling]:
        try:
            now = datetime.utcnow()
            first_day = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            query = f"""
                SELECT service.description as service_name, SUM(cost) as cost_usd
                FROM `{self.table_id}`
                WHERE _PARTITIONDATE >= '{first_day.date()}'
                GROUP BY service_name
                ORDER BY cost_usd DESC
             Scraping is often more robust if we use the service name or ID if available, but description is user-friendly.
            """
            # Refined query for service billing
            query = f"""
                SELECT service.description as service_name, SUM(cost) as cost_usd
                FROM `{self.table_id}`
                WHERE usage_start_time >= '{first_day.isoformat()}'
                GROUP BY service_name
                ORDER BY cost_usd DESC
            """
            
            job = self.client.query(query)
            results = list(job.result())
            
            total_cost = sum(r.cost_usd for r in results)
            
            services = []
            for r in results:
                percentage = (r.cost_usd / total_cost * 100) if total_cost > 0 else 0.0
                services.append(ServiceBilling(
                    service_name=r.service_name,
                    cost_usd=round(r.cost_usd, 2),
                    percentage_of_total=round(percentage, 2)
                ))
            
            return services
        except Exception as e:
            logger.error(f"Error fetching service billing: {str(e)}")
            return []

    async def get_daily(self) -> List[DailyBilling]:
        try:
            now = datetime.utcnow()
            start_date = (now - timedelta(days=30)).date()
            
            query = f"""
                SELECT DATE(_PARTITIONDATE) as billing_date, SUM(cost) as daily_cost
                FROM `{self.table_id}`
                WHERE _PARTITIONDATE >= '{start_date}'
                GROUP BY billing_date
                ORDER BY billing_date ASC
            """
            
            job = self.client.query(query)
            results = list(job.result())
            
            return [
                DailyBilling(
                    date=r.billing_date,
                    cost_usd=round(r.daily_cost, 2)
                ) for r in results
            ]
        except Exception as e:
            logger.error(f"Error fetching daily billing: {str(e)}")
            return []

billing_service = BillingService()
