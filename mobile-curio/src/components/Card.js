import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

const Card = ({ children, style }) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    return <View style={[styles.card, style]}>{children}</View>;
};

const CardBody = ({ children, style }) => {
    return <View style={[{ padding: 16 }, style]}>{children}</View>;
};

const makeStyles = (colors) => StyleSheet.create({
    card: {
        backgroundColor: colors.background.elevated,
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
});

export { Card, CardBody };
