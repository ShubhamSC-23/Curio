import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const Card = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};

const CardBody = ({ children, style }) => {
    return <View style={[styles.body, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background.primary,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    body: {
        padding: 16,
    },
});

export { Card, CardBody };
