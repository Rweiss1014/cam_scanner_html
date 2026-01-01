import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { getDocument, updateDocument, deletePage, updatePageOrder } from '../database';
import { Document as DocType, ExportSettings } from '../types';

interface DocumentDetailScreenProps {
  route: any;
  navigation: any;
}

export default function DocumentDetailScreen({ route, navigation }: DocumentDetailScreenProps) {
  const { documentId } = route.params;
  const [document, setDocument] = useState<DocType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSettings] = useState<ExportSettings>({
    pageSize: 'Letter',
    margins: 20,
    includePageNumbers: true,
  });

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    try {
      const doc = await getDocument(documentId);
      setDocument(doc);
      setEditedTitle(doc.title);
    } catch (error) {
      console.error('Error loading document:', error);
      Alert.alert('Error', 'Failed to load document.');
      navigation.goBack();
    }
  };

  const handleSaveTitle = async () => {
    if (!document || !editedTitle.trim()) {
      Alert.alert('Error', 'Title cannot be empty.');
      return;
    }

    try {
      await updateDocument(document.id, editedTitle.trim());
      setIsEditing(false);
      loadDocument();
    } catch (error) {
      Alert.alert('Error', 'Failed to update title.');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!document || document.pages.length === 1) {
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
          onPress: async () => {
            try {
              await deletePage(document.id, pageId);
              loadDocument();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete page.');
            }
          },
        },
      ]
    );
  };

  const handleExportPDF = async () => {
    if (!document) return;

    try {
      setIsExporting(true);

      const pagesHtml = document.pages
        .map(
          (page, index) => `
          <div style="page-break-after: always; text-align: center; padding: ${exportSettings.margins}px;">
            <img src="${page.processedUri}" style="max-width: 100%; height: auto;" />
            ${
              exportSettings.includePageNumbers
                ? `<p style="margin-top: 10px; font-size: 12px; color: #666;">Page ${index + 1} of ${document.pages.length}</p>`
                : ''
            }
          </div>
        `
        )
        .join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              @page {
                size: ${exportSettings.pageSize === 'Letter' ? '8.5in 11in' : 'A4'};
                margin: 0;
              }
            </style>
          </head>
          <body>
            ${pagesHtml}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Export Document',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Success', `PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!document) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.titleInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              autoFocus
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveTitle}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{document.title}</Text>
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons name="pencil" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {document.pages.length} {document.pages.length === 1 ? 'page' : 'pages'}
          </Text>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="share-outline" size={20} color="#fff" />
                <Text style={styles.exportButtonText}>Export PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={document.pages}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item, index }) => (
          <View style={styles.pageCard}>
            <Image source={{ uri: item.processedUri }} style={styles.pageImage} />
            <View style={styles.pageOverlay}>
              <View style={styles.pageNumber}>
                <Text style={styles.pageNumberText}>{index + 1}</Text>
              </View>
              <TouchableOpacity
                style={styles.deletePageButton}
                onPress={() => handleDeletePage(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    flex: 1,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    paddingVertical: 4,
    marginRight: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  gridContainer: {
    padding: 12,
  },
  pageCard: {
    flex: 1,
    margin: 6,
    aspectRatio: 0.7,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  pageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pageNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pageNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deletePageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
