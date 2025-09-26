import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  statusCode: number;
  data: T | PaginatedResponse<T>;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class SuccessResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: any) => {
        const message = data?.message || this.getDefaultMessage(statusCode);
        const customStatus = data?.statusCode || statusCode;
        const isPaginated = data?.paginated === true;

        let formattedData: any;

        if (isPaginated && data?.data && data?.pagination) {
          // Paginated structure
          formattedData = {
            // data: this.cleanNulls(data.data),
            data: data.data,
            pagination: data.pagination,
          };
        } else {
          // Default response
          const { message, statusCode, ...rest } = data || {};
          console.log({ message, statusCode });

          formattedData = rest;
        }
        return {
          statusCode: customStatus,
          data: isPaginated ? formattedData.data : formattedData,
          pagination: isPaginated ? data.pagination : undefined,
          message,
          success: customStatus < 400,
        };
      }),
    );
  }

  private getDefaultMessage(status: number): string {
    switch (status) {
      case HttpStatus.OK:
        return 'Request successful';
      case HttpStatus.CREATED:
        return 'Resource created successfully';
      case HttpStatus.ACCEPTED:
        return 'Request accepted';
      case HttpStatus.NO_CONTENT:
        return 'Resource deleted successfully';
      case HttpStatus.BAD_REQUEST:
        return 'Bad request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal server error';
      default:
        return 'Request processed successfully';
    }
  }
}
