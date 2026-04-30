from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gcp_project_id: str = ""
    gcp_region: str = "us-central1"
    google_application_credentials: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
