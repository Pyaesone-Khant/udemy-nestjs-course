import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid4 } from "uuid";


@Injectable()
export class UploadToAwsProvider {

    constructor(
        private readonly configService: ConfigService
    ) { }

    public async fileUpload(file: Express.Multer.File) {
        const s3 = new S3();

        try {
            const result = await s3.upload({
                Bucket: this.configService.get('appConfig.awsBucketName'),
                Body: file.buffer,
                Key: this.generateFileName(file),
                ContentType: file.mimetype
            }).promise();

            return result.Key;
        } catch (error) {
            throw new RequestTimeoutException(error);
        }

    }

    private generateFileName(file: Express.Multer.File) {
        // extract file name & file extension
        let [filename, extension] = file.originalname.split('.');

        // remove white spaces and replace with hyphen
        filename = filename.replace(/\s/g, '-');

        // generate timestamp
        let timestamp = new Date().getTime().toString().trim();

        return `${filename}-${timestamp}-${uuid4()}.${extension}`;
    }
}
