import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-notitoast';
import NotitoastScreen from './screens/NotitoastScreen';
// @ts-ignore — plain JS screen
import OtpStudioScreen from './screens/OtpStudioScreen';

const PACKAGES = [
  {
    key: 'notitoast',
    name: 'react-native-notitoast',
    desc: 'Notification-style toasts: types, images, colors, timing',
    Screen: NotitoastScreen,
  },
  {
    key: 'otp-studio',
    name: 'react-native-otp-studio',
    desc: 'OTP input: shapes, glass, colors, masks, groups, autofill',
    Screen: OtpStudioScreen,
  },
];

function Home({ onOpen }: { onOpen: (key: string) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>PackageTester</Text>
      <Text style={styles.subtitle}>Pick a package to test its features</Text>
      {PACKAGES.map((p, i) => (
        <Pressable
          key={p.key}
          onPress={() => onOpen(p.key)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <Text style={styles.number}>{i + 1}.</Text>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{p.name}</Text>
            <Text style={styles.cardDesc}>{p.desc}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Root() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const goHome = useCallback(() => setSelected(null), []);
  const pkg = PACKAGES.find(p => p.key === selected);

  return (
    <ToastProvider
      appName="PackageTester"
      topOffset={insets.top + 8}
      bottomOffset={insets.bottom + 16}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {pkg ? <pkg.Screen key={pkg.key} onExit={goHome} /> : <Home onOpen={setSelected} />}
      </View>
    </ToastProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <Root />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  pressed: { opacity: 0.6 },
  content: { padding: 16, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  number: { fontSize: 20, fontWeight: '800', color: '#6366F1', marginRight: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 3 },
  arrow: { fontSize: 28, color: '#9CA3AF', marginLeft: 8 },
});
