import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Post = () => {
  const { username, id } = useLocalSearchParams();
  return (
    <View>
      <Text>Post {username}{id}</Text>
    </View>
  );
};

export default Post;
