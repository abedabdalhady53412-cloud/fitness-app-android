import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface Alarm {
  id: string;
  nameAr: string;
  nameDe: string;
  hour: number;
  minute: number;
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

const STORAGE_KEY_ALARMS = 'alarms';

// Konfiguriere Benachrichtigungen
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // Lade Alarme beim Start
  useEffect(() => {
    loadAlarms();
    setupNotifications();
  }, []);

  // Überprüfe Alarme jede Minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAlarms();
    }, 60000); // Jede Minute

    return () => clearInterval(interval);
  }, [alarms]);

  const setupNotifications = useCallback(async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B35',
        sound: 'default',
      });
    }
  }, []);

  const loadAlarms = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_ALARMS);
      if (stored) {
        setAlarms(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Fehler beim Laden der Alarme:', error);
    }
  }, []);

  const saveAlarms = useCallback(async (newAlarms: Alarm[]) => {
    try {
      setAlarms(newAlarms);
      await AsyncStorage.setItem(STORAGE_KEY_ALARMS, JSON.stringify(newAlarms));
    } catch (error) {
      console.error('Fehler beim Speichern der Alarme:', error);
    }
  }, []);

  const addAlarm = useCallback(
    (nameAr: string, nameDe: string, hour: number, minute: number) => {
      const newAlarm: Alarm = {
        id: `alarm_${Date.now()}`,
        nameAr,
        nameDe,
        hour,
        minute,
        enabled: true,
        sound: true,
        vibration: true,
      };
      saveAlarms([...alarms, newAlarm]);
    },
    [alarms, saveAlarms]
  );

  const deleteAlarm = useCallback(
    (id: string) => {
      saveAlarms(alarms.filter(a => a.id !== id));
    },
    [alarms, saveAlarms]
  );

  const toggleAlarm = useCallback(
    (id: string) => {
      saveAlarms(
        alarms.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a))
      );
    },
    [alarms, saveAlarms]
  );

  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    alarms.forEach(alarm => {
      if (
        alarm.enabled &&
        alarm.hour === currentHour &&
        alarm.minute === currentMinute
      ) {
        triggerAlarm(alarm);
      }
    });
  }, [alarms]);

  const triggerAlarm = useCallback(async (alarm: Alarm) => {
    try {
      // Sende Benachrichtigung
      await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.nameAr,
          body: `⏰ ${alarm.nameAr} - ${alarm.hour}:${String(alarm.minute).padStart(2, '0')}`,
          sound: alarm.sound ? 'default' : undefined,
          badge: 1,
        } as any,
        trigger: null,
      });

      // Zusätzliche Vibration für Android
      if (Platform.OS === 'android' && alarm.vibration) {
        try {
          const Haptics = await import('expo-haptics');
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (e) {
          // Haptics nicht verfügbar
        }
      }
    } catch (error) {
      console.error('Fehler beim Auslösen des Alarms:', error);
    }
  }, []);

  const getNextAlarm = useCallback((): Alarm | null => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const enabledAlarms = alarms.filter(a => a.enabled);
    const futureAlarms = enabledAlarms.filter(
      a => a.hour * 60 + a.minute > currentMinutes
    );

    if (futureAlarms.length > 0) {
      return futureAlarms.sort(
        (a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute)
      )[0];
    }

    return null;
  }, [alarms]);

  return {
    alarms,
    addAlarm,
    deleteAlarm,
    toggleAlarm,
    getNextAlarm,
  };
}
