//tsrafce

import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

type Props = {}

const index = (props: Props) => {
    return (
        <View>
            <Text>This is index</Text>
            <Link href={"/signIn"}>Go to Sign In</Link>
            <Link href={"/signUp"}>Go to Sign Up</Link>
        </View>
    )
}

export default index