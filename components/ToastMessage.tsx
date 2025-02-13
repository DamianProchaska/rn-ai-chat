import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS,
} from "react-native-reanimated";

type ToastMessageProps = {
    message: string;
    duration?: number;
    onClose?: () => void;
};

export function ToastMessage({
    message,
    duration = 3000,
    onClose,
}: ToastMessageProps) {
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }, () => {
            opacity.value = withDelay(duration, withTiming(0, { duration: 300 }, (finished) => {
                if (finished && onClose) {
                    runOnJS(onClose)();
                }
            }));
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: (1 - opacity.value) * 20 }],
    }));

    return (
        <Animated.View style={[styles.toastContainer, animatedStyle]}>
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        zIndex: 999,
    },
    toastText: {
        color: "#fff",
        fontSize: 14,
    },
});
