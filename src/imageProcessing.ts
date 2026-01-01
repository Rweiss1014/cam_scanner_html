import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { FilterName } from './types';

const getDocumentDirectory = () => {
  return `${FileSystem.documentDirectory}scanned_docs/`;
};

export const ensureDirectoryExists = async () => {
  const dir = getDocumentDirectory();
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};

export const saveImageToStorage = async (uri: string, filename: string): Promise<string> => {
  await ensureDirectoryExists();
  const destinationUri = `${getDocumentDirectory()}${filename}`;
  await FileSystem.copyAsync({ from: uri, to: destinationUri });
  return destinationUri;
};

export const applyFilter = async (uri: string, filter: FilterName): Promise<string> => {
  if (filter === 'Original') {
    return uri;
  }

  const manipulateOptions: ImageManipulator.Action[] = [];

  switch (filter) {
    case 'Grayscale':
      manipulateOptions.push({ resize: { width: 2000 } });
      break;

    case 'BW':
      manipulateOptions.push({ resize: { width: 2000 } });
      break;

    case 'Enhance':
      manipulateOptions.push({ resize: { width: 2000 } });
      break;

    case 'Color':
    default:
      manipulateOptions.push({ resize: { width: 2000 } });
      break;
  }

  const result = await ImageManipulator.manipulateAsync(
    uri,
    manipulateOptions,
    { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
  );

  const filename = `processed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
  return await saveImageToStorage(result.uri, filename);
};

export const deleteImage = async (uri: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `Scan ${year}-${month}-${day} ${hour12}:${minutes} ${ampm}`;
};
