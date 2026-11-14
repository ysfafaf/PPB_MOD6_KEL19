import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
} from "react-native-skia";
import { useIsFocused } from "@react-navigation/native";
import {
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { tokens } from "../theme/tokens.js";

const { color } = tokens;

const MIN_TEMP = 15;
const MAX_TEMP = 40;
const ARC_START = 150;
const ARC_TOTAL = 240;
const TRACK_W = 10;
const TICK_COUNT = 12;

const toRad = (d) => (d * Math.PI) / 180;

function svgArc(cx, cy, r, startDeg, sweepDeg) {
  if (sweepDeg < 0.5) return null;
  const sweep = Math.min(sweepDeg, ARC_TOTAL - 0.1);
  const sRad = toRad(startDeg);
  const eRad = toRad(startDeg + sweep);
  const sx = cx + r * Math.cos(sRad);
  const sy = cy + r * Math.sin(sRad);
  const ex = cx + r * Math.cos(eRad);
  const ey = cy + r * Math.sin(eRad);
  const lf = sweep > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${lf} 1 ${ex} ${ey}`;
}

function svgTicks(cx, cy, Rg, majorOnly) {
  const parts = [];
  for (let i = 0; i <= TICK_COUNT; i++) {
    const isMajor = i % 3 === 0;
    if (isMajor !== majorOnly) continue;
    const angleRad = toRad(ARC_START + (i / TICK_COUNT) * ARC_TOTAL);
    const half = isMajor ? 4.5 : 2.5;
    const x1 = cx + (Rg - half) * Math.cos(angleRad);
    const y1 = cy + (Rg - half) * Math.sin(angleRad);
    const x2 = cx + (Rg + half) * Math.cos(angleRad);
    const y2 = cy + (Rg + half) * Math.sin(angleRad);
    parts.push(`M ${x1} ${y1} L ${x2} ${y2}`);
  }
  return parts.length ? parts.join(" ") : null;
}

function makePath(svgString) {
  if (!svgString) return null;
  try {
    return Skia.Path.MakeFromSVGString(svgString) ?? null;
  } catch {
    return null;
  }
}

export function TempOrb({
  tint = color.primary,
  beatKey = 0,
  size = 200,
  dimmed = false,
  temperature = null,
  threshold = null,
}) {
  const reduceMotion = useReducedMotion();
  const focused = useIsFocused();

  const breathe = useSharedValue(0);
  const intensity = useSharedValue(0);
  const dimSV = useSharedValue(dimmed ? 1 : 0);
  const firstBeat = useRef(true);

  const cx = size / 2;
  const cy = size / 2;
  const Rg = size * 0.43;
  const Rc = size * 0.28;

  const pct = typeof temperature === "number"
    ? Math.max(0, Math.min(1, (temperature - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)))
    : 0;
  const sweepDeg = pct * ARC_TOTAL;
  const hasTemp = typeof temperature === "number";

  const tipX = cx + Rg * Math.cos(toRad(ARC_START + sweepDeg));
  const tipY = cy + Rg * Math.sin(toRad(ARC_START + sweepDeg));

  const trackPath = useMemo(
    () => makePath(svgArc(cx, cy, Rg, ARC_START, ARC_TOTAL)),
    [cx, cy, Rg]
  );

  const indicatorPath = useMemo(
    () => (hasTemp && sweepDeg >= 0.5)
      ? makePath(svgArc(cx, cy, Rg, ARC_START, sweepDeg))
      : null,
    [cx, cy, Rg, hasTemp, sweepDeg]
  );

  const majorTickPath = useMemo(
    () => makePath(svgTicks(cx, cy, Rg, true)),
    [cx, cy, Rg]
  );

  const minorTickPath = useMemo(
    () => makePath(svgTicks(cx, cy, Rg, false)),
    [cx, cy, Rg]
  );

  const thresholdPath = useMemo(() => {
    if (typeof threshold !== "number") return null;
    const tPct = (threshold - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
    if (tPct <= 0.01 || tPct >= 0.99) return null;
    const angleRad = toRad(ARC_START + tPct * ARC_TOTAL);
    const rIn = Rg - TRACK_W / 2 - 4;
    const rOut = Rg + TRACK_W / 2 + 4;
    const x1 = cx + rIn * Math.cos(angleRad);
    const y1 = cy + rIn * Math.sin(angleRad);
    const x2 = cx + rOut * Math.cos(angleRad);
    const y2 = cy + rOut * Math.sin(angleRad);
    return makePath(`M ${x1} ${y1} L ${x2} ${y2}`);
  }, [threshold, cx, cy, Rg]);

  useEffect(() => {
    dimSV.set(withTiming(dimmed ? 1 : 0, { duration: 400 }));
  }, [dimmed, dimSV]);

  useEffect(() => {
    if (firstBeat.current) {
      firstBeat.current = false;
      return;
    }
    if (!beatKey || dimmed || reduceMotion) return;
    intensity.set(0);
    intensity.set(
      withSequence(
        withTiming(1, { duration: 130 }),
        withTiming(0.30, { duration: 160 }),
        withTiming(0.65, { duration: 110 }),
        withTiming(0, { duration: 380 })
      )
    );
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {}
  }, [beatKey, dimmed, reduceMotion, intensity]);

  useEffect(() => {
    if (focused && !reduceMotion && !dimmed) {
      breathe.set(
        withRepeat(
          withSequence(
            withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
            withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.quad) })
          ),
          -1,
          false
        )
      );
    } else {
      breathe.set(withTiming(0, { duration: 600 }));
    }
  }, [focused, reduceMotion, dimmed, breathe]);

  const trackOp = useDerivedValue(() => 1 - 0.5 * dimSV.value);
  const tickOp = useDerivedValue(
    () => (0.50 + 0.15 * intensity.value) * (1 - 0.5 * dimSV.value)
  );
  const indicatorOp = useDerivedValue(
    () => (0.80 + 0.20 * breathe.value + 0.20 * intensity.value) * (1 - 0.75 * dimSV.value)
  );
  const thresholdOp = useDerivedValue(() => 1 - 0.6 * dimSV.value);
  const prR = useDerivedValue(
    () => Rc + (Rg - TRACK_W / 2 - Rc) * intensity.value
  );
  const prOp = useDerivedValue(
    () => intensity.value * 0.45 * (1 - dimSV.value * 0.9)
  );

  return (
    <View style={{ width: size, height: size }} accessible={false}>
      <Canvas style={{ width: size, height: size }}>
        {trackPath ? (
          <Group opacity={trackOp}>
            <Path
              path={trackPath}
              style="stroke"
              strokeWidth={TRACK_W}
              strokeCap="round"
              color={color.border}
            />
          </Group>
        ) : null}

        <Group opacity={tickOp}>
          {majorTickPath ? (
            <Path
              path={majorTickPath}
              style="stroke"
              strokeWidth={2}
              strokeCap="round"
              color={color.text3}
            />
          ) : null}
          {minorTickPath ? (
            <Path
              path={minorTickPath}
              style="stroke"
              strokeWidth={1.2}
              strokeCap="round"
              color={color.border}
            />
          ) : null}
        </Group>

        {thresholdPath ? (
          <Group opacity={thresholdOp}>
            <Path
              path={thresholdPath}
              style="stroke"
              strokeWidth={3}
              strokeCap="round"
              color="#F59E0B"
            />
          </Group>
        ) : null}

        {indicatorPath ? (
          <Group opacity={indicatorOp}>
            <Path
              path={indicatorPath}
              style="stroke"
              strokeWidth={TRACK_W}
              strokeCap="round"
              color={tint}
            />
          </Group>
        ) : null}

        {hasTemp && sweepDeg >= 0.5 ? (
          <Group opacity={indicatorOp}>
            <Circle cx={tipX} cy={tipY} r={5.5} color={color.surface} />
            <Circle cx={tipX} cy={tipY} r={3.8} color={tint} />
          </Group>
        ) : null}

        <Circle cx={cx} cy={cy} r={Rc} color={color.surface} />

        <Group opacity={prOp}>
          <Circle cx={cx} cy={cy} r={prR} style="stroke" strokeWidth={1.5} color={tint}>
            <BlurMask blur={4} style="normal" />
          </Circle>
        </Group>
      </Canvas>
    </View>
  );
}
