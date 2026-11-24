# Nexus Uploader

A responsive file-sharing website built with Vite and Vercel Blob.

## Features
- Drag and drop or browse for files
- Upload progress
- Shareable public file links
- Copy-link button
- Responsive dark interface

## Requirements
- A GitHub account
- A free Vercel account
- A Vercel Blob store and its `BLOB_READ_WRITE_TOKEN`

## Deploy
1. Create a GitHub repository named `nexus-uploader`.
2. Upload all files in this project to the repository root.
3. Import the repository into Vercel.
4. In the Vercel project, open **Storage** and create a **Blob** store.
5. Connect the Blob store to this project. Vercel should add `BLOB_READ_WRITE_TOKEN` to the project environment variables.
6. Redeploy the project.

Your deployment will receive a free `*.vercel.app` address.

## Local development
```bash
npm install
npm run dev
```

The upload endpoint requires a Vercel deployment with Blob storage configured. Do not commit storage tokens or other secrets to GitHub.

## Notes
- The starter project limits each file to 100 MB.
- Uploaded files use public Blob URLs. Anyone with a link can access the uploaded file.
- Check the storage provider's current free-tier limits and policies before sharing important files.
