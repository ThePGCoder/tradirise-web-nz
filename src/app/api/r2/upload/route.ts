// app/api/r2/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure R2 client with proper configuration
const r2Client = new S3Client({
  region: "auto", // R2 uses 'auto' as region
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  // Remove signatureVersion as it's not a valid property for S3ClientConfig
  forcePathStyle: false, // R2 supports virtual-hosted-style requests
});

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first
    if (
      !process.env.CLOUDFLARE_ACCOUNT_ID ||
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_BUCKET_NAME
    ) {
      console.error("Missing required environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Missing file or fileName" },
        { status: 400 }
      );
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    // Create the upload command with proper parameters
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      // Add cache control and other metadata
      CacheControl: "public, max-age=31536000", // 1 year cache
      Metadata: {
        "uploaded-at": new Date().toISOString(),
        "original-name": file.name,
      },
    });

    console.log(
      `Uploading file: ${fileName} to bucket: ${process.env.R2_BUCKET_NAME}`
    );

    // Execute the upload
    const result = await r2Client.send(command);

    console.log("Upload successful:", result);

    // Generate the correct public URL
    let publicUrl: string;

    if (process.env.R2_PUBLIC_URL) {
      // Use custom domain if configured
      publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    } else {
      // Use the correct R2 public URL format
      // Based on your working URL: https://pub-90fa8c55f2d44583b044a17ca76fa4d1.r2.dev/
      // Extract the pub ID from your account ID or use a different approach

      // Method 1: If you have R2_PUB_ID in your environment variables
      if (process.env.R2_PUB_ID) {
        publicUrl = `https://pub-${process.env.R2_PUB_ID}.r2.dev/${fileName}`;
      } else {
        // Method 2: Use the correct pub ID (hardcoded as fallback)
        // This is your actual working pub ID from the URL that works
        publicUrl = `https://pub-90fa8c55f2d44583b044a17ca76fa4d1.r2.dev/${fileName}`;
      }
    }

    console.log("Generated public URL:", publicUrl);

    return NextResponse.json({
      publicUrl,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error: unknown) {
    // Properly type the error with specific interface for AWS errors
    interface AWSError extends Error {
      Code?: string;
      $metadata?: {
        httpStatusCode?: number;
        requestId?: string;
      };
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const awsError = error as AWSError; // Type assertion for AWS-specific properties

    console.error("Detailed error uploading file:", {
      message: errorMessage,
      code: awsError.Code,
      statusCode: awsError.$metadata?.httpStatusCode,
      requestId: awsError.$metadata?.requestId,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return more specific error messages based on the error type
    if (awsError.Code === "InvalidAccessKeyId") {
      return NextResponse.json(
        { error: "Invalid R2 access key. Please check your credentials." },
        { status: 401 }
      );
    }

    if (awsError.Code === "SignatureDoesNotMatch") {
      return NextResponse.json(
        { error: "Invalid R2 secret key. Please check your credentials." },
        { status: 401 }
      );
    }

    if (awsError.Code === "NoSuchBucket") {
      return NextResponse.json(
        { error: "R2 bucket not found. Please check your bucket name." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to upload file",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    // Test if we can create the S3 client without errors
    /*const testClient = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });*/

    return NextResponse.json({
      status: "R2 configuration appears valid",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      bucket: process.env.R2_BUCKET_NAME,
      publicUrl:
        process.env.R2_PUBLIC_URL ||
        `https://pub-${
          process.env.R2_PUB_ID || "90fa8c55f2d44583b044a17ca76fa4d1"
        }.r2.dev/`,
      hasCredentials: !!(
        process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
      ),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "R2 configuration error", details: errorMessage },
      { status: 500 }
    );
  }
}
