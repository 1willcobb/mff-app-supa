import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import morro from "@/constants/images/morro.jpg";
import google from "@/constants/images/google.png";

const SignIn = () => {
  const handleLogin = () => {
    // Implement Google login logic here
    console.log("Google login pressed");
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image source={morro} className="w-full h-3/6" resizeMode="contain" />
        <View className="px-10">
          <Text className=" font-bold text-primary-600 text-center text-3xl">
            Welcome to MyFilmFriends!
          </Text>
          <Text className="text-center text-lg mt-2">Lets get you started</Text>
          <Text className="text-primary-600 font-bold text-center text-lg">
            POSTING YOUR SHIT
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zink-300 rounded-full w-full py-4 mt-4"
          >
            <View className="flex flex-row justify-center items-center">
              <Image source={google} className="w-5 h-5" resizeMode="contain" />
              <Text className="text-center text-lg font-bold text-primary-600 ml-2">
                Sign in with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
