import { randomUUID } from 'node:crypto'

import { S3, STS } from 'aws-sdk'

import { env } from '../env'

export class S3Storage {
  private client!: S3

  constructor() {
    this.initializeClient()
  }

  private async initializeClient() {
    const sessionToken = await this.getSessionToken()

    this.client = new S3({
      region: 'auto',
      credentials: {
        accessKeyId: sessionToken.Credentials!.AccessKeyId,
        secretAccessKey: sessionToken.Credentials!.SecretAccessKey,
        sessionToken: sessionToken.Credentials!.SessionToken,
      },
    })
  }

  async generatePresignedUrl(
    fileName: string,
    fileType: string,
  ): Promise<string> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    const params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
      Expires: 300 * 10,
    }

    const url = await this.client.getSignedUrlPromise('putObject', params)
    return url
  }

  private async getSessionToken(): Promise<AWS.STS.GetSessionTokenResponse> {
    const sts = new STS()
    return sts.getSessionToken({ DurationSeconds: 3600 }).promise()
  }
}
