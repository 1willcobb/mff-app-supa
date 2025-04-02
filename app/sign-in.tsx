import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/api/auth/authContext"; // Import useAuth hook
import { useRouter } from "expo-router";
import morro from "@/constants/images/morro.jpg";

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const SignIn = () => {
  const router = useRouter();
  const { login, signUp, isLoggedIn } = useAuth(); // Use auth context
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match");
          return;
        }
        await signUp(fullName, username, email, password);
      } else {
        console.log("Logging in with from front end", email, password);
        await login(email, password);
      }
      // Check if user is logged in
      if (isLoggedIn) {
        // Navigate to Home (Explore) after successful login
        router.push("/explore");
      } else {
        setIsSignUp(true);
      }
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          flexGrow: 1,
          justifyContent: "between",
          alignItems: "center",
          marginBottom: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={morro}
          className="w-full h-1/3 object-top resize-y"
          style={{
            width: "100%",
            height: height * 0.3,
            resizeMode: "cover",
          }}
        />
        <View className="px-5 mt-10 flex justify-center lg:w-1/2">
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

          <View>
            {isSignUp && (
              <>
                <TextInput
                  className="bg-white shadow-md w-full py-3 px-4 rounded-md"
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                />
                <TextInput
                  className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md"
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
              </>
            )}

            <TextInput
              className="bg-white shadow-md w-full py-3 px-4 mt-4 rounded-md"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
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
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  {isSignUp ? "Sign Up" : "Login"}
                </Text>
              )}
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
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
