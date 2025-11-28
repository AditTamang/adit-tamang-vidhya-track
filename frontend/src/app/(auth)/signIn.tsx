import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

type Props = {}

const SignIn = (props: Props) => {
    return (
        <View>
            <Text>This is SignIn</Text>
            <Link href={"/signUp"}>Go to Sign Up</Link>
        </View>
    )
}

export default SignIn