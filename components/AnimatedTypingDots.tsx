import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
} from "react-native-reanimated";

export function AnimatedTypingDots() {
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    React.useEffect(() => {
        dot1.value = withRepeat(
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
        dot2.value = withRepeat(
            withSequence(
                withTiming(0, { duration: 200 }),
                withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true
        );
        dot3.value = withRepeat(
            withSequence(
                withTiming(0, { duration: 400 }),
                withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true
        );
    }, []);

    const styleDot = (dot: Animated.SharedValue<number>) => {
        return useAnimatedStyle(() => {
            return {
                transform: [{ translateY: -5 * dot.value }],
                opacity: 0.5 + 0.5 * dot.value,
            };
        });
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.dot, styleDot(dot1)]} />
            <Animated.View style={[styles.dot, styleDot(dot2)]} />
            <Animated.View style={[styles.dot, styleDot(dot3)]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: 60,
        justifyContent: "space-between",
        alignItems: "flex-end",
        padding: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "gray",
    },
});
