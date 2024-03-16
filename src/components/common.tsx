import React from 'react'
import { Text } from "@gluestack-ui/themed"
import { observer } from 'mobx-react-lite'

export const RobotoText = observer((props: any) => {
    return (
        <Text style={{fontFamily:'Roboto'}} {...props} >{props.children}</Text>
    )
})
