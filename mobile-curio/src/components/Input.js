import React, { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

const Input = ({
    label,
    icon: Icon,
    error,
    containerStyle,
    inputStyle,
    ...props
}) => {
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);

    return (
        <View style={[styles.container, containerStyle]}>
            {!!label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputWrapper,
                !!error && styles.inputWrapperError,
                props.multiline && styles.inputWrapperMultiline
            ]}>
                {!!Icon && (
                    <Icon
                        size={20}
                        color={colors.text.tertiary}
                        style={[styles.icon, props.multiline && styles.iconMultiline]}
                    />
                )}
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholderTextColor={colors.text.tertiary}
                    {...props}
                />
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const makeStyles = (colors) => StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.secondary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.tertiary,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
        borderWidth: 1,
        borderColor: colors.border.primary,
    },
    inputWrapperError: {
        borderColor: colors.status.error,
    },
    inputWrapperMultiline: {
        height: 'auto',
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    icon: {
        marginRight: 12,
    },
    iconMultiline: {
        marginTop: 4,
    },
    input: {
        flex: 1,
        color: colors.text.primary,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        color: colors.status.error,
        marginTop: 4,
    },
});

export default Input;
