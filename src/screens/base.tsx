import React from 'react';
import {Footer} from '../components/Footer';
import {Box, ScrollView, Text} from '@gluestack-ui/themed';
import {observer} from 'mobx-react-lite';

export const BaseScreen = observer((props: any) => {
  const footer = props.footer || <Footer navigation={props.navigation} />;
  return (
    <Box height="100%" {...props}>
      <ScrollView>{props.children}</ScrollView>
      {footer}
    </Box>
  );
});
