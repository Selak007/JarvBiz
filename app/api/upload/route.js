import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const bucketName = "complaint-kb";

        // According to user: "bucket-url = s3://complaint-kb/"
        // We will construct the s3 URI to send to the agent, but S3 expects us to upload to the bucket name.

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        // Construct the URL to return. 
        // User requested: "once it lands in s3 url, the url shud be automatically be sent to the agent"
        // User snippet: "bucket-url = s3://complaint-kb/"
        // So the agent likely expects "s3://complaint-kb/<filename>".
        const s3Uri = `s3://${bucketName}/${filename}`;

        return NextResponse.json({ url: s3Uri });

    } catch (error) {
        console.error("Error uploading to S3:", error);
        return NextResponse.json(
            { error: "Upload failed", details: error.message },
            { status: 500 }
        );
    }
}
