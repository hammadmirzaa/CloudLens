terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Artifact Registry to store Docker images
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "cloudlens-repo"
  description   = "Docker repository for CloudLens backend and frontend"
  format        = "DOCKER"
}

# Service account for Cloud Run Backend
resource "google_service_account" "backend_sa" {
  account_id   = "cloudlens-backend-sa"
  display_name = "CloudLens Backend Service Account"
}

# IAM Roles for Backend Service Account
resource "google_project_iam_member" "backend_roles" {
  for_each = toset([
    "roles/monitoring.viewer",
    "roles/logging.viewer",
    "roles/bigquery.dataViewer",
    "roles/bigquery.jobUser"
  ])
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.backend_sa.email}"
}

# Cloud Run Service for Backend
resource "google_cloud_run_v2_service" "backend" {
  name     = "cloudlens-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.backend_sa.email
    containers {
      image = var.backend_image
      
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "GCP_REGION"
        value = var.region
      }
      # The credentials will be inherited from the attached service account automatically
    }
  }

  depends_on = [google_project_iam_member.backend_roles]
}

# Allow public access to backend
resource "google_cloud_run_service_iam_binding" "backend_public" {
  location = google_cloud_run_v2_service.backend.location
  project  = google_cloud_run_v2_service.backend.project
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

# Cloud Run Service for Frontend
resource "google_cloud_run_v2_service" "frontend" {
  name     = "cloudlens-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = var.frontend_image
      
      env {
        name  = "VITE_API_BASE_URL"
        value = "${google_cloud_run_v2_service.backend.uri}/api"
      }
    }
  }
}

# Allow public access to frontend
resource "google_cloud_run_service_iam_binding" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  project  = google_cloud_run_v2_service.frontend.project
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}
