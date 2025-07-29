 const express = require('express');
const cors = require('cors');
const { exec } = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());  // Parse incoming JSON requests
 
app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const downloadOptions = {
      format: 'best', // Best quality video+audio
      output: 'downloads/%(title)s.%(ext)s', // Save in 'downloads' folder
       cookies: '/etc/secrets/cookies.txt', 
    };

    const result = await exec(url, downloadOptions);

    // Extract file path from yt-dlp result
    const downloadedFile = result.match(/Destination: (.*)/)?.[1] || null;

    if (downloadedFile) {
      const fileName = path.basename(downloadedFile);
      res.json({ downloadUrl: `https://node-js-pzjp.onrender.com/download/${fileName}` });
    } else {
      res.status(500).json({ error: 'Unable to parse downloaded file name.' });
    }

  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download the video.' });
  }
});

// Serve the downloaded video file
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join(__dirname, 'downloads', filename);

  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
