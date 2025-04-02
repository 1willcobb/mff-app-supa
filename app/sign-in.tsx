import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/api/auth/authContext";
import { useRouter } from "expo-router";
import morro from "@/constants/images/morro.jpg";
import { Dimensions } from "react-native";
import { UserRegistration } from "@/api/types/user.types";

const { height } = Dimensions.get("window");

const SignIn = () => {
  const router = useRouter();
  const { user, login, signup, error, isLoading, isAuthenticated } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if the user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/(root)/(tabs)/explore");
    }
  }, [isAuthenticated, user, router]);

  // Update local error message when error from auth context changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const validateForm = () => {
    // Clear previous error
    setErrorMessage("");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }

    // Additional validation for sign up
    if (isSignUp) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return false;
      }

      if (!name.trim()) {
        setErrorMessage("Full name is required");
        return false;
      }

      if (!username.trim()) {
        setErrorMessage("Username is required");
        return false;
      }
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    
    try {
      if (isSignUp) {
        const registrationData: UserRegistration = {
          name,
          username,
          email,
          password
        };
        
        const user = await signup(registrationData);
        
        if (user) {
          console.log("User registered successfully:", user);
          router.replace("/(root)/(tabs)/explore");
        }
      } else {
        const user = await login(email, password);
        
        if (user) {
          console.log("User logged in successfully:", user);
          router.replace("/(root)/(tabs)/explore");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // Error will be handled by the auth context and displayed via useEffect
    } finally {
      setFormLoading(false);
    }
  };

  // If we're loading from auth context
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "between",
          alignItems: "center",
          marginBottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={morro}
          className="w-full h-1/3 object-top"
          style={{
            width: "100%",
            height: height * 0.3,
            resizeMode: "cover",
          }}
        />
        <View className="px-5 mt-10 flex justify-center w-full max-w-md">
          <Text className="font-bold text-primary-600 text-center text-3xl mb-2">
            Welcome to MyFilmFriends!
          </Text>
          <Text className="text-center text-lg mt-2 text-gray-600">
            {isSignUp
              ? "Create an account to get started"
              : "Sign in to continue"}
          </Text>

          {errorMessage ? (
            <Text className="text-red-500 mt-2 text-center">
              {errorMessage}
            </Text>
          ) : null}

          <View className="mt-4">
            {isSignUp && (
              <>
                <TextInput
                  className="bg-white shadow-md w-full py-3 px-4 rounded-md"
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                />
                <TextInput
                  className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md"
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </>
            )}

            <TextInput
              className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View className="flex-row items-center bg-white shadow-md w-full mt-4 rounded-md">
              <TextInput
                className="flex-1 py-3 px-4"
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="p-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            {isSignUp && (
              <View className="flex-row items-center bg-white shadow-md w-full mt-4 rounded-md">
                <TextInput
                  className="flex-1 py-3 px-4"
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  className="p-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Feather
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              className="bg-primary-600 py-3 px-4 mt-6 rounded-md"
              onPress={handleAuth}
              disabled={formLoading}
            >
              {formLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  {isSignUp ? "Sign Up" : "Login"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4"
              onPress={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage("");
              }}
            >
              <Text className="text-primary-600 text-center">
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;