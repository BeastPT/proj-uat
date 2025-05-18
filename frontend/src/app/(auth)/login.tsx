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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(i18n.t('auth.errors.allFieldsRequired'));
      return;
    }
    
    setError("");
    try {
      await signIn(email, password);
      // Navigate to the home screen or any other screen after successful login
      // For example, you can use router.push('/') to navigate to the home screen
      router.replace("/(tabs)");

      // The AuthContext will handle navigation
    } catch (error) {
      // No need to log expected authentication errors
      setError(i18n.t('auth.errors.invalidCredentials'));
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
              source={require("@/src/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{i18n.t('auth.login.title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('auth.login.subtitle')}</Text>

          <View style={styles.form}>
            <AuthInput
              label={i18n.t('auth.login.email')}
              placeholder={i18n.t('auth.login.emailPlaceholder')}
              placeholderTextColor={Colors.dark.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthInput
              label={i18n.t('auth.login.password')}
              placeholder={i18n.t('auth.login.passwordPlaceholder')}
              placeholderTextColor={Colors.dark.textMuted}
              value={password}
              onChangeText={setPassword}
              isPassword
              isPasswordVisible={isPasswordVisible}
              onTogglePasswordVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{i18n.t('auth.login.forgotPassword')}</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthButton
              title={i18n.t('auth.login.signIn')}
              onPress={handleLogin}
              isLoading={isLoading}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>{i18n.t('auth.login.noAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>{i18n.t('auth.login.signUp')}</Text>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: SPACING.md,
  },
  forgotPasswordText: {
    color: Colors.dark.brand,
    fontSize: 14,
    fontFamily: "Inter",
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 14,
    marginBottom: SPACING.md,
    textAlign: "center",
    fontFamily: "Inter",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: Colors.dark.textBody,
    fontSize: 14,
    fontFamily: "Inter",
  },
  registerLink: {
    color: Colors.dark.brand,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
});