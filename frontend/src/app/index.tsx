import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

type Props = {}

const index = (props: Props) => {
    return (
        <View>
            <Text>This is index</Text>
            <Link href={"/login"}>Go to Login</Link>
            <Link href={"/register"}>Go to Sign Up</Link>
        </View>
    )
}

export default index