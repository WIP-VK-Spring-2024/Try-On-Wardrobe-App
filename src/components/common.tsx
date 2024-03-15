import React from 'react'
import { Text } from "@gluestack-ui/themed"

export const RobotoText = (props: any) => {
    return (
        <Text style={{fontFamily:'Roboto'}} {...props} >{props.children}</Text>
    )
};
