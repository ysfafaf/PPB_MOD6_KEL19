import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { tokens } from "../theme/tokens.js";

const { color, space, radius } = tokens;

export function PaginationBar({ page, totalPages, onPrev, onNext }) {
  if (!totalPages || totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          !canPrev && styles.buttonDisabled,
          pressed && canPrev && styles.pressed,
        ]}
        onPress={onPrev}
        disabled={!canPrev}
        accessibilityLabel="Halaman sebelumnya"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canPrev }}
        hitSlop={8}
      >
        <Ionicons
          name="chevron-back"
          size={15}
          color={canPrev ? color.primary : color.text3}
        />
        <Text style={[styles.buttonText, !canPrev && styles.buttonTextDisabled]}>
          Sebelumnya
        </Text>
      </Pressable>

      <View
        style={styles.pageInfo}
        accessible
        accessibilityLabel={`Halaman ${page} dari ${totalPages}`}
      >
        <Text style={styles.pageNum}>{page}</Text>
        <Text style={styles.pageSep}> / </Text>
        <Text style={styles.pageTot}>{totalPages}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          !canNext && styles.buttonDisabled,
          pressed && canNext && styles.pressed,
        ]}
        onPress={onNext}
        disabled={!canNext}
        accessibilityLabel="Halaman berikutnya"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canNext }}
        hitSlop={8}
      >
        <Text style={[styles.buttonText, !canNext && styles.buttonTextDisabled]}>
          Berikutnya
        </Text>
        <Ionicons
          name="chevron-forward"
          size={15}
          color={canNext ? color.primary : color.text3}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: space.md,
    paddingHorizontal: 4,
    marginTop: -space.sm + 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: tokens.hit,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.cta,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
    color: color.primary,
  },
  buttonTextDisabled: {
    color: color.text3,
  },
  pageInfo: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pageNum: {
    fontSize: 15,
    fontWeight: "700",
    color: color.text,
    fontVariant: ["tabular-nums"],
  },
  pageSep: {
    fontSize: 14,
    color: color.text3,
  },
  pageTot: {
    fontSize: 14,
    color: color.text3,
    fontVariant: ["tabular-nums"],
  },
});
