import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const singlepost = () => {
  const { username } = useLocalSearchParams();
  return (
    <View>
      <Text>singlepost {username}</Text>
    </View>
  );
};

export default singlepost;
