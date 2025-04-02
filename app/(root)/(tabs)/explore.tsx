import { View, Text, Button } from 'react-native'
import React from 'react'
import route from '@react-navigation/native'
import { useRouter } from 'expo-router'

const Explore = () => {
const router = useRouter()

  return (
    <View>
      <Text>Explore</Text>
      <Button
        title="Go to Details"
        onPress={() => router.push('/modal')}
      />
    </View>
  )
}

export default Explore