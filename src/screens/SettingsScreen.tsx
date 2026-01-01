import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'export_settings';

export default function SettingsScreen() {
  const [pageSize, setPageSize] = useState<'Letter' | 'A4'>('Letter');
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [margins, setMargins] = useState(20);

  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settings) {
        const parsed = JSON.parse(settings);
        setPageSize(parsed.pageSize || 'Letter');
        setIncludePageNumbers(parsed.includePageNumbers ?? true);
        setMargins(parsed.margins || 20);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key: string, value: any) => {
    try {
      const currentSettings = {
        pageSize,
        includePageNumbers,
        margins,
        [key]: value,
      };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handlePageSizeChange = (size: 'Letter' | 'A4') => {
    setPageSize(size);
    saveSettings('pageSize', size);
  };

  const handlePageNumbersToggle = (value: boolean) => {
    setIncludePageNumbers(value);
    saveSettings('includePageNumbers', value);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Page Size</Text>
            <Text style={styles.settingDescription}>Default PDF page size</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[styles.optionButton, pageSize === 'Letter' && styles.optionButtonActive]}
            onPress={() => handlePageSizeChange('Letter')}
          >
            <Text
              style={[
                styles.optionText,
                pageSize === 'Letter' && styles.optionTextActive,
              ]}
            >
              Letter (8.5" × 11")
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, pageSize === 'A4' && styles.optionButtonActive]}
            onPress={() => handlePageSizeChange('A4')}
          >
            <Text
              style={[styles.optionText, pageSize === 'A4' && styles.optionTextActive]}
            >
              A4 (210mm × 297mm)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Page Numbers</Text>
            <Text style={styles.settingDescription}>Include page numbers in PDF exports</Text>
          </View>
          <Switch
            value={includePageNumbers}
            onValueChange={handlePageNumbersToggle}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutItem}>
          <Ionicons name="document-text-outline" size={24} color="#007AFF" />
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.aboutItem}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Document Scanner App</Text>
            <Text style={styles.aboutValue}>Built with React Native & Expo</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>

        <View style={styles.featureItem}>
          <Ionicons name="camera" size={20} color="#34C759" />
          <Text style={styles.featureText}>Auto edge detection</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="images" size={20} color="#34C759" />
          <Text style={styles.featureText}>Multi-page scanning</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="color-filter" size={20} color="#34C759" />
          <Text style={styles.featureText}>Professional filters</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="document" size={20} color="#34C759" />
          <Text style={styles.featureText}>PDF export & sharing</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="phone-portrait" size={20} color="#34C759" />
          <Text style={styles.featureText}>Offline storage</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  optionTextActive: {
    color: '#fff',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  aboutInfo: {
    marginLeft: 16,
    flex: 1,
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  aboutValue: {
    fontSize: 14,
    color: '#8E8E93',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
});
