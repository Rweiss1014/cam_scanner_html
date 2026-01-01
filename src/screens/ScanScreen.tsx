import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen({ navigation }: any) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanDocument = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to scan documents.',
          [{ text: 'OK' }]
        );
        return;
      }

      setIsScanning(true);

      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 20,
        letUserAdjustCrop: true,
        responseType: 'imageFilePath',
      });

      setIsScanning(false);

      if (scannedImages && scannedImages.length > 0) {
        navigation.navigate('ScanPreview', { scannedImages });
      }
    } catch (error: any) {
      setIsScanning(false);
      if (error.message !== 'User canceled') {
        Alert.alert('Error', 'Failed to scan document. Please try again.');
        console.error('Scan error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="scan" size={100} color="#007AFF" />
        </View>

        <Text style={styles.title}>Document Scanner</Text>
        <Text style={styles.subtitle}>
          Scan receipts, notes, documents, and more
        </Text>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanDocument}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="camera" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.scanButtonText}>Scan Document</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.featureText}>Auto edge detection</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.featureText}>Multi-page scanning</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.featureText}>Professional filters</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 40,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    marginTop: 60,
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
});
