"use client";
import { useState } from "react";

export default function Home() {
  const [seconds, setSeconds] = useState(90);  // total countdown
  const [html, setHtml] = useState("");

  function generateHtml() {
    // Single-file HTML with NEW puzzles
    const doc =
"<!DOCTYPE html>" +
"<html lang='en'>" +
"<head>" +
"<meta charset='UTF-8' />" +
"<meta name='viewport' content='width=device-width, initial-scale=1.0' />" +
"<title>Escape Room — 3 Code Levels</title>" +
"<style>" +
"body { margin:0; font-family: ui-monospace, Menlo, Consolas, monospace; color:white; text-align:center;" +
"       background:#000 url('https://cdn.pixabay.com/photo/2016/03/27/07/08/room-1284212_1280.jpg') center/cover no-repeat fixed;" +
"       min-height:100vh; display:flex; align-items:center; justify-content:center; }" +
".overlay { background:rgba(0,0,0,0.65); padding:28px; border-radius:12px; width:min(760px,94%); text-align:left; box-shadow:0 10px 30px rgba(0,0,0,.4); }" +
"h1 { margin:0 0 8px; font-size:28px; }" +
".muted { opacity:.9; margin:0 0 14px; }" +
".row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin:12px 0; }" +
"input, button, textarea { font-size:15px; border:none; border-radius:8px; }" +
"textarea { width:100%; height:160px; padding:10px; background:#0b0b0b; color:#f5f5f5; }" +
"button { padding:10px 14px; background:#2563eb; color:#fff; cursor:pointer; font-weight:600; }" +
"button.secondary { background:#111; }" +
"#timer { font-weight:700; }" +
"#msg { margin-top:12px; font-size:16px; }" +
".success { color:#22c55e; } .fail { color:#ef4444; }" +
".levelTag { display:inline-block; padding:6px 10px; border-radius:999px; background:#111; margin-right:8px; }" +
".hint { background:rgba(255,255,255,.06); border-radius:10px; padding:10px; margin-top:10px; }" +
"</style>" +
"</head>" +
"<body>" +
"<div class='overlay' role='application' aria-label='Escape Room Code Challenge'>" +
"  <div class='row'><div class='levelTag' id='levelTag'>Level 1 / 3 — Easy</div><div id='timer'>Time Left: " + seconds + "s</div></div>" +
"  <h1 id='title'>💻 Code Your Way Out</h1>" +
"  <p class='muted' id='desc'>Write a function <b>greet(name)</b> that returns <code>\"hello, \" + name</code>. We will call <code>greet(\"agent\")</code> and expect <code>\"hello, agent\"</code>.</p>" +
"  <div class='hint' id='hint'>Starter: <code>function greet(name){ return \"hello, \"+name; }</code></div>" +
"  <textarea id='code' placeholder='Type your code here...'></textarea>" +
"  <div class='row'>" +
"    <button onclick='runCode()'>Run Code</button>" +
"    <button class='secondary' onclick='resetCode()'>Reset</button>" +
"  </div>" +
"  <div id='msg' aria-live='polite'></div>" +
"</div>" +
"<script>" +
// backgrounds per level
"var levelBackgrounds=[" +
"  \"https://cdn.pixabay.com/photo/2016/03/27/07/08/room-1284212_1280.jpg\"," +   // Level 1 room
"  \"https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1500&q=80\"," + // Level 2 lab
"  \"https://images.unsplash.com/photo-1520697222868-8f37c1b96f9e?auto=format&fit=crop&w=1500&q=80\"" +  // Level 3 vault
"]; " +
// NEW levels
"var levels=[" +
" {title:\"Level 1 / 3 — Easy\", desc:\"Write function greet(name){ return \\\"hello, \\\" + name }. We will call greet(\\\"agent\\\").\", ph:\"function greet(name){ return \\\"hello, \\\" + name; }\", test:\"greet('agent')\", expect:\"hello, agent\"}," +
" {title:\"Level 2 / 3 — Medium\", desc:\"Write function sumArray(arr){ return the sum of all numbers }. We will call sumArray([2,3,5]) and expect 10.\", ph:\"function sumArray(arr){ var s=0; for(var i=0;i<arr.length;i++){ s+=arr[i]; } return s; }\", test:\"sumArray([2,3,5])\", expect:10}," +
" {title:\"Level 3 / 3 — Difficult\", desc:\"Write function isPrime(n){ return true if n is prime }. We will call isPrime(97) and expect true.\", ph:\"function isPrime(n){ if(n<2) return false; for(var i=2;i*i<=n;i++){ if(n%i===0) return false;} return true; }\", test:\"isPrime(97)\", expect:true}" +
"]; " +
// DOM refs
"var titleEl=document.getElementById('title');" +
"var descEl=document.getElementById('desc');" +
"var hintEl=document.getElementById('hint');" +
"var tagEl=document.getElementById('levelTag');" +
"var codeEl=document.getElementById('code');" +
"var msgEl=document.getElementById('msg');" +
// state
"var current=0;" +
"var totalLevels=levels.length;" +
// set initial UI
"function applyLevel(i){" +
"  var L=levels[i];" +
"  tagEl.textContent=L.title;" +
"  descEl.innerHTML=L.desc;" +
"  hintEl.innerHTML='Starter: <code>'+L.ph.replace(/</g,\"&lt;\")+'</code>';" +
"  codeEl.value=L.ph;" +
"  document.body.style.backgroundImage='url('+levelBackgrounds[i]+')';" +
"}" +
"applyLevel(0);" +
// countdown
"var time=" + seconds + ";" +
"var tEl=document.getElementById('timer');" +
"var timer=setInterval(function(){" +
"  time--; tEl.textContent='Time Left: '+time+'s';" +
"  if(time<=0){ clearInterval(timer); msgEl.innerHTML='<span class=\"fail\">⛔ Time is up! You are trapped!</span>'; disableInputs(); }" +
"},1000);" +
// helpers
"function disableInputs(){ codeEl.setAttribute('disabled','disabled'); }" +
"function enableInputs(){ codeEl.removeAttribute('disabled'); }" +
"function resetCode(){ codeEl.value=levels[current].ph; msgEl.textContent=''; }" +
// run and check user code
"function runCode(){ " +
"  if(time<=0){ return; }" +
"  var L=levels[current];" +
"  var code=codeEl.value;" +
"  msgEl.textContent='';" +
"  try { " +
"    var fn = new Function(code+'; return ('+L.test+');');" +
"    var result = fn();" +
"    var expected = L.expect; " +
"    var ok = false;" +
"    if(typeof expected==='string'){ ok = String(result)===expected; }" +
"    else if(typeof expected==='number'){ ok = Number(result)===expected; }" +
"    else { ok = result===expected; }" +
"    if(ok) { " +
"      if(current===totalLevels-1) { " +
// final success
"        clearInterval(timer);" +
"        document.body.style.backgroundImage=\"url('https://cdn.pixabay.com/photo/2020/05/25/18/38/door-5220704_1280.jpg')\";" +
"        msgEl.innerHTML='<span class=\"success\">🎉 You solved all levels — the vault opens and you escape!</span>'; " +
"        disableInputs();" +
"      } else { " +
// next level
"        current++; " +
"        msgEl.innerHTML='<span class=\"success\">✅ Level passed! Proceeding to the next room...</span>'; " +
"        setTimeout(function(){ applyLevel(current); msgEl.textContent=''; }, 700);" +
"      }" +
"    } else {" +
"      msgEl.innerHTML='<span class=\"fail\">❌ Wrong output for <code>'+L.test.replace(/</g,'&lt;')+'</code>. Try again.</span>'; " +
"    }" +
"  } catch(e) { " +
"    msgEl.innerHTML='<span class=\"fail\">⚠️ Code error: '+e.message+'</span>'; " +
"  }" +
"}" +
"</script>" +
"</body>" +
"</html>";

    setHtml(doc);
  }

  function playNow() {
    if (!html) { alert("Generate first!"); return; }
    const w = window.open("", "_blank");
    if (!w) { alert("Popup blocked."); return; }
    w.document.write(html);
    w.document.close();
  }

  function downloadHtml() {
    if (!html) { alert("Generate first!"); return; }
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "escape-room-3-levels.html";
    a.click();
  }

  return (
    <div className="min-h-screen flex flex-col items-center text-center p-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">🧩 Escape Room Builder — 3 Levels (New Puzzles)</h1>

      <div className="flex gap-3 items-center mb-4">
        <label className="font-semibold">Total Timer (seconds)</label>
        <input
          type="number"
          min={30}
          max={600}
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        />
      </div>

      <div className="mt-2">
        <button onClick={generateHtml} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Generate Game</button>
        <button onClick={playNow} className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Play Now</button>
        <button onClick={downloadHtml} className="ml-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded">Download</button>
      </div>

      <textarea
        className="w-full max-w-3xl h-64 mt-5 p-2 border rounded text-left text-sm bg-white"
        value={html}
        readOnly
        placeholder="Generated game HTML will appear here..."
      />
    </div>
  );
}


