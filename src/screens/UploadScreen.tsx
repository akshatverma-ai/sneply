import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { COLORS, MOODS, VIDEO_MODES } from '../constants';

const { width } = Dimensions.get('window');

export default function UploadScreen() {
  const { user } = useAuth();
  const { currentMood } = useApp();
  const [videoMode, setVideoMode] = useState<'spark' | 'deep'>('spark');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const moodConfig = MOODS[currentMood];

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const asset = result.assets[0];
        
        // Check video duration
        if (asset.duration) {
          const mode = asset.duration <= 60 ? 'spark' : 'deep';
          setVideoMode(mode);
        }
        
        setSelectedVideo(asset);
        setShowPreview(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setSelectedThumbnail(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick thumbnail');
    }
  };

  const recordVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const asset = result.assets[0];
        
        // Check video duration
        if (asset.duration) {
          const mode = asset.duration <= 60 ? 'spark' : 'deep';
          setVideoMode(mode);
        }
        
        setSelectedVideo(asset);
        setShowPreview(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo || !title.trim()) {
      Alert.alert('Error', 'Please select a video and add a title');
      return;
    }

    if (!selectedThumbnail) {
      Alert.alert('Error', 'Please select a thumbnail');
      return;
    }

    // Validate video duration based on mode
    if (selectedVideo.duration) {
      const minDuration = VIDEO_MODES[videoMode].minDuration;
      const maxDuration = VIDEO_MODES[videoMode].maxDuration;
      
      if (selectedVideo.duration < minDuration || selectedVideo.duration > maxDuration) {
        Alert.alert(
          'Error', 
          `Video duration must be between ${minDuration}s and ${maxDuration}s for ${videoMode} mode`
        );
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setIsUploading(false);
        
        Alert.alert(
          'Upload Successful!',
          `Your ${videoMode} video has been uploaded successfully.`,
          [
            { text: 'OK', onPress: () => resetForm() }
          ]
        );
      }, 2000);

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      Alert.alert('Error', 'Upload failed. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedVideo(null);
    setSelectedThumbnail(null);
    setTitle('');
    setDescription('');
    setTags('');
    setVideoMode('spark');
    setShowPreview(false);
    setUploadProgress(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Content</Text>
          <Text style={styles.subtitle}>
            Share your {currentMood} mood content with the world
          </Text>
          
          <View style={styles.moodIndicator}>
            <Text style={styles.moodText}>
              {moodConfig.icon} {moodConfig.name} Mode
            </Text>
          </View>
        </View>

        {/* Video Mode Selection */}
        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Content Mode</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeCard,
                videoMode === 'spark' && styles.modeCardActive,
                { borderColor: videoMode === 'spark' ? COLORS.accent : COLORS.border }
              ]}
              onPress={() => setVideoMode('spark')}
            >
              <Text style={styles.modeIcon}>⚡</Text>
              <Text style={styles.modeName}>Spark</Text>
              <Text style={styles.modeDuration}>30-60s</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modeCard,
                videoMode === 'deep' && styles.modeCardActive,
                { borderColor: videoMode === 'deep' ? COLORS.secondary : COLORS.border }
              ]}
              onPress={() => setVideoMode('deep')}
            >
              <Text style={styles.modeIcon}>🧠</Text>
              <Text style={styles.modeName}>Deep</Text>
              <Text style={styles.modeDuration}>5-20min</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Selection */}
        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Video</Text>
          
          {selectedVideo ? (
            <View style={styles.selectedVideoContainer}>
              <View style={styles.videoInfo}>
                <Text style={styles.videoName}>{selectedVideo.fileName || 'Selected Video'}</Text>
                <Text style={styles.videoDuration}>
                  Duration: {selectedVideo.duration ? formatDuration(selectedVideo.duration) : 'Unknown'}
                </Text>
                <Text style={styles.videoSize}>
                  Size: {Math.round((selectedVideo.fileSize || 0) / 1024 / 1024)}MB
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeVideoButton}
                onPress={() => setShowPreview(true)}
              >
                <Text style={styles.changeVideoText}>Preview</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videoButtonsContainer}>
              <TouchableOpacity
                style={styles.videoButton}
                onPress={pickVideo}
              >
                <Text style={styles.videoButtonIcon}>📁</Text>
                <Text style={styles.videoButtonText}>Choose Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.videoButton}
                onPress={recordVideo}
              >
                <Text style={styles.videoButtonIcon}>🎥</Text>
                <Text style={styles.videoButtonText}>Record Video</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Thumbnail Selection */}
        <View style={styles.thumbnailSection}>
          <Text style={styles.sectionTitle}>Thumbnail</Text>
          
          {selectedThumbnail ? (
            <View style={styles.selectedThumbnailContainer}>
              <View style={styles.thumbnailInfo}>
                <Text style={styles.thumbnailName}>Thumbnail Selected</Text>
                <Text style={styles.thumbnailSize}>
                  {Math.round((selectedThumbnail.fileSize || 0) / 1024)}KB
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeThumbnailButton}
                onPress={pickThumbnail}
              >
                <Text style={styles.changeThumbnailText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.thumbnailButton}
              onPress={pickThumbnail}
            >
              <Text style={styles.thumbnailButtonIcon}>🖼️</Text>
              <Text style={styles.thumbnailButtonText}>Choose Thumbnail</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Video Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter video title..."
              placeholderTextColor={COLORS.textTertiary}
              value={title}
              onChangeText={setTitle}
              editable={!isUploading}
              maxLength={100}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your video..."
              placeholderTextColor={COLORS.textTertiary}
              value={description}
              onChangeText={setDescription}
              editable={!isUploading}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tags</Text>
            <TextInput
              style={styles.input}
              placeholder="Add tags (comma separated)..."
              placeholderTextColor={COLORS.textTertiary}
              value={tags}
              onChangeText={setTags}
              editable={!isUploading}
            />
          </View>
        </View>

        {/* Upload Progress */}
        {isUploading && (
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Uploading...</Text>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${uploadProgress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{uploadProgress}%</Text>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!selectedVideo || !title.trim() || isUploading) && styles.uploadButtonDisabled
          ]}
          onPress={handleUpload}
          disabled={!selectedVideo || !title.trim() || isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Uploading...' : `Upload ${videoMode} Video`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Video Preview Modal */}
      <Modal
        visible={showPreview}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Video Preview</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>Video Preview</Text>
              <Text style={styles.previewDuration}>
                Duration: {selectedVideo?.duration ? formatDuration(selectedVideo.duration) : 'Unknown'}
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.modalButtonText}>Use This Video</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setSelectedVideo(null);
                  setShowPreview(false);
                }}
              >
                <Text style={styles.modalCancelText}>Choose Different</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
    textShadowColor: COLORS.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  moodIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  modeSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  modeCardActive: {
    backgroundColor: COLORS.surfaceHover,
  },
  modeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  modeName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  modeDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  videoSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  videoButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  videoButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  videoButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  videoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedVideoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  videoInfo: {
    marginBottom: 12,
  },
  videoName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  videoSize: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  changeVideoButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  changeVideoText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  thumbnailSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  thumbnailButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  thumbnailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedThumbnailContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.success,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnailInfo: {
    flex: 1,
  },
  thumbnailName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  thumbnailSize: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  changeThumbnailButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  changeThumbnailText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
    textAlign: 'center',
  },
  uploadButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: COLORS.success,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: COLORS.surfaceHover,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  previewContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  previewDuration: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: COLORS.surfaceHover,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
