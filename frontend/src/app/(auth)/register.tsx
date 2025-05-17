import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import i18n from "@/src/i18n";
import AuthInput from "@/src/components/AuthInput";
import AuthButton from "@/src/components/AuthButton";
import { useAuth } from "@/src/context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(i18n.t('auth.errors.allFieldsRequired'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(i18n.t('auth.errors.passwordsDoNotMatch'));
      return;
    }
    
    setError("");
    try {
      await signUp(name, email, password);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Registration error:", error);
      setError(i18n.t('auth.errors.registrationFailed'));
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/src/assets/images/react-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{i18n.t('auth.register.title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('auth.register.subtitle')}</Text>

          <View style={styles.form}>
            <AuthInput
              label={i18n.t('auth.register.fullName')}
              placeholder="Enter your full name"
              placeholderTextColor={Colors.dark.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <AuthInput
              label={i18n.t('auth.register.email')}
              placeholder="Enter your email"
              placeholderTextColor={Colors.dark.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthInput
              label={i18n.t('auth.register.password')}
              placeholder="Create a password"
              placeholderTextColor={Colors.dark.textMuted}
              value={password}
              onChangeText={setPassword}
              isPassword
              isPasswordVisible={isPasswordVisible}
              onTogglePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            <AuthInput
              label={i18n.t('auth.register.confirmPassword')}
              placeholder="Confirm your password"
              placeholderTextColor={Colors.dark.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              isPasswordVisible={isPasswordVisible}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthButton
              title={i18n.t('auth.register.signUp')}
              onPress={handleRegister}
              isLoading={isLoading}
              style={{ marginTop: SPACING.md }}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{i18n.t('auth.register.haveAccount')} </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginLink}>{i18n.t('auth.register.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bgBase,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl * 2,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.textHeading,
    marginBottom: SPACING.xs,
    fontFamily: "Sora",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textMuted,
    marginBottom: SPACING.xl,
    fontFamily: "Inter",
  },
  form: {
    width: "100%",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: Colors.dark.textBody,
    fontSize: 14,
    fontFamily: "Inter",
  },
  loginLink: {
    color: Colors.dark.brand,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 14,
    marginBottom: SPACING.md,
    textAlign: "center",
    fontFamily: "Inter",
  },
});