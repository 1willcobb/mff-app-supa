import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import morro from "@/constants/images/morro.jpg";
import apiClient, { saveSession } from "@/api.client"; // Adjust path

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between SignUp & Login

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }
    setPasswordMatchError("");

    try {
      setIsLoading(true);
      const response = await apiClient.post("/auth/signup", {
        fullName,
        username,
        password,
      });

      if (response.status === 201 && response.data.sessionId) {
        await saveSession(response.data.sessionId);
        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setErrorMessage(response.data?.message || "Signup failed.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    console.log("Logging in with:", { username, password });
    try {
      setIsLoading(true);
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      if (response.status === 200 && response.data.sessionId) {
        await saveSession(response.data.sessionId);
        setAuthUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={morro} className="w-full h-1/3" />
        <View className="px-5 flex-1 justify-center lg:w-1/2">
          <Text className="font-bold text-primary-600 text-center text-3xl mb-2">
            Welcome to MyFilmFriends!
          </Text>
          <Text className="text-center text-lg mt-2 text-gray-600">
            {isSignUp
              ? "Create an account to get started"
              : "Sign in to continue"}
          </Text>

          {errorMessage && (
            <Text className="text-red-500 mt-2 text-center">
              {errorMessage}
            </Text>
          )}

          <SafeAreaView>
            {isSignUp && (
              <View>
                <TextInput
                  className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md text-lg placeholder:text-gray-400"
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
                <TextInput
                  className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md text-lg placeholder:text-gray-400"
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            )}
            <TextInput
              className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md text-lg placeholder:text-gray-400"
              placeholder="Eamil"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <View className="flex-row items-center bg-white shadow-md w-full mt-4 rounded-md">
              <TextInput
                className="flex-1 py-3 px-4 text-lg placeholder:text-gray-400"
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
                  className="flex-1 py-3 px-4 text-lg placeholder:text-gray-400"
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

            {passwordMatchError && (
              <Text className="text-red-500 mt-2">{passwordMatchError}</Text>
            )}

            <TouchableOpacity
              className="bg-primary-600 py-3 px-4 mt-6 rounded-md text-lg"
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isSignUp ? "Sign Up" : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text className="text-primary-600 text-center">
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
