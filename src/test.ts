import * as fs from 'fs';
import { PixianAI } from './pixianai.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../test.jpg');

const apiId = process.env.PIXIAN_API_ID!;
const apiSecret = process.env.PIXIAN_API_SECRET!;
if (!apiId || !apiSecret) {
  throw 'Missing API envs to test pixian client';
}

const client = new PixianAI({
  apiId: apiId,
  apiSecret: apiSecret,
});
void (async () => {
  void (await testBinaryFile());
  void (await testB64File());
  void (await testURLFile());
})();

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
  console.log(
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
    })
  );
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
