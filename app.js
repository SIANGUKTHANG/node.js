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

// Route to handle video download requests
app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const downloadOptions = {
      format: 'best', // Download the best video and audio
      output: '%(title)s.%(ext)s', // Save with video title and extension
      cookiesFromBrowser: 'chrome',  // Use cookies from Chrome browser
    };

    // Start downloading
    const result = await exec(url, downloadOptions);

    // Once done, return the download URL
    res.json({ downloadUrl: `https://node-js-pzjp.onrender.com/download/${result.output}` });

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
