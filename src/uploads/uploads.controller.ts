import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeader, ApiHeaders, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './providers/uploads.service';
@Controller('uploads')
export class UploadsController {

    constructor(
        private readonly uploadsService: UploadsService
    ) { }

    @UseInterceptors(FileInterceptor('file'))
    @ApiHeaders([
        {
            name: 'Content-Type',
            description: 'multipart/form-data',
        },
        {
            name: 'Authorization',
            description: 'Bearer Token',
        }
    ])
    @ApiOperation({
        summary: 'Upload file (images)',
        description: 'Upload file to server',
    })
    @Post('file')
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.uploadsService.uploadFile(file)
    }

    @Get('images')
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
    })
    @ApiOperation({
        summary: 'Get images',
        description: 'Get images from server',
    })
    public getImages() {
        return this.uploadsService.getImages();
    }
}
