import { Request, Response } from 'express'
import * as j from 'joi'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AddUserProfileService } from '@/domain/challenge/application/services/user/add-user-profile.service'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/prisma-users.repository'
import { S3Storage } from '@/infra/storage/s3-storage'

export class AddUserProfileController {
  async execute(req: Request, res: Response) {
    const usersRepository = new PrismaUsersRepository()

    const addUserProfile = new AddUserProfileService(usersRepository)

    const addUserProfileSchema = j.object({
      userId: j.string().required(),
      profile: j.binary().required(),
      fileName: j.string().required(),
      fileType: j.string().required(),
    })

    type addUserProfileType = {
      userId: string
      profile: Buffer
      fileName: string
      fileType: string
    }

    const { value, error } = addUserProfileSchema.validate(req.body)

    if (error) {
      return res.status(400).json({ statusCode: 400, error })
    }

    const { profile, userId, fileName, fileType }: addUserProfileType =
      value as addUserProfileType

    const s3Storage = new S3Storage()
    const presignedUrl = await s3Storage.generatePresignedUrl(
      fileName,
      fileType,
    )

    const response = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: profile,
    })

    if (response.ok) {
      const res = await response.json()

      const avatarUrl = res.Location

      const result = await addUserProfile.execute({ avatarUrl, userId })

      if (result.isLeft()) {
        const error = result.value

        switch (error.constructor) {
          case ResourceNotFoundError:
            return res.status(404).json({
              statusCode: 404,
              error: 'Not Found',
              message: error.message,
            })

          default:
            return res.status(500).json({
              statusCode: 500,
              error: 'Internal Server Error',
              message: 'Something went wrong',
            })
        }
      }

      const userProfile = result.value

      return res.status(200).json(userProfile)
    } else {
      return res.status(500).json({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to upload profile to S3',
      })
    }
  }
}
