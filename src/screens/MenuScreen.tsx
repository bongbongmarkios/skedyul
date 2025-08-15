import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Storage
import { getProfile, getSettings } from '../storage';

// Types
import { Profile, Settings } from '../types';
import { getTheme } from '../styles/theme';

const MenuScreen: React.FC = () => {
  const navigation = useNavigation();
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

  const menuItems = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'Manage your personal information',
      icon: 'account',
      onPress: () => navigation.navigate('Profile' as never),
    },
    {
      id: 'teachers',
      title: 'Teachers',
      subtitle: 'Manage teacher information',
      icon: 'account-group',
      onPress: () => navigation.navigate('Teachers' as never),
    },
    {
      id: 'theme',
      title: 'Theme',
      subtitle: 'Customize app appearance',
      icon: 'palette',
      onPress: () => navigation.navigate('Theme' as never),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App information and version',
      icon: 'information',
      onPress: () => navigation.navigate('About' as never),
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'App preferences and data management',
      icon: 'cog',
      onPress: () => navigation.navigate('Settings' as never),
    },
  ];

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.profileInfo}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.surface }]}>
                  <MaterialCommunityIcons
                    name="account"
                    size={32}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.profileText}>
                  <Text style={styles.name}>{profile?.name || 'Student'}</Text>
                  <Text style={styles.bio}>{profile?.bio || 'Welcome to Skedyul!'}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Menu Items */}
        <View style={styles.content}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuItemSubtitle, { color: theme.colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  bio: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
});

export default MenuScreen;
