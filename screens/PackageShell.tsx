import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type FeatureScreen = {
  key: string;
  icon: string;
  title: string;
  desc: string;
  C: React.ComponentType<any>;
  /** Screen handles its own layout/scrolling (e.g. playground with a pinned preview). */
  fixed?: boolean;
};

type Props = {
  title: string;
  intro: string;
  screens: FeatureScreen[];
  onExit: () => void;
};

/** Feature list for one package + the selected feature page. Handles back navigation. */
export default function PackageShell({ title, intro, screens, onExit }: Props) {
  const [current, setCurrent] = useState<string | null>(null);
  const screen = screens.find(s => s.key === current);

  const goBack = () => (current ? setCurrent(null) : onExit());

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (current) {
        setCurrent(null);
      } else {
        onExit();
      }
      return true;
    });
    return () => sub.remove();
  }, [current, onExit]);

  return (
    <View style={styles.app}>
      <View style={styles.header}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹ {screen ? 'Back' : 'Home'}</Text>
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {screen ? `${screen.icon}  ${screen.title}` : title}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {screen ? (
          screen.fixed ? (
            <screen.C key={screen.key} />
          ) : (
            <ScrollView
              key={screen.key}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              <screen.C />
            </ScrollView>
          )
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.intro}>{intro}</Text>
            {screens.map(s => (
              <Pressable
                key={s.key}
                onPress={() => setCurrent(s.key)}
                style={({ pressed }) => [styles.item, pressed && styles.pressed]}
              >
                <Text style={styles.itemIcon}>{s.icon}</Text>
                <View style={styles.flex}>
                  <Text style={styles.itemTitle}>{s.title}</Text>
                  <Text style={styles.itemDesc}>{s.desc}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  pressed: { opacity: 0.6 },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  back: { marginRight: 12 },
  backText: { fontSize: 17, color: '#6366F1', fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 16, paddingBottom: 80 },
  intro: { color: '#6B7280', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  itemIcon: { fontSize: 24, marginRight: 14 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  itemDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  chevron: { fontSize: 24, color: '#9CA3AF', marginLeft: 8 },
});
