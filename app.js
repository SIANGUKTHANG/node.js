 const express = require('express');
const cors = require('cors');
const { exec } = require('yt-dlp-exec');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and handle JSON requests
app.use(cors());
app.use(express.json());

// Route to handle video download requests
app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const downloadOptions = {
      format: 'best',
      output: '%(title)s.%(ext)s',
    };

    const { output } = await exec(url, downloadOptions);
    const filename = output.split("/").pop();

    // Once the video is downloaded, provide the download link to the frontend
    res.json({
      downloadUrl: `https://node-js-pzjp.onrender.com/download/${filename}`
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download the video.' });
  }
});

// Route to serve the video file
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const videoPath = path.join(__dirname, 'downloads', filename);

  if (fs.existsSync(videoPath)) {
    res.sendFile(videoPath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
