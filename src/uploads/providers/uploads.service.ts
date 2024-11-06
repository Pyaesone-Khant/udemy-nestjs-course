import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileTypes } from '../enums/file-types.enum';
import { UploadFile } from '../interfaces/upload-file.interface';
import { Upload } from '../upload.entity';
import { UploadToAwsProvider } from './upload-to-aws.provider';

@Injectable()
export class UploadsService {

    constructor(
        @InjectRepository(Upload)
        private readonly uploadsRepository: Repository<Upload>,

        private readonly uploadFileProvider: UploadToAwsProvider,

        private readonly configService: ConfigService,
    ) { }

    public async uploadFile(file: Express.Multer.File) {

        const mimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];

        // throw error if file type is not supported
        if (!mimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('File type not supported');
        }

        try {
            // upload file to AWS S3
            const filename = await this.uploadFileProvider.fileUpload(file);

            // generate a new entry in database
            const uploadFile: UploadFile = {
                name: filename,
                path: `${this.configService.get("appConfig.awsBucketUrl")}/${filename}`,
                type: FileTypes.IMAGE,
                mime: file.mimetype,
                size: file.size,
            }

            const upload = this.uploadsRepository.create(uploadFile);

            return await this.uploadsRepository.save(upload);
        } catch (error) {
            throw new ConflictException(error)
        }
    }

    public async getImages() {
        return await this.uploadsRepository.find({
            where: {
                type: FileTypes.IMAGE
            }
        })
    }
}
