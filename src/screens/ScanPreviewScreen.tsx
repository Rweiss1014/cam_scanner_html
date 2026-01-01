import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDocument } from '../database';
import { applyFilter, formatDate, saveImageToStorage } from '../imageProcessing';
import { FilterName, Page } from '../types';

const { width } = Dimensions.get('window');
const PREVIEW_SIZE = width - 40;

interface ScanPreviewScreenProps {
  route: any;
  navigation: any;
}

export default function ScanPreviewScreen({ route, navigation }: ScanPreviewScreenProps) {
  const { scannedImages } = route.params;
  const [pages, setPages] = useState<string[]>(scannedImages);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterName>('Original');
  const [isSaving, setIsSaving] = useState(false);

  const filters: FilterName[] = ['Original', 'Color', 'Grayscale', 'BW', 'Enhance'];

  const handleDeletePage = () => {
    if (pages.length === 1) {
      Alert.alert('Cannot Delete', 'Document must have at least one page.');
      return;
    }

    Alert.alert(
      'Delete Page',
      'Are you sure you want to delete this page?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newPages = pages.filter((_, index) => index !== currentIndex);
            setPages(newPages);
            if (currentIndex >= newPages.length) {
              setCurrentIndex(Math.max(0, newPages.length - 1));
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const documentTitle = formatDate(Date.now());
      const processedPages: Omit<Page, 'id'>[] = [];

      for (let i = 0; i < pages.length; i++) {
        const originalFilename = `original_${Date.now()}_${i}.jpg`;
        const originalUri = await saveImageToStorage(pages[i], originalFilename);

        const processedUri = await applyFilter(pages[i], selectedFilter);

        processedPages.push({
          originalUri,
          processedUri,
          filterName: selectedFilter,
          rotation: 0,
          order: i,
        });
      }

      await createDocument(documentTitle, processedPages);

      Alert.alert('Success', 'Document saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'ScanMain' }],
            });
            navigation.navigate('Files');
          },
        },
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: pages[currentIndex] }}
          style={styles.previewImage}
          resizeMode="contain"
        />

        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1} / {pages.length}
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePage}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter:</Text>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === item && styles.filterButtonTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.thumbnailContainer}>
        <FlatList
          horizontal
          data={pages}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => setCurrentIndex(index)}>
              <View
                style={[
                  styles.thumbnail,
                  currentIndex === index && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: item }} style={styles.thumbnailImage} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Document</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 8,
  },
  pageIndicator: {
    position: 'absolute',
    top: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pageIndicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  thumbnailContainer: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#007AFF',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1C1C1E',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
