import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/utils/authContext";
import { useRouter } from "expo-router";
import morro from "@/constants/images/morro.jpg";
import { Dimensions } from "react-native";

const { height } = Dimensions.get("window");

// Define interface for profile data if needed
interface ProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  created_at: Date;
}

const SignIn: React.FC = () => {
  const router = useRouter();
  const auth = useAuth();
  const { user, loading, error, signIn, signUp, supabaseClient } = auth;
  
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Check if the user is already authenticated
  useEffect(() => {
    if (user) {
      router.replace("/(root)/(tabs)/explore");
    }
  }, [user, router]);

  // Update local error message when error from auth context changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const validateForm = (): boolean => {
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

  const handleAuth = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    
    try {
      if (isSignUp) {
        // Use Supabase signUp
        const data = await signUp(email, password);
        
        if (data?.user && supabaseClient) {
          // Store additional user metadata in your Supabase profiles table
          const profileData: ProfileData = {
            id: data.user.id,
            name: name,
            username: username,
            email: email,
            created_at: new Date()
          };
          
          // Store profile data in Supabase database
          const { error: profileError } = await supabaseClient
            .from('user')
            .insert(profileData);
            
          if (profileError) throw profileError;
          
          console.log("User registered successfully:", data.user);
          // The auth state change will trigger navigation in useEffect
        }
      } else {
        // Use Supabase signIn
        const data = await signIn(email, password);
        
        if (data?.user) {
          console.log("User logged in successfully:", data.user);
          // The auth state change will trigger navigation in useEffect
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      setErrorMessage(error.message || "Authentication failed");
    } finally {
      setFormLoading(false);
    }
  };

  // If we're loading from auth context
  if (loading) {
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