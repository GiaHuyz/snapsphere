import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { BadRequestException } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'

const multerConfig: MulterOptions = {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new BadRequestException('Only image files are allowed'), false)
        }
        cb(null, true)
    },
}

export function MulterInterceptor(fieldName: string): Type<NestInterceptor> {
    @Injectable()
    class MulterInterceptorClass extends FileInterceptor(fieldName, multerConfig) {}

    return mixin(MulterInterceptorClass)
}
