// components/ControlBar.tsx
import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/api/auth/authContext";

export default function ControlBar() {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => {
      return pathname.includes(path);
    },
    [pathname]
  );

  console.log('Current Platform:', Platform.OS);
  console.log('Platform Version:', Platform.Version);

  const id = user?.id;
  const username = user?.username;

  const containerStyle = {
    ...Platform.select({
      ios: {
        height: 65,
        paddingBottom: 10,
        
      },
      android: {
        height: 55,
        paddingBottom: 5,
      },
      default: {
        height: 55,
      },
    }),
  };

  return (
    <SafeAreaView
      style={[
        {
          position: "absolute",
          backgroundColor: "white",
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
        onPress={() => router.push("/friends")}
      >
        <MaterialCommunityIcons
          name="film"
          size={24}
          color={isActive("friends") ? "black" : "gray"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
        onPress={() => router.push("/explore")}
      >
        <Octicons
          name="search"
          size={24}
          color={isActive("explore") ? "black" : "gray"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
        onPress={() => router.push(`/me/${id}/upload`)}
      >
        <Ionicons
          name="add-circle"
          size={24}
          color={isActive("upload") ? "black" : "gray"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
        onPress={() => router.push(`/${username}`)}
      >
        {user?.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              ...(isActive(username || "") && {
                borderWidth: 1,
                borderColor: "black",
              }),
            }}
          />
        ) : (
          <MaterialCommunityIcons
            name="account"
            size={24}
            color={isActive(username || "") ? "black" : "gray"}
          />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
