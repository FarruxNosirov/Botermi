import React, { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAppVersionInfo,
  getLatestVersion,
  getStoreUrl,
  compareVersions,
} from '../utils/getAppVersionInfo';
import { ForceUpdateModal } from './ForceUpdateModal';
import { SoftUpdateModal } from './SoftUpdateModal';

interface UpdateProviderProps {
  children: React.ReactNode;
}

const SNOOZE_KEY = '@update_snooze';
const SNOOZE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days (ms)

// Fallback store URLs
const IOS_STORE_URL = 'https://apps.apple.com/app/id6739219717';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.botermi.app';

const getDefaultStoreUrl = () => {
  return Platform.OS === 'ios' ? IOS_STORE_URL : ANDROID_STORE_URL;
};

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const [showForceUpdate, setShowForceUpdate] = useState(false);
  const [showSoftUpdate, setShowSoftUpdate] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState(getDefaultStoreUrl());

  // Check if update should be snoozed
  const shouldSnooze = useCallback(async () => {
    try {
      const snoozeUntil = await AsyncStorage.getItem(SNOOZE_KEY);
      if (!snoozeUntil) return false;

      const snoozeTime = parseInt(snoozeUntil, 10);
      if (Date.now() < snoozeTime) {
        return true; // Still snoozed
      }

      // Snooze expired, remove it
      await AsyncStorage.removeItem(SNOOZE_KEY);
      return false;
    } catch (error) {
      console.error('Error checking snooze:', error);
      return false;
    }
  }, []);

  // Set snooze for 7 days
  const snoozeFor7Days = useCallback(async () => {
    try {
      const snoozeUntil = Date.now() + SNOOZE_DURATION;
      await AsyncStorage.setItem(SNOOZE_KEY, String(snoozeUntil));
      setShowSoftUpdate(false);
    } catch (error) {
      console.error('Error setting snooze:', error);
    }
  }, []);

  // Evaluate version and show appropriate modal
  const evaluateVersion = useCallback(async () => {
    try {
      // Get current version
      const versionInfo = getAppVersionInfo();
      setCurrentVersion(versionInfo.formatted);

      // Get latest version from store
      const latest = await getLatestVersion();
      if (!latest) {
        setShowForceUpdate(false);
        setShowSoftUpdate(false);
        return;
      }
      setLatestVersion(latest);

      // Try to get store URL
      try {
        const url = await getStoreUrl({ country: 'us' });
        if (url) {
          setStoreUrl(url);
        }
      } catch (error) {
        // Use fallback URL (already set in state)
      }

      // Compare versions
      const updateType = compareVersions(versionInfo.version, latest);

      if (updateType === 'major') {
        // Major version - Force update
        setShowForceUpdate(true);
        setShowSoftUpdate(false);
        return;
      }

      if (updateType === 'minor' || updateType === 'patch') {
        // Minor/Patch version - Soft update (if not snoozed)
        const isSnoozed = await shouldSnooze();
        if (!isSnoozed) {
          setShowSoftUpdate(true);
        }
        return;
      }

      // No update needed
      setShowForceUpdate(false);
      setShowSoftUpdate(false);
    } catch (error) {
      console.error('Error evaluating version:', error);
    }
  }, [shouldSnooze, storeUrl]);

  // Navigate to store
  const handleUpdate = useCallback(async () => {
    try {
      const url = storeUrl || (await getStoreUrl());
      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        }
      }
    } catch (error) {
      console.error('Error opening store:', error);
    }
  }, [storeUrl]);

  // Check on app launch
  useEffect(() => {
    evaluateVersion();
  }, [evaluateVersion]);

  // Check when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        evaluateVersion();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [evaluateVersion]);

  return (
    <>
      {children}

      {/* Force update modal */}
      <ForceUpdateModal
        visible={showForceUpdate}
        currentVersion={currentVersion}
        latestVersion={latestVersion}
        onUpdate={handleUpdate}
      />

      {/* Soft update modal */}
      <SoftUpdateModal
        visible={showSoftUpdate}
        currentVersion={currentVersion}
        latestVersion={latestVersion}
        onUpdate={handleUpdate}
        onLater={snoozeFor7Days}
      />
    </>
  );
};
