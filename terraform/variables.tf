variable "project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "region" {
  description = "The GCP Region"
  type        = string
  default     = "us-central1"
}

variable "backend_image" {
  description = "The Docker image URL for the backend service"
  type        = string
  # A default placeholder image to allow initial apply to succeed without failing
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "frontend_image" {
  description = "The Docker image URL for the frontend service"
  type        = string
  # A default placeholder image to allow initial apply to succeed without failing
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}
