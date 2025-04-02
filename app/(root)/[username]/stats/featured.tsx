import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const UserStatsFeatured = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>UserStatsFeatured {username}</Text>
    </View>
  );
};

export default UserStatsFeatured;
