import { ReadStream } from 'fs';

export interface PixianAIConstructorParams {
  apiId: string;
  apiSecret: string;
}

export type ImageType = 'b64' | 'url' | 'binary';

export interface RemoveBackgroundParams<T extends ImageType> {
  image: {
    /**
     * The image source to remove background
     */
    src: T extends 'b64'
      ? string
      : T extends 'url'
      ? string
      : Blob | ReadStream;
    /**
     * The type of the iamge (B64 / URL / Binary)
     */
    type: T;
  };
  /**
   * Pass in true to indicate that this is a test image.
   * Omit or pass in false for production images.
   * Test images are free to process, but the result will have a watermark embedded.
   * Boolean, default: false
   */
  test?: boolean;

  /**
   * The maximum input image size (= width × height). Images larger than this will be shrunk to this size before processing.
   * Integer, 100 to 25000000, default: 25000000
   */
  maxPixels?: number;

  /**
   * Background color to apply to the result. Omit to leave a transparent background.
   * Be sure to include the '#' prefix.
   * Format: '#RRGGBB', e.g. #0055FF
   */
  backgroundColor?: string;

  /** Result options */
  result?: {
    /**
     * Whether to crop the result to the foreground object.
     * Very useful together with result.margin and result.target_size to get a nicely sized and centered result every time.
     * Boolean, default: false
     */
    cropToForeground?: boolean;

    /**
     * Margin to add to the result.
     * It's added regardless of if the result is cropped to the foreground or not.
     * If result.target_size is specified, then the margin is inset, i.e. it doesn't expand the effective target size.
     * The supported units are % and px. It follows CSS semantics, so you can use any of:
     * [all]
     * [top/bottom] [left/right]
     * [top] [left/right] [bottom]
     * [top] [right] [bottom] [left]
     * Format: '(x.y%|px){1,4}', e.g. 10px 20% 5px 15%, default: 0px
     */
    margin?: string;

    /**
     * Enforce a specific result size in pixels. The result will be scaled to fit within the specified size.
     * If there's excess space then it's always horizontally centered, with result.vertical_alignment controlling the vertical treatment.
     * Format: 'w h', e.g. 1920 1080
     */
    targetSize?: string;

    /**
     * Specifies how to allocate excess vertical space when result.target_size is used.
     * Enum, default: middle
     */
    verticalAlignment?: 'top' | 'middle' | 'bottom';
  };

  /** Output options */
  output?: {
    /**
     * Output format. auto is interpreted as png for transparent results, and jpeg for opaque results, i.e. when a background.color has been specified.
     * delta_png is an advanced, fast, and highly compact format especially useful for low-latency, bandwidth-constrained situations like mobile apps.
     * It encodes the background as transparent black 0x00000000 and the foreground as transparent white 0x00FFFFFF.
     * Partially transparent pixels have their actual color values. Together with the input image you can use this to reconstruct the full result.
     * background.color, result.crop_to_foreground, result.margin, result.target_size, and result.vertical_alignment are ignored when using delta_png.
     * The result must be the same size as the input image, otherwise your decoding will fail, so max_pixels must not have caused the input to be shrunk.
     * Enum, default: auto
     */
    format?: 'auto' | 'png' | 'jpeg' | 'delta_png';

    /**
     * The quality to use when encoding JPEG results.
     * Integer, 1 to 100, default: 75
     */
    jpegQuality?: number;
  };
}
