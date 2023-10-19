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
  const [timeSignature, setTimeSignature] = useState('4/4'); 

  let synth = new Tone.Synth({ oscillator: { type: 'sine' } }).toMaster();
  synth.volume.value = Tone.gainToDb(volume);

  useEffect(() => {
    let interval;
    const beatsPerMeasure = parseInt(timeSignature.split('/')[0], 10);

    if (isPlaying) {
      interval = setInterval(() => {
        for (let i = 0; i < beatsPerMeasure; i++) {
          if (i === 0) {
            if (timeSignature === '3/4') {
              synth.triggerAttackRelease(selectedNote, '8n', Tone.now() + (i * (60 / bpm)) - 0.05);
            } else {
              synth.triggerAttackRelease(selectedNote, '8n', Tone.now() + (i * (60 / bpm)) - 0.02);
            }
          } else {
            synth.triggerAttackRelease(selectedNote, '8n', Tone.now() + (i * (60 / bpm)));
          }
        }
      }, (60 / bpm) * 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, bpm, selectedNote, timeSignature]);

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

  const handleTimeSignatureChange = (e) => {
    setTimeSignature(e.target.value);
  };

  const handlePlaySingleBeat = () => {
    synth.triggerAttackRelease(selectedNote, '8n', Tone.now());
  };

  return (
    <div className="card-container">
      <h1>Metonome</h1>
      <div className="card-content">
          
        <bpmInput>BPM: 
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            disabled={isPlaying}
          />
        </bpmInput>
        <label> Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={isPlaying}
          />    
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
        <div>
          <label>
          Time Signature:
          <select value={timeSignature} onChange={handleTimeSignatureChange} disabled={isPlaying}>
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            </select>
          </label>
        </div>
        <button onClick={handleStartStop} >
          {isPlaying ? 'Stop' : 'Start'}
        </button>
          <div>
          <button onClick={handlePlaySingleBeat}>
            Play Single Beat
          </button>
          </div>

      </div>
    </div>
  );
}

export default Metronome;
