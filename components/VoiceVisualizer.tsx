// components/VoiceVisualizer.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

type Props = {
    amplitudeDb: number; // -160..0
    barsCount?: number;  // default 5
};

function dbToAmplitudeScale(db: number) {
    // clamp do -60..0 => 0..1
    const clamped = Math.min(Math.max(db, -60), 0);
    return (clamped + 60) / 60;
}

export function VoiceVisualizer({ amplitudeDb, barsCount = 5 }: Props) {
    const amplitude = dbToAmplitudeScale(amplitudeDb);
    const bars = Array.from({ length: barsCount }, (_, i) => i);

    return (
        <View style={styles.container}>
            {bars.map((_, i) => (
                <WaveBar key={i} amplitude={amplitude} index={i} />
            ))}
        </View>
    );
}

type WaveBarProps = {
    amplitude: number;
    index: number;
};

function WaveBar({ amplitude, index }: WaveBarProps) {
    const heightVal = useSharedValue(0);

    React.useEffect(() => {
        // drobna różnica dla każdego paska
        const factor = 1 + index * 0.05;
        heightVal.value = withTiming(amplitude * factor, { duration: 150 });
    }, [amplitude]);

    const animatedStyle = useAnimatedStyle(() => {
        const maxHeight = 30;
        return {
            height: heightVal.value * maxHeight,
        };
    });

    return <Animated.View style={[styles.bar, animatedStyle]} />;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-end",
        height: 30,
        justifyContent: "space-between",
        width: 60,
    },
    bar: {
        width: 4,
        backgroundColor: "#3CCF4E",
        borderRadius: 2,
        marginHorizontal: 2,
    },
});
