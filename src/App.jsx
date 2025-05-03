// src/App.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { Field, Label } from '@/components/fieldset';
import { Select } from '@/components/select';
import DropZone from '@/components/dropzone';
import './App.css';

export default function App() {
  const [filePaths, setFilePaths] = useState([]);
  const [status, setStatus] = useState('active');
  const [darkMode, setDarkMode] = useState(false);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleFileSelection = useCallback(async (paths) => {
    if (!paths) return;
    const newPaths = Array.isArray(paths) ? paths : [paths];
    console.log('Selected file paths:', newPaths);
    setFilePaths(fp => {
      const updated = [...fp, ...newPaths];
      console.log('Updated filePaths:', updated);
      return updated;
    });
    try {
      const result = await invoke('store_file_paths', { filePaths: newPaths });
      console.log('Rust response:', result);
    } catch (error) {
      console.error('Error invoking Rust command:', error);
    }
  }, []);

  const onClick = useCallback(async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [{ name: 'All Files', extensions: ['*'] }],
      });
      handleFileSelection(selected);
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  }, [handleFileSelection]);

  useEffect(() => {
    console.log('Registering drag-drop listener');
    const webview = getCurrentWebview();
    const dropZoneEl = dropZoneRef.current;
    const listenerPromise = webview.onDragDropEvent(event => {
      const physX = event.payload.position.x;
      const physY = event.payload.position.y;
      const dpr = window.devicePixelRatio || 1;
      const cssX = physX / dpr;
      const cssY = physY / dpr;
      const hovered = document.elementFromPoint(cssX, cssY);
      const isOver = dropZoneEl.contains(hovered);

      if (event.payload.type === 'over') {
        setIsOverDropZone(isOver);
      } else if (event.payload.type === 'drop' && isOver) {
        console.log('Dropped inside DZ:', event.payload.paths);
        handleFileSelection(event.payload.paths);
        setIsOverDropZone(false);
      } else if (event.payload.type === 'cancel') {
        setIsOverDropZone(false);
      }
    });

    return () => {
      listenerPromise.then(unlisten => unlisten());
    };
  }, [handleFileSelection]);

  return (
    <div className="main-container bg-white dark:bg-zinc-900 dark:text-gray-100 min-h-screen relative flex gap-8 p-8">
      <button
        className="absolute top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
        onClick={() => setDarkMode(d => !d)}
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className='left-container w-96 flex items-center justify-center'>
        <div className='dropzone-container flex flex-col gap-5'>
          <DropZone
            ref={dropZoneRef}
            isOverDropZone={isOverDropZone}
            onClick={onClick}
          >
            {filePaths.length === 0
              ? 'Drop/Select files here'
              : `${filePaths.length} file${filePaths.length > 1 ? 's' : ''}`}
          </DropZone>

          <Field>
            <Label>Output Format</Label>
            <Select
              name="status"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value=".mp3">.mp3</option>
              <option value=".mp4">.mp4</option>
              <option value=".mp5">.mp5</option>
              <option value=".mp6">.mp6</option>
            </Select>
          </Field>
        </div>
      </div>

      <div className="right-container flex flex-col flex-1 space-y-6">
        <Field>
          <Label>Project status</Label>
          <Select
            name="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="delayed">Delayed</option>
            <option value="canceled">Canceled</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}
