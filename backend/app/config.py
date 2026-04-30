from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gcp_project_id: str = ""
    gcp_region: str = "us-central1"
    google_application_credentials: str = ""
    gcp_billing_dataset: str = "billing_export"
    gcp_billing_table: str = "gcp_billing_export_v1_*"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
