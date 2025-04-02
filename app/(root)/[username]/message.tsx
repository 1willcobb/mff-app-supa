import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserMessages = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>UserMessages {username}</Text>
    </View>
  );
};

export default UserMessages;
