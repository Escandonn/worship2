Quick Start
Get audio in under 60 seconds
No setup, no account, no waiting for an API key email that never arrives. Pick your language, copy the code, run it. That's it.

cURL
Python
JavaScript
Node.js
Node.js
Copy
const https = require('https');
const fs = require('fs');

function tts(text, voice = 'en-US-JennyNeural') {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ text, voice, rate: '+0%', pitch: '+0Hz' });
    const req = https.request({
      hostname: 'freetts.org',
      path: '/api/tts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data).file_id));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

tts('Hello from Node.js').then(id => {
  https.get(`https://freetts.org/api/audio/${id}`, res => {
    res.pipe(fs.createWriteStream('speech.mp3'));
  });
});
API Reference
Endpoints
Four endpoints, all straightforward. Generate audio, download it, grab the subtitles, or fetch the full voice list. No authentication headers, no tokens.

Base URL
https://freetts.org/api
POST
/tts
Generate text to speech audio. Send JSON with your text and voice preferences, get back a file_id you can use to download the MP3 and SRT.

Parameter	Type	Required	Default	Description
text	string	required	—	The text to synthesize. Max 1,000 characters (free tier). PRO: 10,000. Creator: 25,000.
voice	string	optional	en-US-JennyNeural	Voice name from GET /voices. Format: locale-NameNeural.
rate	string	optional	+0%	Speaking speed as percentage offset. Range: -50% to +100%.
pitch	string	optional	+0Hz	Pitch offset in Hz from baseline. Range: -20Hz to +20Hz.
Response — 200 OK
JSON
Copy
{ "file_id": "a3f7c012-58b4-4e2a-9d1c-0f83abc12345" }
GET
/audio/{file_id}
Download the generated MP3 file. Use the file_id returned by POST /tts. Files are available for 1 hour after generation.

Parameter	Type	Required	Description
file_id	string (UUID)	required	The file_id from the POST /tts response. Valid for 1 hour.
Response — 200 OK
Headers
Content-Type: audio/mpeg
Content-Disposition: attachment; filename="speech.mp3"
GET
/srt/{file_id}
Download the SRT subtitle file generated alongside the MP3. Same file_id, different endpoint. Word-level timestamps synchronized to the audio.

Response — 200 OK (sample)
SRT
1
00:00:00,000 --> 00:00:00,620
Hello

2
00:00:00,620 --> 00:00:01,100
from

3
00:00:01,100 --> 00:00:01,680
FreeTTS API
GET
/voices
Returns the complete list of available voices. Use the ShortName field as the voice parameter in POST /tts.

Response — 200 OK (truncated)
JSON
Copy
[
  {
    "ShortName": "en-US-JennyNeural",
    "Gender": "Female",
    "Locale": "en-US",
    "LocaleName": "English (United States)"
  },
  {
    "ShortName": "en-US-GuyNeural",
    "Gender": "Male",
    "Locale": "en-US",
    "LocaleName": "English (United States)"
  },
  // ... 400+ more
]
Parameters
Parameters in depth
Everything you need to know about voice, rate, and pitch. With examples.

voice
Any ShortName from our voice catalog. 400+ options. Format is always locale-NameNeural. Defaults to en-US-JennyNeural if omitted.

Browse the full gallery at freetts.org/voices or fetch the list dynamically from GET /api/voices.

en-US-JennyNeural
en-US-GuyNeural
en-GB-SoniaNeural
fr-FR-DeniseNeural
de-DE-KatjaNeural
ja-JP-NanamiNeural
zh-CN-XiaoxiaoNeural
ar-SA-ZariyahNeural
rate
Speaking speed as a percentage offset from the voice's default. +0% is normal speed. +50% is 50% faster. -20% is 20% slower. Range: -50% to +100%.

-50%
-20%
-10%
+0%
+10%
+25%
+50%
+100%
pitch
Pitch offset in Hertz relative to the voice's baseline pitch. +0Hz is the default. Higher values raise pitch, lower values deepen it. Range: -20Hz to +20Hz.

-20Hz
-10Hz
-5Hz
+0Hz
+5Hz
+10Hz
+20Hz