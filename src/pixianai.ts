import { ReadStream } from 'fs';
import ky, { KyInstance } from 'ky';
import { blob } from 'stream-consumers';
import {
  ImageType,
  PixianAIConstructorParams,
  RemoveBackgroundParams,
} from './types';

const BASE_DOMAIN = 'api.pixian.ai/api/v2';

export class PixianAI {
  #api: KyInstance;
  constructor(params: PixianAIConstructorParams) {
    this.#api = ky.extend({
      prefixUrl: `https://${BASE_DOMAIN}`,
      retry: 3,
      timeout: 180000,
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(params.apiId + ':' + params.apiSecret).toString('base64'),
      },
    });
  }

  async removeBackground<T extends ImageType>(
    params: RemoveBackgroundParams<T>
  ) {
    const { image } = params;
    const formData = new FormData();

    let src: string | Blob;

    if (image.src instanceof ReadStream) {
      src = await blob(image.src);
    } else {
      src = image.src;
    }

    switch (image.type) {
      case 'b64':
        formData.append('image.base64', src);
        break;
      case 'url':
        formData.append('image.url', src);
        break;
      case 'binary':
        formData.append('image', src);
    }

    // Add test parameter if provided
    if (params.test !== undefined) {
      formData.append('test', params.test.toString());
    }

    // Add max_pixels if provided
    if (params.maxPixels !== undefined) {
      formData.append('max_pixels', params.maxPixels.toString());
    }

    // Add background color if provided
    if (params.backgroundColor) {
      formData.append('background.color', params.backgroundColor);
    }

    // Add result options if provided
    if (params.result) {
      if (params.result.cropToForeground !== undefined) {
        formData.append(
          'result.crop_to_foreground',
          params.result.cropToForeground.toString()
        );
      }
      if (params.result.margin) {
        formData.append('result.margin', params.result.margin);
      }
      if (params.result.targetSize) {
        formData.append('result.target_size', params.result.targetSize);
      }
      if (params.result.verticalAlignment) {
        formData.append(
          'result.vertical_alignment',
          params.result.verticalAlignment
        );
      }
    }

    // Add output options if provided
    if (params.output) {
      if (params.output.format) {
        formData.append('output.format', params.output.format);
      }
      if (params.output.jpegQuality !== undefined) {
        formData.append(
          'output.jpeg_quality',
          params.output.jpegQuality.toString()
        );
      }
    }

    const response = await this.#api.post('remove-background', {
      body: formData,
      searchParams: {
        csrfToken: '1725348007386-7deb2eaeab7c4a9d68d4e4e21d7f2919b6812e4b',
      },
    });

    const result = Buffer.from(await response.arrayBuffer()).toString('base64');

    const headers = response.headers;

    return {
      imageB64: result,
      creditsCharged: +headers.get('X-Credits-Charged')!,
      creditsCalculatedForTest: +headers.get('X-Credits-Calculated')!,
    };
  }
}

function blobToB64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
