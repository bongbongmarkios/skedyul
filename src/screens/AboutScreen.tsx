import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { getTheme } from '../styles/theme';

const AboutScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Skedyul
        </Text>
        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          An advanced offline school planner designed to help students stay organized and on top of their academic responsibilities.
        </Text>
        <Text style={[styles.features, { color: theme.colors.textSecondary }]}>
          Features:{'\n'}
          • Schedule management{'\n'}
          • Task tracking{'\n'}
          • Grade tracking{'\n'}
          • Teacher management{'\n'}
          • Offline-first design{'\n'}
          • Modern UI/UX
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AboutScreen;
