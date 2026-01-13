import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';

const PrimaryButton = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.primaryButtonText, disabled && styles.primaryButtonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const AuthScreen = ({setIsLoggedIn}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [showAreaModal, setShowAreaModal] = useState(false);
  const areas = ['Connaught Place', 'Dwarka', 'Rohini', 'Karol Bagh', 'Saket'];

  const handleSendOtp = () => {
    if (mobileNumber.length === 10) {
      setOtpSent(true);
      console.log('OTP sent to +91' + mobileNumber);
    }
  };

  const signIn = async (userData)=>{
    try{
      await AsyncStorage.setItem('isUserLoggedIn', 'true');
      const userDataString = JSON.stringify(userData);
      await AsyncStorage.setItem('user', userDataString);
      setIsLoggedIn(true);
    }
    catch(e){
      Alert.alert('error!')
    }
  }

  const handleVerifyOtp = () => {
    if (otp.length === 6) {
      setOtpVerified(true);
      console.log('OTP verified successfully');
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setShowAreaModal(false);
  };

  const handleContinue = () => {
    const userData = {
      fullName,
      mobileNumber: '+91' + mobileNumber,
      selectedArea,
    };
    
    console.log('User data:', userData);
    signIn(userData)
    
  };

  const isSendOtpEnabled = fullName.trim().length > 0 && mobileNumber.length === 10;
  const isVerifyOtpEnabled = otp.length === 6;
  const isContinueEnabled = fullName.trim().length > 0 && otpVerified && selectedArea.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>No payment required to sign up</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#999999"
                value={mobileNumber}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  if (numericText.length <= 10) {
                    setMobileNumber(numericText);
                  }
                }}
                keyboardType="numeric"
                maxLength={10}
                editable={!otpVerified}
              />
            </View>
          </View>

          {/* Send OTP Button */}
          {!otpSent && (
            <PrimaryButton
              title="Send OTP"
              onPress={handleSendOtp}
              disabled={!isSendOtpEnabled}
            />
          )}

          {/* OTP Input Section (Shown after OTP is sent) */}
          {otpSent && !otpVerified && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter OTP</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#999999"
                  value={otp}
                  onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9]/g, '');
                    if (numericText.length <= 6) {
                      setOtp(numericText);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <PrimaryButton
                title="Verify OTP"
                onPress={handleVerifyOtp}
                disabled={!isVerifyOtpEnabled}
              />
            </>
          )}

          {/* OTP Verified Message */}
          {otpVerified && (
            <View style={styles.verifiedBox}>
              <Text style={styles.verifiedText}>✓ Mobile number verified</Text>
            </View>
          )}

          {/* Area Selection */}
          {otpVerified && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Area</Text>
              <TouchableOpacity
                style={styles.areaSelector}
                onPress={() => setShowAreaModal(true)}
              >
                <Text style={selectedArea ? styles.areaSelectorTextFilled : styles.areaSelectorText}>
                  {selectedArea || 'Choose your area'}
                </Text>
                <Text style={styles.areaSelectorIcon}>▼</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Continue Button */}
          {otpVerified && (
            <PrimaryButton
              title="Continue"
              onPress={handleContinue}
              disabled={!isContinueEnabled}
            />
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms & Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Area Selection Modal */}
      <Modal
        visible={showAreaModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAreaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Area</Text>
              <TouchableOpacity onPress={() => setShowAreaModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {areas.map((area, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.areaOption}
                  onPress={() => handleAreaSelect(area)}
                >
                  <Text style={styles.areaOptionText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  formSection: {
    flex: 1,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeBox: {
    height: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  primaryButton: {
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryButtonTextDisabled: {
    color: '#999999',
  },
  verifiedBox: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifiedText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  areaSelector: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  areaSelectorText: {
    fontSize: 16,
    color: '#999999',
  },
  areaSelectorTextFilled: {
    fontSize: 16,
    color: '#000000',
  },
  areaSelectorIcon: {
    fontSize: 12,
    color: '#666666',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#000000',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  modalClose: {
    fontSize: 24,
    color: '#666666',
  },
  areaOption: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  areaOptionText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default AuthScreen;