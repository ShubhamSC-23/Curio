import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/useTheme';

const Button = ({
    children,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle
}) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const getVariantStyle = () => {
        switch (variant) {
            case 'secondary': return styles.secondary;
            case 'outline': return styles.outline;
            case 'ghost': return styles.ghost;
            default: return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline': return { color: colors.primary[600] };
            case 'ghost': return { color: colors.text.secondary };
            default: return { color: colors.text.inverse };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm': return styles.sm;
            case 'lg': return styles.lg;
            default: return styles.md;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading || disabled}
            style={[
                styles.base,
                getVariantStyle(),
                getSizeStyle(),
                disabled && styles.disabled,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary[600] : colors.text.inverse} />
            ) : (
                React.Children.map(children, child => {
                    if (typeof child === 'string') {
                        return <Text style={[styles.text, getTextStyle(), textStyle]}>{child}</Text>;
                    }
                    return child;
                })
            )}
        </TouchableOpacity>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    base: {
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: colors.primary[600],
    },
    secondary: {
        backgroundColor: colors.primary[400],
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary[600],
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    sm: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    md: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    lg: {
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
