import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import * as Tone from 'tone';
import './styles.css'; 

const root = document.getElementById('root');
const reactRoot = createRoot(root);
reactRoot.render(<Metronome />);

function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(0.5);
  const [selectedNote, setSelectedNote] = useState('C2');
  const [isPlaying, setIsPlaying] = useState(false);

  let synth = new Tone.Synth({ oscillator: { type: 'sine' } }).toMaster();
  synth.volume.value = Tone.gainToDb(volume);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        synth.triggerAttackRelease(selectedNote, '8n');
      }, (60 / bpm) * 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, bpm, selectedNote]);

  const handleStartStop = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    synth.volume.value = Tone.gainToDb(newVolume);
  };

  const handleNoteChange = (e) => {
    setSelectedNote(e.target.value);
  };

  return (
    <div className="card-container">
    <div className="card-content">
      <h1>Metronome</h1>
      <p>BPM: 
      <input
        type="number"
        value={bpm}
        onChange={(e) => setBpm(e.target.value)}
        disabled={isPlaying}
      /></p> 
      <label>
        <p>Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          disabled={isPlaying}
        /></p>
      </label>
      <label>
        Tone:
        <select value={selectedNote} onChange={handleNoteChange} disabled={isPlaying}>
          <option value="C2">C2</option>
          <option value="D2">D2</option>
          <option value="E2">E2</option>
          <option value="F2">F2</option>
          <option value="G2">G2</option>
          <option value="A2">A2</option>
          <option value="B2">B2</option>
        </select>
      </label>
      <button onClick={handleStartStop}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
    </div>
  );
}

export default Metronome;