import * as fs from 'fs';
import * as path from 'path';
import { PixianAI } from '../src/pixianai';

const filePath = path.join(__dirname, 'test.jpg');

const apiId = process.env.PIXIAN_API_ID!;
const apiSecret = process.env.PIXIAN_API_SECRET!;
if (!apiId || !apiSecret) {
  throw 'Missing API envs to test pixian client';
}

const client = new PixianAI({
  apiId: apiId,
  apiSecret: apiSecret,
});

describe('index', () => {
  describe('pixianclient', () => {
    it('should remove the background from my image (Binary)', async () => {
      const result = await client.removeBackground({
        image: {
          type: 'binary',
          src: fs.createReadStream(filePath),
        },
        test: true,
        maxPixels: 25000000,
        result: {
          cropToForeground: false,
          margin: '0px',
          verticalAlignment: 'middle',
        },
        output: {
          format: 'auto',
          jpegQuality: 75,
        },
      });

      console.log(
        'Result Ser!',
        result.creditsCalculatedForTest,
        result.creditsCharged,
        result.imageB64.slice(0, 40)
      );

      return expect(result.creditsCharged).toEqual(0);
    });
  });
});

async function testBinaryFile() {
  console.log(
    await client.removeBackground({
      image: {
        type: 'binary',
        src: fs.createReadStream(filePath),
      },
      test: true,
      maxPixels: 25000000,
      result: {
        cropToForeground: false,
        margin: '0px',
        verticalAlignment: 'middle',
      },
      output: {
        format: 'auto',
        jpegQuality: 75,
      },
    })
  );
}

async function testB64File() {
  const fileBuffer = fs.readFileSync(filePath, { encoding: 'base64' });
  await client.removeBackground({
    image: {
      type: 'b64',
      src: fileBuffer,
    },
    test: true,
    maxPixels: 25000000,
    result: {
      cropToForeground: false,
      margin: '0px',
      verticalAlignment: 'middle',
    },
    output: {
      format: 'auto',
      jpegQuality: 75,
    },
  });
}

async function testURLFile() {
  console.log(
    await client.removeBackground({
      image: {
        type: 'url',
        src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNpXxgqe8ydTST07zq1FOsJ14acIhuFLRSg&s',
      },
      test: true,
      maxPixels: 25000000,
      result: {
        cropToForeground: false,
        margin: '0px',
        verticalAlignment: 'middle',
      },
      output: {
        format: 'auto',
        jpegQuality: 75,
      },
    })
  );
}
