import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { toast } from 'react-native-notitoast';
import type { ToastOptions } from 'react-native-notitoast';
import PackageShell, { FeatureScreen } from './PackageShell';

const photo = { uri: 'https://picsum.photos/200' };
const avatar = { uri: 'https://i.pravatar.cc/100?img=47' };
const appIcon = { uri: 'https://picsum.photos/id/1062/100' };

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.chipRow}>{children}</View>
    </View>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

/** Pick one value from a list of [label, value] pairs. */
function Choice<T>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: [string, T][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <Row label={label}>
      {options.map(([l, v]) => (
        <Chip key={l} label={l} active={value === v} onPress={() => onChange(v)} />
      ))}
    </Row>
  );
}

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

const TITLES: Record<string, string> = {
  short: 'Payment successful',
  long: 'A longer title that is allowed to wrap onto a second line when titleLines allows it',
};
const MESSAGES: Record<string, string | undefined> = {
  none: undefined,
  short: '₹499 paid to Arun Stores',
  long: 'This message is long on purpose so you can see how messageLines limits it. It keeps going and going so the wrapping is easy to spot.',
};
const ACCENTS = ['', '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#0EA5E9'];

function PlaygroundScreen() {
  const [type, setType] = useState<NonNullable<ToastOptions['type']>>('success');
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [variant, setVariant] = useState<'default' | 'tinted' | 'filled'>('default');
  const [title, setTitle] = useState('short');
  const [message, setMessage] = useState('short');
  const [image, setImage] = useState<'none' | 'right' | 'left'>('none');
  const [withAppIcon, setWithAppIcon] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showTypeBadge, setShowTypeBadge] = useState(true);
  const [accentBar, setAccentBar] = useState<'auto' | 'on' | 'off'>('auto');
  const [showProgress, setShowProgress] = useState(false);
  const [duration, setDuration] = useState(4000);
  const [titleLines, setTitleLines] = useState(1);
  const [messageLines, setMessageLines] = useState(3);
  const [width, setWidth] = useState<number | string | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [radius, setRadius] = useState(18);
  const [accent, setAccent] = useState('');
  const [customColors, setCustomColors] = useState(false);
  const [autoShow, setAutoShow] = useState(true);

  const options: ToastOptions = {
    type,
    title: TITLES[title],
    message: MESSAGES[message],
    position,
    variant,
    duration,
    showProgress,
    showIcon,
    showTypeBadge,
    showAccentBar: accentBar === 'auto' ? undefined : accentBar === 'on',
    titleLines,
    messageLines,
    borderRadius: radius,
    ...(image !== 'none' ? { image: image === 'left' ? avatar : photo, imagePosition: image } : null),
    ...(withAppIcon ? { appIcon } : null),
    ...(width !== undefined ? { width: width as any } : null),
    ...(height !== undefined ? { height } : null),
    ...(accent ? { accentColor: accent } : null),
    ...(customColors
      ? { backgroundColor: '#0F172A', borderColor: '#1E293B', titleColor: '#F8FAFC', messageColor: '#CBD5E1' }
      : null),
  };

  // Replace whatever is on screen with a fresh toast (a reused id would merge old options in).
  const show = () => {
    toast.hideAll();
    toast(options);
  };

  // Auto-apply: re-show the toast whenever an option changes (skip first render).
  const key = JSON.stringify(options);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (autoShow) {
      const t = setTimeout(show, 150); // debounce rapid taps
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, autoShow]);

  const codeText =
    'toast({\n' +
    Object.entries(options)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `  ${k}: ${typeof v === 'object' ? '{ uri: … }' : JSON.stringify(v)},`)
      .join('\n') +
    '\n})';

  return (
    <View style={styles.flex}>
      {/* Pinned controls: always visible while you scroll the options */}
      <View style={styles.pinned}>
        <View style={styles.pinnedRow}>
          <Pressable onPress={show} style={({ pressed }) => [styles.showBtn, pressed && styles.pressed]}>
            <Text style={styles.showBtnText}>Show toast</Text>
          </Pressable>
          <Pressable onPress={() => toast.hideAll()} style={({ pressed }) => [styles.hideBtn, pressed && styles.pressed]}>
            <Text style={styles.hideBtnText}>Hide all</Text>
          </Pressable>
        </View>
        <View style={styles.autoRow}>
          <Text style={styles.autoText}>Auto-show when an option changes</Text>
          <Switch value={autoShow} onValueChange={setAutoShow} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Choice
          label="type"
          options={[['success', 'success'], ['error', 'error'], ['warning', 'warning'], ['info', 'info']]}
          value={type}
          onChange={setType}
        />
        <Choice label="position" options={[['top', 'top'], ['bottom', 'bottom']]} value={position} onChange={setPosition} />
        <Choice
          label="variant"
          options={[['default', 'default'], ['tinted', 'tinted'], ['filled', 'filled']]}
          value={variant}
          onChange={setVariant}
        />
        <Choice label="title" options={[['short', 'short'], ['long', 'long']]} value={title} onChange={setTitle} />
        <Choice
          label="message"
          options={[['none', 'none'], ['short', 'short'], ['long', 'long']]}
          value={message}
          onChange={setMessage}
        />
        <Choice
          label="image"
          options={[['none', 'none'], ['right', 'right'], ['left (avatar)', 'left']]}
          value={image}
          onChange={setImage}
        />
        <Choice
          label="showAccentBar"
          options={[['auto', 'auto'], ['on', 'on'], ['off', 'off']]}
          value={accentBar}
          onChange={setAccentBar}
        />
        <Choice
          label="duration"
          options={[['2s', 2000], ['4s', 4000], ['8s', 8000], ['sticky (0)', 0]]}
          value={duration}
          onChange={setDuration}
        />
        <Choice label="titleLines" options={[['1', 1], ['2', 2], ['unlimited', 0]]} value={titleLines} onChange={setTitleLines} />
        <Choice
          label="messageLines"
          options={[['1', 1], ['3', 3], ['unlimited', 0]]}
          value={messageLines}
          onChange={setMessageLines}
        />
        <Choice
          label="width"
          options={[['auto', undefined], ['200', 200], ['280', 280], ['90%', '90%']]}
          value={width}
          onChange={setWidth}
        />
        <Choice label="height" options={[['auto', undefined], ['80', 80], ['120', 120]]} value={height} onChange={setHeight} />
        <Choice label="borderRadius" options={[['8', 8], ['18', 18], ['28', 28]]} value={radius} onChange={setRadius} />
        <Row label="accentColor">
          {ACCENTS.map(c => (
            <Pressable
              key={c || 'default'}
              onPress={() => setAccent(c)}
              style={[
                styles.swatch,
                c ? { backgroundColor: c } : styles.swatchDefault,
                accent === c && styles.swatchActive,
              ]}
            >
              {c ? null : <Text style={styles.swatchText}>auto</Text>}
            </Pressable>
          ))}
        </Row>

        <View style={styles.toggles}>
          <Toggle label="showIcon" value={showIcon} onChange={setShowIcon} />
          <Toggle label="showTypeBadge" value={showTypeBadge} onChange={setShowTypeBadge} />
          <Toggle label="appIcon" value={withAppIcon} onChange={setWithAppIcon} />
          <Toggle label="showProgress" value={showProgress} onChange={setShowProgress} />
          <Toggle label="custom dark colors" value={customColors} onChange={setCustomColors} />
        </View>

        <Text style={styles.rowLabel}>Code</Text>
        <Text style={styles.codeBlock}>{codeText}</Text>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Feature pages                                                       */
/* ------------------------------------------------------------------ */

type Demo = [label: string, run: () => void];

function ButtonGrid({ demos }: { demos: Demo[] }) {
  return (
    <View style={styles.grid}>
      {demos.map(([label, run]) => (
        <Pressable key={label} onPress={run} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const page = (demos: Demo[]) => () => <ButtonGrid demos={demos} />;

const TypesScreen = page([
  ['Success', () => toast.success('Payment successful', '₹499 paid to Arun Stores')],
  ['Error', () => toast.error('Upload failed', 'Check your internet connection')],
  ['Warning', () => toast.warning('Low storage', 'Only 200 MB left on this device')],
  ['Info', () => toast.info('New update', 'Version 2.1 is available')],
]);

const PositionScreen = page([
  ['Top', () => toast.success('Saved', 'Shown at the top')],
  ['Bottom', () => toast.success('Saved', 'Shown at the bottom', { position: 'bottom' })],
]);

const ImagesScreen = page([
  ['Image right', () => toast.info('Priya sent a photo', 'Check out this view', { image: photo })],
  ['Image left', () => toast.success('Priya liked your post', 'Tap to view', { image: avatar, imagePosition: 'left' })],
  ['App icon', () => toast.success('Order placed', 'Arriving tomorrow', { appIcon })],
  ['App icon, no badge', () => toast.info('Sync complete', undefined, { appIcon, showTypeBadge: false })],
  ['No icon (accent bar)', () => toast.warning('Session expiring', 'Logged out in 2 min', { showIcon: false })],
  ['Plain card', () => toast.info('Plain card', 'Just text', { showIcon: false, showAccentBar: false })],
]);

const ColorsScreen = page([
  ['Tinted', () => toast.success('Saved', 'All changes saved', { variant: 'tinted' })],
  ['Filled error', () => toast.error('Payment failed', 'Card declined', { variant: 'filled' })],
  ['Filled warning', () => toast.warning('Battery low', '10% remaining', { variant: 'filled' })],
  ['Custom colors', () => toast.info('Custom', 'Any colors you like', { backgroundColor: '#0F172A', borderColor: '#1E293B', titleColor: '#F8FAFC', messageColor: '#CBD5E1', accentColor: '#A855F7' })],
]);

const TimingScreen = page([
  ['Progress bar', () => toast.success('Upload done', 'With countdown bar', { showProgress: true })],
  ['8 seconds', () => toast.info('Stays 8 seconds', undefined, { duration: 8000, showProgress: true })],
  ['Sticky (swipe)', () => toast.warning('Stays until swiped', 'Swipe up to close', { duration: 0 })],
  ['More lines', () => toast.info('A longer title that is allowed to wrap onto a second line', 'This message has no line limit so it keeps going and shows every word you pass in without cutting anything off.', { titleLines: 2, messageLines: 0 })],
  ['Small width', () => toast.success('Copied', undefined, { width: 200 })],
  ['Fixed height', () => toast.info('Fixed height', '80px tall', { height: 80 })],
]);

const BehaviourScreen = page([
  ['Update in place', () => {
    const id = toast.info('Uploading…', 'Please wait', { duration: 0 });
    setTimeout(() => toast.success('Uploaded', 'Your file is live', { id }), 2000);
  }],
  ['Queue 3 toasts', () => {
    toast.success('First', 'Then the next one slides in');
    toast.warning('Second', 'Queued');
    toast.info('Third', 'Queued');
  }],
  ['onPress', () => toast.info('Tap me', 'Logs to Metro', { onPress: () => console.log('toast pressed') })],
  ['Hide all', () => toast.hideAll()],
]);

const SCREENS: FeatureScreen[] = [
  { key: 'playground', icon: '🎛️', title: 'Playground', desc: 'Change every option live', C: PlaygroundScreen, fixed: true },
  { key: 'types', icon: '🚦', title: 'Types', desc: 'success, error, warning, info', C: TypesScreen },
  { key: 'position', icon: '📍', title: 'Position', desc: 'top, bottom', C: PositionScreen },
  { key: 'images', icon: '🖼️', title: 'Images and icons', desc: 'image left/right, app icon, badge', C: ImagesScreen },
  { key: 'colors', icon: '🎨', title: 'Colors', desc: 'tinted, filled, custom', C: ColorsScreen },
  { key: 'timing', icon: '⏱️', title: 'Timing and size', desc: 'progress, duration, lines, width, height', C: TimingScreen },
  { key: 'behaviour', icon: '⚙️', title: 'Behaviour', desc: 'update in place, queue, onPress, hide all', C: BehaviourScreen },
];

export default function NotitoastScreen({ onExit }: { onExit: () => void }) {
  return (
    <PackageShell
      title="react-native-notitoast"
      intro="Tap a feature to test it"
      screens={SCREENS}
      onExit={onExit}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const mono = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.6 },
  content: { padding: 16, paddingBottom: 80 },

  pinned: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  pinnedRow: { flexDirection: 'row', gap: 10 },
  showBtn: { flex: 1, backgroundColor: '#6366F1', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  showBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hideBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hideBtnText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  autoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  autoText: { fontSize: 13, color: '#6B7280' },

  row: { marginBottom: 12 },
  rowLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  swatch: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  swatchDefault: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
  swatchText: { fontSize: 8, color: '#6B7280', fontWeight: '700' },
  swatchActive: { borderWidth: 3, borderColor: '#111827' },
  toggles: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF0F3',
  },
  toggleText: { fontSize: 14, color: '#111827' },
  codeBlock: {
    fontFamily: mono,
    fontSize: 12,
    color: '#E5E7EB',
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  buttonText: { fontSize: 14, fontWeight: '600', color: '#111827' },
});
