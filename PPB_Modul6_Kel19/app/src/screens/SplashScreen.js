import { useEffect, useRef, useState } from "react";
import { Pressable, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

const BG = "#0F172A";
const ACCENT = "#2563EB";
const TEXT_1 = "#F8FAFC";
const TEXT_2 = "#94A3B8";
const TEXT_3 = "#334155";

const T_ICON = 0;
const T_TITLE = 160;
const T_SUB = 320;
const T_PROGRESS = 500;
const T_TAG = 650;
const T_BUTTON = 900;

export function SplashScreen({ onFinish }) {
  const [buttonReady, setButtonReady] = useState(false);

  const screenOpacity = useSharedValue(1);
  const iconScale = useSharedValue(0.35);
  const iconOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(18);
  const subOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const tagOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonY = useSharedValue(14);

  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  useEffect(() => {
    iconOpacity.set(withTiming(1, { duration: 280 }));
    iconScale.set(withSpring(1, { damping: 14, stiffness: 110, mass: 0.9 }));

    titleOpacity.set(withDelay(T_TITLE, withTiming(1, { duration: 340 })));
    titleY.set(withDelay(T_TITLE, withTiming(0, {
      duration: 340, easing: Easing.out(Easing.quad),
    })));

    subOpacity.set(withDelay(T_SUB, withTiming(1, { duration: 300 })));

    lineWidth.set(withDelay(T_PROGRESS, withTiming(1, {
      duration: 1000, easing: Easing.out(Easing.cubic),
    })));

    tagOpacity.set(withDelay(T_TAG, withTiming(1, { duration: 300 })));

    buttonOpacity.set(withDelay(T_BUTTON, withTiming(1, { duration: 380 })));
    buttonY.set(withDelay(T_BUTTON, withTiming(0, {
      duration: 380, easing: Easing.out(Easing.quad),
    })));

    const t = setTimeout(() => setButtonReady(true), T_BUTTON + 350);
    return () => clearTimeout(t);
  }, []);

  const handleStart = () => {
    if (!buttonReady) return;
    screenOpacity.set(
      withTiming(0, { duration: 380 }, (done) => {
        if (done) runOnJS(onFinishRef.current)();
      })
    );
  };

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));
  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));
  const subStyle = useAnimatedStyle(() => ({ opacity: subOpacity.value }));
  const lineStyle = useAnimatedStyle(() => ({ width: `${lineWidth.value * 100}%` }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));
  const btnStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonY.value }],
  }));

  return (
    <Animated.View style={[styles.root, screenStyle]}>
      <StatusBar backgroundColor={BG} barStyle="light-content" translucent={false} />

      <View style={styles.col}>
        <Animated.View style={[styles.iconBadge, iconStyle]}>
          <Ionicons name="thermometer-outline" size={46} color={ACCENT} />
        </Animated.View>

        <Animated.Text style={[styles.title, titleStyle]}>
          LiveTemp
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subOpacity && subStyle]}>
          Aplikasi Monitoring Suhu
        </Animated.Text>

        <View style={styles.gap} />

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, lineStyle]} />
        </View>

        <Animated.View style={[styles.btnWrap, btnStyle]}>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={handleStart}
            disabled={!buttonReady}
            accessibilityLabel="Mulai aplikasi"
            accessibilityRole="button"
          >
            <Animated.Text style={styles.btnText}>Mulai</Animated.Text>
            <Ionicons name="arrow-forward" size={18} color={TEXT_1} />
          </Pressable>
        </Animated.View>

        <Animated.Text style={[styles.tag, tagStyle]}>
          Kelompok 19 · Praktikum PPB Modul 6
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TEXT_1,
  },
  col: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 10,
  },
  iconBadge: {
    width: 86,
    height: 86,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: TEXT_3,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_2,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  gap: {
    height: 20,
  },
  progressTrack: {
    width: "55%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 2,
    backgroundColor: ACCENT,
    borderRadius: 999,
  },
  btnWrap: {
    marginTop: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
  },
  btnPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  btnText: {
    color: TEXT_1,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  tag: {
    marginTop: 8,
    fontSize: 11,
    color: TEXT_3,
    letterSpacing: 0.4,
    textAlign: "center",
  },
});
