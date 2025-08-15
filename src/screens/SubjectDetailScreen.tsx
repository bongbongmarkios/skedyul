import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { getTheme } from '../styles/theme';

const SubjectDetailScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = getTheme({ theme: colorScheme === 'dark' ? 'dark' : 'light' } as any);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Subject Details
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Coming soon...
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default SubjectDetailScreen;
