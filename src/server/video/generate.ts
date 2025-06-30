import { Router } from 'express';
import { pipeline } from 'stream/promises';
import { promisify } from 'util';
import { exec } from 'child_process';
import { rm } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const root_dir = path.dirname(fileURLToPath(import.meta.url)) + '/../../..';
const execAsync = promisify(exec);
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'tmp/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    },
  })
});

if (!fs.existsSync('tmp')) {
  fs.mkdirSync('tmp');
}

export default Router()
  .post('/video', upload.single('image'), async (req, res) => {
    const image_file = req.file!;
    const audio_url = req.body['audio'] as string;

    const { stdout: duration } = await execAsync(
      `ffprobe -show_entries format=duration -v quiet -of csv="p=0" ${audio_url}`
    );
    const time = Math.ceil(parseFloat(duration));

    const video_filename = `${Date.now()}.mp4`;
    const video_path = `tmp/${video_filename}`;
    const { stderr } = await execAsync([
      'ffmpeg',
      '-hide_banner',
      '-framerate', '10',
      '-loop', '1',
      '-i', `"${image_file.path}"`,
      '-i', `${audio_url}`,
      '-vf', '"scale=trunc(iw/2)*2:trunc(ih/2)*2,tinterlace=mode=interleave_top,setparams=field_mode=tff"',
      '-c:v', 'libx265',
      '-pix_fmt', 'yuv420p',
      '-crf', '41',
      '-preset', 'superfast',
      '-t', time.toString(),
      '-c:a', 'aac',
      '-b:a', '26k',
      `"${video_path}"`
    ].join(' '));

    console.log(stderr);

    res.sendFile(video_path, {
      root: root_dir,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `inline; filename="${video_filename}"`,
      }
    });

    rm(image_file.path);
    // rmAsync(video_path);
  });