import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { tokens } from "../theme/tokens.js";

const { color, space, radius, shadow } = tokens;

const MEMBERS = [
  { name: "Farrel Revanza Al Huwaida", nim: "21120124130075" },
  { name: "Muhammad Afiffatin Hariz", nim: "21120124130073" },
  { name: "Ifada Adillarisca Kusuma", nim: "21120124120011" },
  { name: "Yusuf Afaf Nur Abdillah", nim: "21120124130100" },
];

function MemberCard({ name, nim, index, reduced }) {
  return (
    <Animated.View
      style={styles.memberCard}
      entering={
        reduced
          ? FadeIn.duration(150)
          : FadeInDown.delay(index * 70).duration(220)
      }
    >
      <View style={styles.avatarCircle}>
        <Ionicons name="person" size={20} color={color.primary} />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{name}</Text>
        <Text style={styles.memberNim}>{nim}</Text>
      </View>
      <Ionicons name="id-card-outline" size={18} color={color.text3} />
    </Animated.View>
  );
}

export function ProfileScreen() {
  const reduced = useReducedMotion();

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Animated.View
        style={styles.headerCard}
        entering={reduced ? FadeIn.duration(150) : FadeInDown.duration(220)}
      >
        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeText}>SHIFT 3</Text>
        </View>

        <Text style={styles.headerTitle}>Kelompok 19</Text>
        <Text style={styles.headerSubtitle}>Praktikum PPB Modul 6</Text>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <Ionicons name="book-outline" size={14} color={color.text3} />
          <Text style={styles.metaText}>Modul 6 — React Native</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={14} color={color.text3} />
          <Text style={styles.metaText}>{MEMBERS.length} Anggota</Text>
        </View>
      </Animated.View>

      <Text style={styles.sectionTitle}>Anggota Kelompok</Text>

      {MEMBERS.map((m, i) => (
        <MemberCard
          key={m.nim}
          name={m.name}
          nim={m.nim}
          index={i}
          reduced={reduced}
        />
      ))}

      <Animated.View
        style={styles.footer}
        entering={
          reduced
            ? FadeIn.duration(150)
            : FadeInDown.delay(MEMBERS.length * 70 + 60).duration(200)
        }
      >
        <Text style={styles.footerText}>
          Universitas Diponegoro · {new Date().getFullYear()}
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.bg,
  },
  container: {
    padding: space.lg,
    paddingBottom: space.xxl,
    gap: space.md,
    backgroundColor: color.bg,
  },
  headerCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: color.border,
    padding: space.xl,
    gap: space.sm,
    alignItems: "center",
    boxShadow: shadow.card,
    marginBottom: space.sm,
  },
  groupBadge: {
    backgroundColor: color.primary,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderCurve: "continuous",
    marginBottom: 4,
  },
  groupBadgeText: {
    color: color.onPrimary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: color.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: color.text2,
    fontWeight: "500",
  },
  divider: {
    width: "60%",
    height: 1,
    backgroundColor: color.border,
    marginVertical: space.sm - 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: color.text3,
  },
  sectionTitle: {
    fontSize: tokens.type.section,
    fontWeight: "700",
    color: color.text,
    marginTop: space.sm - 4,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: color.border,
    padding: space.md,
    boxShadow: shadow.card,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInfo: {
    flex: 1,
    gap: 3,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: color.text,
  },
  memberNim: {
    fontSize: 13,
    color: color.text3,
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: "center",
    marginTop: space.sm,
  },
  footerText: {
    fontSize: 12,
    color: color.text3,
  },
});
