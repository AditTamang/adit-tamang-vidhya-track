import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

type Props = {}

const SignUp = (props: Props) => {
    return (
        <View>
            <Text>SignUp</Text>
            <Link href={"/signIn"}>Go to Sign In</Link>
        </View>
    )
}

export default SignUp