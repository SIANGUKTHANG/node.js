 const express = require('express');
const cors = require('cors');
const { exec } = require('yt-dlp-exec');  // Using yt-dlp-exec for downloading YouTube videos
const app = express();
const port = process.env.PORT || 3000;
  // Execute yt-dlp command
const result = await exec(url, downloadOptions);
const path = require('path');
const fs = require('fs');
// Enable CORS to allow requests from your Blogger frontend
app.use(cors());
app.use(express.json());  // Parse incoming JSON requests

// Route to handle video download requests
app.post('/download', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Download the video using yt-dlp
    const downloadOptions = {
      format: 'best',  // Download the best quality video
      output: '%(title)s.%(ext)s',  // Save with video title and extension
    };

  

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

    // If successful, send back the download link (you can host it wherever you want)
    res.json({ downloadUrl: `https://node-js-vao5.onrender.com/download/${result.output}` });
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: 'Failed to download the video.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
