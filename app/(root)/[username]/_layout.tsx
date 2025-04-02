// app/(root)/[username]/_layout.tsx
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="message"
        options={{
          headerTitle: "Messages",
        }}
      />
      <Stack.Screen
        name="stats/index"
        options={{
          headerTitle: "User Stats",
        }}
      />
      <Stack.Screen
        name="p/index"
        options={{
          headerTitle: "User Posts",
        }}
      />
      <Stack.Screen
        name="p/[id]"
        options={{
          headerTitle: "Post Details",
        }}
      />
      <Stack.Screen
        name="p/post"
        options={{
          headerTitle: "Create/Edit Post",
        }}
      />
      <Stack.Screen
        name="stats/featured"
        options={{
          headerTitle: "Featured",
        }}
      />
      <Stack.Screen
        name="stats/following"
        options={{
          headerTitle: "following",
        }}
      />
      <Stack.Screen
        name="stats/followers"
        options={{
          headerTitle: "Followers",
        }}
      />
    </Stack>
  );
}
