terraform {
  backend "gcs" {
    # Replace <YOUR_BUCKET_NAME> with the name of the GCS bucket you created for Terraform state
    bucket  = "<YOUR_BUCKET_NAME>"
    prefix  = "terraform/state"
  }
}
