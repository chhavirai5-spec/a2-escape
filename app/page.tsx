"use client";

import { useState } from "react";

export default function Home() {
  const [preset, setPreset] = useState("beginner");
  const [html, setHtml] = useState("");

  function generateHtml() {
    const htmlTemplate =
"<!DOCTYPE html>" +
"<html lang='en'>" +
"<head>" +
"<meta charset='UTF-8'>" +
"<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
"<title>Time Travel Escape Room</title>" +
"<style>" +
"body { font-family: Arial; background: url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1470&q=80'); background-size: cover; color: white; text-align: center; padding: 30px; }" +
".room { background: rgba(0,0,0,0.6); padding: 20px; border-radius: 10px; display: inline-block; }" +
"button { margin-top: 10px; padding: 10px 20px; border: none; border-radius: 6px; background: #2563eb; color: white; font-weight: bold; cursor: pointer; }" +
"input { margin-top: 10px; padding: 8px; border-radius: 4px; border: none; }" +
"</style>" +
"</head>" +
"<body>" +
"<div class='room'>" +
"<h1>🚪 Time Travel Escape (" + preset + ")</h1>" +
"<p id='stage'>Stage 1: Solve the riddle to power the portal!</p>" +
"<p><strong>Riddle:</strong> What has keys but can’t open locks?</p>" +
"<input id='answer' placeholder='Enter answer...' />" +
"<button onclick='checkAnswer()'>Submit</button>" +
"<p id='message'></p>" +
"</div>" +

"<script>" +
"let stage = 1;" +
"function checkAnswer(){" +
"  const ans = document.getElementById('answer').value.toLowerCase();" +
"  const msg = document.getElementById('message');" +
"  if(stage===1 && ans.includes('keyboard')){" +
"    msg.textContent = '✅ Correct! Moving to Stage 2...';" +
"    stage=2;" +
"    setTimeout(()=>{" +
"      document.querySelector('.room').innerHTML = '<h1>Stage 2: Prime Puzzle</h1><p>Enter any prime number greater than 10.</p><input id=\"num\"/><button onclick=\"checkAnswer()\">Submit</button><p id=\"message\"></p>';" +
"    },1000);" +
"  }" +
"  else if(stage===2){" +
"    const num = parseInt(document.getElementById('num').value);" +
"    if([11,13,17,19,23,29,31].includes(num)){" +
"      msg.textContent = '✅ You unlocked the portal!';" +
"      setTimeout(()=>{document.querySelector('.room').innerHTML='<h1>🎉 You Escaped!</h1><p>Congratulations, time traveler!</p>';},1000);" +
"    } else msg.textContent='❌ Try again!';" +
"  } else {" +
"    msg.textContent = '❌ Try again!';" +
"  }" +
"}" +
"</script>" +
"</body></html>";

    setHtml(htmlTemplate);
  }

  async function save() {
    if (!html) return alert("Generate first!");
    const res = await fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: preset, html }),
    });
    if (!res.ok) return alert("Save failed");
    alert("Saved successfully!");
  }

  function download() {
    if (!html) return alert("Generate first!");
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "escape-" + preset + ".html";
    a.click();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        🧩 Time Travel Lab Builder
      </h1>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 text-center space-y-4">
        <label className="block font-semibold text-gray-700">
          Choose Difficulty:
        </label>
        <select
          className="border rounded p-2"
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <div className="flex justify-center space-x-3 mt-4">
          <button
            onClick={generateHtml}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Generate
          </button>
          <button
            onClick={save}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={download}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Download
          </button>
        </div>

        <textarea
          readOnly
          value={html}
          data-testid="output-html"
          className="w-full h-64 border rounded p-2 mt-6 text-sm bg-gray-50 font-mono"
          placeholder="Generated HTML will appear here..."
        />
      </div>
    </main>
  );
}
