import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from 'mongoose';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {

    constructor(
        private readonly configService: ConfigService
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => ({
            apiVersion: this.configService.get("appConfig.apiVersion"),
            data: data
        })));
    }

    private transformResponse(data: any): Document | Document[] {
        if (Array.isArray(data)) {
            return data.map((item: any) => {
                if (item && typeof item === 'object') {
                    return this.removeAttributes(item);
                }
                return item;
            });
        }
        return this.removeAttributes(data);
    }

    private removeAttributes(data: any): Document {
        if (data && typeof data === 'object' && "_doc" in data) {
            const transformedData = { ...data._doc }; // Shallow copy to avoid mutating original data

            if ("__v" in transformedData) {
                delete transformedData.__v;
            }
            if ("_id" in transformedData) {
                transformedData.id = transformedData._id;
                delete transformedData._id;
            }
            if ("password" in transformedData) {
                delete transformedData.password;
            }
            return transformedData;
        }
        return data;
    }
}
