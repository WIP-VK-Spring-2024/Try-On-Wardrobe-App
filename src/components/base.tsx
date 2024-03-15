import React from 'react'
import { Footer } from './Footer'
import { Box, ScrollView } from '@gluestack-ui/themed'

export const BaseScreen = (props: any) => {
    return (
      <Box
        height="100%"
        {...props}
      >
        <ScrollView>
            {props.children}
        </ScrollView>
        <Footer navigation={props.navigation}/>
      </Box>
    )
}