import React from 'react';
import { View, StyleSheet } from 'react-native';

const Container = ({ children, style }) => {
    return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        width: '100%',
    },
});

export default Container;
