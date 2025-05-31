import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/src/context/ThemeContext';
import { SPACING, RADIUS } from '@/src/constants/Spacing';
import { apiService } from '@/src/services/api.service';
import i18n from '@/src/i18n';

interface ReservationModalProps {
  visible: boolean;
  onClose: () => void;
  carId: string;
  carName: string;
  pricePerDay: number;
  onSuccess?: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  onClose,
  carId,
  carName,
  pricePerDay,
  onSuccess,
}) => {
  const { colors } = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate number of days and total price
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = days * pricePerDay;

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
    
    // If end date is before start date, update end date
    if (endDate < currentDate) {
      const newEndDate = new Date(currentDate);
      newEndDate.setDate(currentDate.getDate() + 1);
      setEndDate(newEndDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    
    // Ensure end date is after start date
    if (currentDate > startDate) {
      setEndDate(currentDate);
    } else {
      Alert.alert(i18n.t('reservation.invalidDateRange'));
    }
  };

  const handleReserve = async () => {
    try {
      setIsLoading(true);
      
      // Format dates as ISO strings
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      
      await apiService.createReservation({
        carId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      
      setIsLoading(false);
      Alert.alert(
        i18n.t('reservation.success'),
        i18n.t('reservation.successMessage'),
        [{ text: i18n.t('common.ok'), onPress: () => {
          onClose();
          if (onSuccess) onSuccess();
        }}]
      );
    } catch (error: any) {
      setIsLoading(false);
      
      const errorMessage = error.response?.data?.error || i18n.t('reservation.error');
      Alert.alert(i18n.t('reservation.failed'), errorMessage);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.bgElevated }]}>
          <Text style={[styles.title, { color: colors.textHeading }]}>
            {i18n.t('reservation.title')}
          </Text>
          
          <Text style={[styles.carName, { color: colors.textHeading }]}>
            {carName}
          </Text>
          
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, { color: colors.textBody }]}>
              {i18n.t('reservation.startDate')}
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.bgBase }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: colors.textBody }]}>
                {formatDate(startDate)}
              </Text>
            </TouchableOpacity>
            
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          
          <View style={styles.dateContainer}>
            <Text style={[styles.dateLabel, { color: colors.textBody }]}>
              {i18n.t('reservation.endDate')}
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.bgBase }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: colors.textBody }]}>
                {formatDate(endDate)}
              </Text>
            </TouchableOpacity>
            
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={new Date(startDate.getTime() + 86400000)} // Day after start date
              />
            )}
          </View>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textBody }]}>
                {i18n.t('reservation.days')}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.textHeading }]}>
                {days}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textBody }]}>
                {i18n.t('reservation.pricePerDay')}
              </Text>
              <Text style={[styles.summaryValue, { color: colors.textHeading }]}>
                ${pricePerDay}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textHeading, fontWeight: 'bold' }]}>
                {i18n.t('reservation.totalPrice')}
              </Text>
              <Text style={[styles.totalPrice, { color: colors.brand }]}>
                ${totalPrice}
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.bgBase }]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textBody }]}>
                {i18n.t('common.cancel')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.reserveButton, { backgroundColor: colors.brand }]}
              onPress={handleReserve}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.reserveButtonText}>
                  {i18n.t('reservation.reserve')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: SPACING.md,
  },
  modalContainer: {
    width: '100%',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    fontFamily: 'Sora',
  },
  carName: {
    fontSize: 18,
    marginBottom: SPACING.lg,
    fontFamily: 'Sora',
  },
  dateContainer: {
    marginBottom: SPACING.md,
  },
  dateLabel: {
    fontSize: 16,
    marginBottom: SPACING.xs,
    fontFamily: 'Inter',
  },
  dateButton: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
  summaryContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Sora',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
  reserveButton: {
    flex: 2,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Sora',
  },
});

export default ReservationModal;