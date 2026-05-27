import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

export interface VideoFile {
  id: string;
  name: string;
  uri: string;
  size: number;
  duration?: number;
}

export function useVideoManager() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lade alle Videos aus dem Assets-Ordner
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoDir = `${FileSystem.documentDirectory}videos`;
        
        // Versuche, Dateien aus dem Verzeichnis zu lesen
        try {
          const files = await FileSystem.readDirectoryAsync(videoDir);
          const videoFiles = files
            .filter(file => file.endsWith('.mp4') || file.endsWith('.mov'))
            .map((file, index) => ({
              id: `video_${index}`,
              name: file.replace(/\.[^/.]+$/, ''),
              uri: `${videoDir}/${file}`,
              size: 0,
            }));
          
          setVideos(videoFiles);
        } catch (error) {
          console.log('Video-Ordner nicht gefunden, verwende Standard-Videos');
          // Fallback auf vordefinierte Videos
          setVideos(getDefaultVideos());
        }
      } catch (error) {
        console.error('Fehler beim Laden der Videos:', error);
        setVideos(getDefaultVideos());
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Hole ein Video nach ID
  const getVideoById = (id: string): VideoFile | undefined => {
    return videos.find(v => v.id === id);
  };

  // Hole Videos für eine Übung
  const getVideosForExercise = (exerciseName: string): VideoFile[] => {
    return videos.filter(v => 
      v.name.toLowerCase().includes(exerciseName.toLowerCase())
    );
  };

  return {
    videos,
    isLoading,
    getVideoById,
    getVideosForExercise,
  };
}

// Standard-Videos (Fallback)
function getDefaultVideos(): VideoFile[] {
  return [
    { id: 'vid_1', name: 'Latziehen', uri: 'VID-20231103-WA0002.mp4', size: 0 },
    { id: 'vid_2', name: 'Rudern', uri: 'VID-20231103-WA0003.mp4', size: 0 },
    { id: 'vid_3', name: 'Einarmiges Rudern', uri: 'VID-20231103-WA0004.mp4', size: 0 },
    { id: 'vid_4', name: 'Langhantel-Rudern', uri: 'VID-20231103-WA0005.mp4', size: 0 },
    { id: 'vid_5', name: 'Reverse Flys', uri: 'VID-20231103-WA0006.mp4', size: 0 },
    { id: 'vid_6', name: 'Langhantel-Curls', uri: 'VID-20231103-WA0007.mp4', size: 0 },
    { id: 'vid_7', name: 'Hammer-Curls', uri: 'VID-20231103-WA0008.mp4', size: 0 },
    { id: 'vid_8', name: 'Konzentrations-Curls', uri: 'VID-20231103-WA0009.mp4', size: 0 },
  ];
}
