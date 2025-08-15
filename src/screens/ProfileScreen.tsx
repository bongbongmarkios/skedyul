import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useColorScheme } from 'react-native';

// Storage
import { getProfile, getSettings } from '../storage';

// Types
import { Profile, Settings } from '../types';
import { getTheme } from '../styles/theme';

const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = settings ? getTheme(settings) : getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, settingsData] = await Promise.all([
        getProfile(),
        getSettings(),
      ]);

      setProfile(profileData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Profile
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Name: {profile?.name || 'Student'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Bio: {profile?.bio || 'Welcome to Skedyul!'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProfileScreen;
