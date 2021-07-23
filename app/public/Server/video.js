const express = require('express');
const videoRouter = express.Router();
const fs = require('fs');
const subsrt = require('subsrt');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');


let vidsPath = ''
let subPath = ''
let videoBitRate = '4096k'
let videoResolution = '720'
let audioBitRate = '360k'

const offSetSub = (offset)=>{
const content = fs.readFileSync(subPath, 'utf8')
const format = subsrt.detect(content);
const captions = subsrt.parse(content);
let resynced = subsrt.resync(captions, {offset:-offset*1000});
resynced = subsrt.build(resynced, {format});
fs.writeFileSync(path.join(__dirname,'..','..','SyncedSub.'+format), resynced);
console.log('synced');
}

const setVidsPath = (path)=>{
  vidsPath=path
}

const setSettings = (settings)=>{
  console.log(settings);
  videoBitRate= settings.videoBitRate
  videoResolution= settings.videoResolution
  audioBitRate= settings.audioBitRate
}

const setFFmpegLocation = (location)=>{
  ffmpeg.setFfprobePath(location+'/ffprobe.exe') 
  ffmpeg.setFfmpegPath(location+'/ffmpeg.exe') 
}

const getMetadata = (folderPath) =>
{
 return new Promise((resolve, reject) =>
 {
  fs.readdir(folderPath, (err, files) => {

    const data = []
    let filesNumbers = 0

    files.forEach(file => {
      
      if (path.extname(file)==='.mkv') {
        filesNumbers++
        let duration = 0
        let thumbnailPath = ''
        const audios = []
       
        ffmpeg.ffprobe(folderPath+'/'+file,(err, metadata)=> {

          duration= metadata.format.duration
          metadata.streams.forEach((elem,index)=>{
            if(elem.codec_type === 'audio'){
              audios.push(Boolean(elem.tags) ? elem.tags[Object.keys(elem.tags)[0]]: index)
            }
              
          }) 
        })

        ffmpeg(folderPath+'/'+file)
        .on('filenames',(filenames)=> {
            thumbnailPath = "video/thumbnails?thumb=" +encodeURIComponent (filenames[0])
        })
        .on('end', function (filenames) {
          filesNumbers--
          data.push({
            name:file,
            thumbnailPath,
            duration,
            audioTracks:[...audios]
          })
          if (filesNumbers===0) {
            resolve(data);
          }
        })
        .on('error', function (err)  {
          reject(err);
        })
        .screenshots({
            count: 1,
            folder: vidsPath+'/thumbnails/',
            size: '320x240', 
            filename: 'thumbnail-%b.png'
        })
      }
    })
  }) 
 });
};

// Get metaData
videoRouter.get('/metadata',async  (req, res)=> {

  console.log(vidsPath);
  if(vidsPath==='')
  return res.json({ success: false,error:'No Folder Path'})

  const dir = path.join(vidsPath,'thumbnails')
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir)
    try {
      const metadata = await getMetadata(vidsPath)
      fs.writeFile(dir+'/metadata.json',JSON.stringify (metadata),(err)=>{})
      return res.json({ success: true ,metadata});
      } catch (error) {
        console.log(error);
        return res.json({ success: false,error});
      }

}else{
  fs.readFile(dir+'/metadata.json',(err, data) => {
    if (err) throw err;
    console.log('From Cach');
    jso = JSON.parse(data.toString())
    return res.json({ success: true ,metadata:jso});
  })
}
})

videoRouter.get('/thumbnails', (req,res)=>{
  res.sendFile(vidsPath+'/thumbnails/'+req.query.thumb)
})

// *********************************************


// transcode & stream
videoRouter.get('/video',  (req, res)=> {

  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoPath =vidsPath+'/'+req.query.play;
  const subOffset =req.query.subOffset | 0;
  
  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 100 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const headers= {
    'Accept-Ranges': 'bytes',
    'Connection':'keep-alive',
    'Content-Range':`bytes ${start}-${end}/${videoSize}`,
    'Transfer-Encoding':'chunked',
    "Content-Disposition":"inline",
    "Content-Transfer-Enconding":"binary",
    'Content-Type': 'video/ismv'
}

  res.writeHead(200, headers);

// *****************************
//     // save to stream


    const seektime = req.query.seek<0 ? 0 : req.query.seek
    const audioTrack = req.query.audioTrack

    

    const outOptions = [
    '-movflags frag_keyframe+empty_moov',
    '-frag_duration 10',
    '-threads 8',
    '-map 0:v:0',
    '-map 0:a:'+audioTrack,
  ]
  // 
  if (subPath.includes(req.query.play.replace(/\s/g,'').replace(/-|\[|\]/g,''))) {
    offSetSub(parseFloat(seektime)+parseFloat(subOffset))
    const t = path.join(__dirname,'..','..')
    const p = t.replace(/\\/g,'/').replace(/:/g,'\\\\:')+'/SyncedSub.'+subPath.split('.').pop()
    outOptions.push('-vf subtitles='+p)//+p.slice(2,p.length)
    console.log('subAded');
  }



    const ffmpegCommand = ffmpeg()
      .input(videoPath)
      .videoBitrate(videoBitRate)
      .videoCodec("libx264")
      .size( videoResolution +'x?')
      .seekInput(seektime)
      .audioBitrate(audioBitRate)
      .withOutputOptions(outOptions)
      .on('progress', (info) => {
        
      })
      .on('end', () => {
        console.log('file has been converted succesfully');
      })
      .on('error', (err, stdout, stderr) => {
        console.log(`Error: ${err.message}`);
        console.log(`ffmpeg stderr: ${stderr}`);
      })
      .outputFormat('mp4')
      .pipe(res,{ end:true })

      ffmpegCommand._destroy

});



videoRouter.post('/subs',(req, res)=>{
  const content = req.body.sub
  const name = req.body.name.replace(/\s/g,'').replace(/-|\[|\]/g,'')
  const format = subsrt.detect(content)
  let captions = subsrt.parse(content)
  captions = subsrt.build(captions, {format});
  fs.writeFileSync(path.join(vidsPath,name+'.'+format),captions);
  subPath=path.join(vidsPath,name+'.'+format)
  res.send(format)
})



module.exports = {videoRouter,setVidsPath,setSettings,setFFmpegLocation};


// normal video Stream
// videoRouter.get("/video", function (req, res) {
//   // Ensure there is a range given for the video
//   const range = req.headers.range;
//   if (!range) {
//     res.status(400).send("Requires Range header");
//   }

//   // get video stats (about 61MB)
//   const videoPath = "C:/soupa.mp4";
//   const videoSize = fs.statSync("C:/soupa.mp4").size;

//   // Parse Range
//   // Example: "bytes=32324-"
//   const CHUNK_SIZE = 10 ** 6; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//   // Create headers
//   const contentLength = end - start + 1;
//   const headers = {
//     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };

//   // HTTP Status 206 for Partial Content
//   res.writeHead(206, headers);

//   // create video read stream for this particular chunk
//   const videoStream = fs.createReadStream(videoPath, { start, end });

//   // Stream the video chunk to the client
//   videoStream.pipe(res);
// });
