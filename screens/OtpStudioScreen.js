// react-native-otp-studio — full feature test screen
import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-studio";
import PackageShell from "./PackageShell";

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const GLASS_BG = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200";
const COLORFUL_BG = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200";

/** One test block: title, code hint, the OTP input and its live value. */
function Demo({ title, code, dark, children }) {
  return (
    <View style={[styles.demo, dark && styles.demoDark]}>
      <Text style={[styles.demoTitle, dark && { color: "#fff" }]}>{title}</Text>
      {code ? <Text style={[styles.code, dark && styles.codeDark]}>{code}</Text> : null}
      <View style={{ marginTop: 14 }}>{children}</View>
    </View>
  );
}

/** OtpInput + shows value / complete status under it. */
const Otp = React.forwardRef(function Otp({ lightText, ...props }, ref) {
  const [value, setValue] = useState(props.defaultValue || "");
  const [done, setDone] = useState(false);
  const light = props.glassEffect || lightText;
  return (
    <View>
      <OtpInput
        ref={ref}
        {...props}
        onChange={(v) => {
          setValue(v);
          setDone(false);
          props.onChange && props.onChange(v);
        }}
        onComplete={(v) => {
          setDone(true);
          props.onComplete && props.onComplete(v);
        }}
      />
      <Text style={[styles.value, light && { color: "rgba(255,255,255,0.9)" }]}>
        value: "{value}" {done ? "  ✅ complete" : ""}
      </Text>
    </View>
  );
});

function GlassBox({ uri = GLASS_BG, children }) {
  return (
    <ImageBackground source={{ uri }} style={styles.glassBox} imageStyle={{ borderRadius: 16 }}>
      {children}
    </ImageBackground>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

function Row({ label, children }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.chipRow}>{children}</View>
    </View>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <View style={styles.toggle}>
      <Text style={styles.toggleText}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Screens                                                             */
/* ------------------------------------------------------------------ */

function PlaygroundScreen() {
  const [length, setLength] = useState(6);
  const [shape, setShape] = useState("rounded");
  const [type, setType] = useState("numeric");
  const [position, setPosition] = useState("center");
  const [size, setSize] = useState(52);
  const [color, setColor] = useState("#6366F1");
  const [glass, setGlass] = useState(false);
  const [glassTint, setGlassTint] = useState("light");
  const [glassBg, setGlassBg] = useState("image"); // image | colorful | none
  const [shadow, setShadow] = useState(false);
  const [glow, setGlow] = useState(false);
  const [mask, setMask] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [cursor, setCursor] = useState(true);
  const [groups, setGroups] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);

  const canGroup = length % 2 === 0;
  const onImage = glass && glassBg !== "none";
  const props = {
    length,
    shape,
    type,
    transform: type === "alphanumeric" ? "uppercase" : "none",
    position,
    size,
    gap: size < 48 ? 6 : 10,
    activeBorderColor: onImage ? "#FFFFFF" : color,
    glassEffect: glass,
    glassTint: glass ? glassTint : undefined,
    textColor: onImage && glassTint === "light" ? "#FFFFFF" : undefined,
    shadow,
    activeGlow: glow,
    mask,
    error,
    disabled,
    animated,
    showCursor: cursor,
    groups: groups && canGroup ? [length / 2, length / 2] : undefined,
    separator: groups && canGroup ? "-" : undefined,
    placeholder: placeholder ? "0" : undefined,
  };

  const preview = <Otp key={`${length}-${type}`} {...props} lightText={onImage} />;

  const codeText =
    "<OtpInput\n" +
    Object.entries(props)
      .filter(([, v]) => v !== undefined && v !== false && v !== "none")
      .map(([k, v]) => `  ${k}={${JSON.stringify(v)}}`)
      .join("\n") +
    "\n/>";

  return (
    <View style={{ flex: 1 }}>
      {/* Pinned preview: stays on top while the options below scroll */}
      <View style={styles.pinned}>
        {onImage ? (
          <GlassBox uri={glassBg === "colorful" ? COLORFUL_BG : GLASS_BG}>{preview}</GlassBox>
        ) : (
          <View style={styles.previewPlain}>{preview}</View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Row label="length">
        {[4, 5, 6, 8].map((n) => (
          <Chip key={n} label={String(n)} active={length === n} onPress={() => setLength(n)} />
        ))}
      </Row>
      <Row label="shape">
        {["square", "rounded", "circle", "pill", "underline"].map((s) => (
          <Chip key={s} label={s} active={shape === s} onPress={() => setShape(s)} />
        ))}
      </Row>
      <Row label="type">
        {["numeric", "alpha", "alphanumeric", "hex", "any"].map((t) => (
          <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
        ))}
      </Row>
      <Row label="position">
        {["left", "center", "right", "space-between", "space-evenly"].map((p) => (
          <Chip key={p} label={p} active={position === p} onPress={() => setPosition(p)} />
        ))}
      </Row>
      <Row label="size">
        {[40, 48, 52, 60].map((s) => (
          <Chip key={s} label={String(s)} active={size === s} onPress={() => setSize(s)} />
        ))}
      </Row>
      <Row label="activeBorderColor">
        {["#6366F1", "#10B981", "#F59E0B", "#EC4899", "#0EA5E9", "#111827"].map((c) => (
          <Pressable
            key={c}
            onPress={() => setColor(c)}
            style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchActive]}
          />
        ))}
      </Row>
      {glass && (
        <>
          <Row label="glassTint">
            {["light", "dark"].map((t) => (
              <Chip key={t} label={t} active={glassTint === t} onPress={() => setGlassTint(t)} />
            ))}
          </Row>
          <Row label="glass background (preview only)">
            {[
              ["image", "photo"],
              ["colorful", "colorful"],
              ["none", "no background"],
            ].map(([k, label]) => (
              <Chip key={k} label={label} active={glassBg === k} onPress={() => setGlassBg(k)} />
            ))}
          </Row>
        </>
      )}

      <View style={styles.toggles}>
        <Toggle label="glassEffect" value={glass} onChange={setGlass} />
        <Toggle label="shadow" value={shadow} onChange={setShadow} />
        <Toggle label="activeGlow" value={glow} onChange={setGlow} />
        <Toggle label="mask" value={mask} onChange={setMask} />
        <Toggle label="error (shake)" value={error} onChange={setError} />
        <Toggle label="disabled" value={disabled} onChange={setDisabled} />
        <Toggle label="animated" value={animated} onChange={setAnimated} />
        <Toggle label="showCursor" value={cursor} onChange={setCursor} />
        <Toggle label={`groups + separator${canGroup ? "" : " (even length only)"}`} value={groups} onChange={setGroups} />
        <Toggle label='placeholder="0"' value={placeholder} onChange={setPlaceholder} />
      </View>

      <Text style={styles.rowLabel}>Code</Text>
      <Text style={styles.codeBlock}>{codeText}</Text>
      </ScrollView>
    </View>
  );
}

function LengthScreen() {
  return (
    <>
      <Demo title="4 digits" code="length={4}"><Otp length={4} /></Demo>
      <Demo title="5 digits" code="length={5}"><Otp length={5} /></Demo>
      <Demo title="6 digits (default)" code="length={6}"><Otp /></Demo>
      <Demo title="8 digits, small boxes" code="length={8} size={38} gap={6}"><Otp length={8} size={38} gap={6} /></Demo>
    </>
  );
}

function ShapesScreen() {
  return (
    <>
      <Demo title="Square" code='shape="square"'><Otp shape="square" /></Demo>
      <Demo title="Rounded (default)" code='shape="rounded"'><Otp shape="rounded" /></Demo>
      <Demo title="Circle" code='shape="circle"'><Otp shape="circle" /></Demo>
      <Demo title="Pill" code='shape="pill"'><Otp shape="pill" /></Demo>
      <Demo title="Underline (Instagram / Telegram)" code='shape="underline"'>
        <Otp shape="underline" />
      </Demo>
      <Demo title="Underline, sky blue" code='shape="underline" activeBorderColor="#0EA5E9"'>
        <Otp shape="underline" activeBorderColor="#0EA5E9" borderWidth={3} />
      </Demo>
    </>
  );
}

function GlassScreen() {
  return (
    <>
      <GlassBox>
        <Text style={styles.glassTitle}>glassEffect (light)</Text>
        <Otp glassEffect textColor="#fff" activeBorderColor="#fff" />
      </GlassBox>
      <GlassBox>
        <Text style={styles.glassTitle}>glassEffect glassTint="dark"</Text>
        <Otp glassEffect glassTint="dark" shape="circle" activeBorderColor="#C4B5FD" />
      </GlassBox>
      <GlassBox uri={COLORFUL_BG}>
        <Text style={styles.glassTitle}>glassOpacity={"{0.35}"} + activeGlow</Text>
        <Otp glassEffect glassOpacity={0.35} activeGlow activeBorderColor="#fff" textColor="#fff" />
      </GlassBox>
      <GlassBox uri={COLORFUL_BG}>
        <Text style={styles.glassTitle}>Glass + underline</Text>
        <Otp glassEffect shape="underline" textColor="#fff" activeBorderColor="#fff" />
      </GlassBox>
      <GlassBox>
        <Text style={styles.glassTitle}>Glass pill, 4 digits</Text>
        <Otp glassEffect shape="pill" length={4} size={58} textColor="#fff" activeBorderColor="#fff" />
      </GlassBox>
      <Demo title="Glass, no background (light screen)" code="glassEffect">
        <Otp glassEffect activeBorderColor="#6366F1" />
      </Demo>
      <Demo title="Glass dark tint, no background" code='glassEffect glassTint="dark"'>
        <Otp glassEffect glassTint="dark" activeBorderColor="#6366F1" />
      </Demo>
      <Text style={styles.note}>
        Real blur: run "npx expo install expo-blur", then{"\n"}
        import {"{ BlurView }"} from "expo-blur";{"\n"}
        {"<OtpInput glassEffect BlurComponent={BlurView} />"}
      </Text>
    </>
  );
}

function ColorsScreen() {
  return (
    <>
      <Demo title="Default colors"><Otp /></Demo>
      <Demo title="Purple theme" code="text / bg / border / active / filled colors">
        <Otp
          shape="circle"
          textColor="#4C1D95"
          backgroundColor="#FAF5FF"
          borderColor="#E9D5FF"
          activeBorderColor="#8B5CF6"
          filledBorderColor="#A78BFA"
          filledBackgroundColor="#EDE9FE"
          cursorColor="#8B5CF6"
        />
      </Demo>
      <Demo title="Green success fill" code='filledBorderColor="#10B981" filledBackgroundColor="#ECFDF5"'>
        <Otp filledBorderColor="#10B981" filledBackgroundColor="#ECFDF5" activeBorderColor="#10B981" />
      </Demo>
      <Demo title="Active background" code='activeBackgroundColor="#FEF3C7" activeBorderColor="#F59E0B"'>
        <Otp activeBackgroundColor="#FEF3C7" activeBorderColor="#F59E0B" />
      </Demo>
      <Demo title="Dark screen" dark code='backgroundColor="#1F2937" textColor="#F9FAFB"'>
        <Otp
          lightText
          textColor="#F9FAFB"
          backgroundColor="#1F2937"
          borderColor="#374151"
          activeBorderColor="#22D3EE"
        />
      </Demo>
    </>
  );
}

function ShadowScreen() {
  return (
    <>
      <Demo title="Default shadow" code="shadow"><Otp shadow borderColor="#EEF0F3" /></Demo>
      <Demo title="Colored shadow" code='shadow={{ color: "#6366F1", opacity: 0.3, radius: 10 }}'>
        <Otp
          borderColor="#EEF0F3"
          shadow={{ color: "#6366F1", opacity: 0.3, radius: 10, offset: { width: 0, height: 6 }, elevation: 8 }}
        />
      </Demo>
      <Demo title="Active glow" code="activeGlow"><Otp activeGlow shape="circle" /></Demo>
      <Demo title="Shadow + glow, pink" code='shadow activeGlow activeBorderColor="#EC4899"'>
        <Otp shadow activeGlow activeBorderColor="#EC4899" borderColor="#FCE7F3" />
      </Demo>
    </>
  );
}

function PositionScreen() {
  const pos = ["left", "center", "right", "space-between", "space-around", "space-evenly"];
  return (
    <>
      {pos.map((p) => (
        <Demo key={p} title={p} code={`position="${p}"`}>
          <View style={styles.outline}>
            <Otp length={4} position={p} size={46} />
          </View>
        </Demo>
      ))}
    </>
  );
}

function SizeScreen() {
  return (
    <>
      <Demo title="Small" code="size={40} gap={6}"><Otp size={40} gap={6} /></Demo>
      <Demo title="Default" code="size={52} gap={10}"><Otp /></Demo>
      <Demo title="Big PIN" code="length={4} size={66} gap={16}"><Otp length={4} size={66} gap={16} /></Demo>
      <Demo title="Exact size" code="cellWidth={44} cellHeight={58} borderRadius={8} borderWidth={2}">
        <Otp cellWidth={44} cellHeight={58} borderRadius={8} borderWidth={2} />
      </Demo>
      <Demo title="Font" code='fontSize={30} fontWeight="800"'>
        <Otp fontSize={30} fontWeight="800" />
      </Demo>
    </>
  );
}

function TypesScreen() {
  return (
    <>
      <Demo title="Numeric (default) — number pad" code='type="numeric"'><Otp type="numeric" /></Demo>
      <Demo title="Letters only" code='type="alpha"'><Otp type="alpha" /></Demo>
      <Demo title="Letters + numbers, auto CAPS" code='type="alphanumeric" transform="uppercase"'>
        <Otp type="alphanumeric" transform="uppercase" />
      </Demo>
      <Demo title="Lowercase" code='type="alpha" transform="lowercase"'>
        <Otp type="alpha" transform="lowercase" />
      </Demo>
      <Demo title="Hex" code='type="hex" transform="uppercase"'><Otp type="hex" transform="uppercase" /></Demo>
      <Demo title="Any (no spaces)" code='type="any"'><Otp type="any" /></Demo>
      <Demo title="Custom RegExp: only A–F or 0–5" code='type={/^[A-F0-5]$/} transform="uppercase"'>
        <Otp type={/^[A-F0-5]$/} transform="uppercase" />
      </Demo>
      <Demo title="Custom function: only 1, 2, 3" code='type={(c) => "123".includes(c)}'>
        <Otp type={(c) => "123".includes(c)} length={4} />
      </Demo>
    </>
  );
}

function MaskScreen() {
  return (
    <>
      <Demo title="Mask (•)" code="mask"><Otp length={4} mask shape="circle" /></Demo>
      <Demo title="Custom mask *" code='mask="*"'><Otp length={4} mask="*" /></Demo>
      <Demo title="Custom mask ●, big" code='mask="●" size={64}'><Otp length={4} mask="●" size={64} gap={14} /></Demo>
      <Text style={styles.note}>The real value still shows in "value" below each input.</Text>
    </>
  );
}

function GroupsScreen() {
  return (
    <>
      <Demo title="3 - 3" code='groups={[3, 3]} separator="-"'>
        <Otp groups={[3, 3]} separator="-" />
      </Demo>
      <Demo title="4 · 4 alphanumeric" code='length={8} groups={[4, 4]} separator="·"'>
        <Otp length={8} groups={[4, 4]} separator="·" size={38} gap={5} type="alphanumeric" transform="uppercase" />
      </Demo>
      <Demo title="3 - 3 - 3" code='length={9} groups={[3, 3, 3]}'>
        <Otp length={9} groups={[3, 3, 3]} separator="-" size={32} gap={4} />
      </Demo>
      <Demo title="Separator between every box" code='length={4} separator="•"'>
        <Otp length={4} separator="•" />
      </Demo>
      <Demo title="Component separator" code="separator={<View … />}">
        <Otp groups={[3, 3]} separator={<View style={styles.sepBar} />} />
      </Demo>
    </>
  );
}

function PlaceholderScreen() {
  return (
    <>
      <Demo title="Same char everywhere" code='placeholder="0"'><Otp placeholder="0" /></Demo>
      <Demo title="One per box + underline" code='placeholder="------" shape="underline"'>
        <Otp placeholder="------" shape="underline" />
      </Demo>
      <Demo title="Custom placeholder color" code='placeholder="•" placeholderTextColor="#C4B5FD"'>
        <Otp placeholder="•" placeholderTextColor="#C4B5FD" activeBorderColor="#8B5CF6" />
      </Demo>
    </>
  );
}

function StatesScreen() {
  const [error, setError] = useState(false);
  return (
    <>
      <Demo title="Auto focus (keyboard opens)" code="autoFocus"><Otp autoFocus /></Demo>
      <Demo title="Starts with a value" code='defaultValue="12"'><Otp defaultValue="12" /></Demo>
      <Demo title="Error: type anything except 123456" code="error={isWrong}">
        <Otp
          error={error}
          onChange={() => setError(false)}
          onComplete={(v) => setError(v !== "123456")}
        />
        <Text style={[styles.value, { color: error ? "#EF4444" : "#10B981" }]}>
          {error ? "❌ Wrong code (shake + red)" : "Enter 123456 for success"}
        </Text>
      </Demo>
      <Demo title="Always error" code="error errorColor='#F97316'">
        <Otp error errorColor="#F97316" defaultValue="482913" />
      </Demo>
      <Demo title="Disabled" code="disabled"><Otp disabled defaultValue="48" /></Demo>
      <Demo title="Close keyboard when done" code="blurOnComplete"><Otp blurOnComplete /></Demo>
    </>
  );
}

function AnimationScreen() {
  return (
    <>
      <Demo title="All animations on (default)" code="animated showCursor shakeOnError"><Otp /></Demo>
      <Demo title="No pop animation" code="animated={false}"><Otp animated={false} /></Demo>
      <Demo title="No cursor" code="showCursor={false}"><Otp showCursor={false} /></Demo>
      <Demo title="Custom cursor color" code='cursorColor="#EF4444"'><Otp cursorColor="#EF4444" /></Demo>
      <Demo title="Error without shake" code="error shakeOnError={false}">
        <Otp error shakeOnError={false} />
      </Demo>
    </>
  );
}

function ControlledScreen() {
  const [code, setCode] = useState("");
  const [log, setLog] = useState([]);
  const add = (msg) => setLog((l) => [`${new Date().toLocaleTimeString()}  ${msg}`, ...l].slice(0, 12));
  return (
    <>
      <Demo title="Controlled value + events" code="value={code} onChange onComplete onFocus onBlur">
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            add(`onChange("${v}")`);
          }}
          onComplete={(v) => add(`onComplete("${v}") ✅`)}
          onFocus={() => add("onFocus")}
          onBlur={() => add("onBlur")}
        />
        <Text style={styles.value}>state: "{code}"</Text>
        <View style={styles.chipRow}>
          <Chip label='set "123456"' onPress={() => setCode("123456")} />
          <Chip label='set "98"' onPress={() => setCode("98")} />
          <Chip label="reset" onPress={() => setCode("")} />
        </View>
      </Demo>
      <Text style={styles.rowLabel}>Event log</Text>
      <View style={styles.logBox}>
        {log.length === 0 ? <Text style={styles.logText}>Tap the boxes and type…</Text> : null}
        {log.map((l, i) => (
          <Text key={i} style={styles.logText}>{l}</Text>
        ))}
      </View>
    </>
  );
}

function RefScreen() {
  const ref = useRef(null);
  const [out, setOut] = useState("");
  return (
    <Demo title="Ref methods" code="ref.current.focus() / blur() / clear() / setValue() / getValue()">
      <Otp ref={ref} />
      <View style={[styles.chipRow, { marginTop: 12 }]}>
        <Chip label="focus()" onPress={() => ref.current && ref.current.focus()} />
        <Chip label="blur()" onPress={() => ref.current && ref.current.blur()} />
        <Chip label="clear()" onPress={() => ref.current && ref.current.clear()} />
        <Chip label='setValue("482913")' onPress={() => ref.current && ref.current.setValue("482913")} />
        <Chip label='setValue("12ab34")' onPress={() => ref.current && ref.current.setValue("12ab34")} />
        <Chip label="getValue()" onPress={() => setOut(ref.current ? ref.current.getValue() : "")} />
      </View>
      <Text style={styles.value}>getValue() → "{out}"</Text>
    </Demo>
  );
}

function CustomStyleScreen() {
  return (
    <>
      <Demo title="Dashed boxes" code="cellStyle={{ borderStyle: 'dashed' }}">
        <Otp cellStyle={{ borderStyle: "dashed" }} borderWidth={2} />
      </Demo>
      <Demo title="State styles" code="activeCellStyle / filledCellStyle / textStyle">
        <Otp
          activeCellStyle={{ borderWidth: 3 }}
          filledCellStyle={{ backgroundColor: "#111827", borderColor: "#111827" }}
          textStyle={{ color: "#F9FAFB" }}
        />
      </Demo>
      <Demo title="Error style" code="errorCellStyle={{ borderWidth: 3 }}">
        <Otp error errorCellStyle={{ borderWidth: 3, backgroundColor: "#FEF2F2" }} defaultValue="1234" />
      </Demo>
      <Demo title="Container style" code="containerStyle={{ padding: 16, backgroundColor: '#EEF2FF', borderRadius: 16 }}">
        <Otp containerStyle={{ padding: 16, backgroundColor: "#EEF2FF", borderRadius: 16 }} length={4} />
      </Demo>
    </>
  );
}

function RenderCellScreen() {
  return (
    <>
      <Demo title="renderCell: dark tiles" code="renderCell={(state) => <View>…</View>}">
        <Otp
          length={4}
          renderCell={({ index, displayChar, isActive, isFilled, hasError }) => (
            <View
              key={index}
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isFilled ? "#111827" : "#F3F4F6",
                borderWidth: 2,
                borderColor: hasError ? "#EF4444" : isActive ? "#6366F1" : "transparent",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>{displayChar}</Text>
            </View>
          )}
        />
      </Demo>
      <Demo title="renderCell: dots that fill" code="Bank-app style PIN dots">
        <Otp
          length={4}
          mask
          renderCell={({ index, isFilled, isActive }) => (
            <View
              key={index}
              style={{
                width: 22,
                height: 22,
                marginHorizontal: 6,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: isActive ? "#6366F1" : "#9CA3AF",
                backgroundColor: isFilled ? "#6366F1" : "transparent",
              }}
            />
          )}
        />
      </Demo>
    </>
  );
}

function AutofillScreen() {
  return (
    <>
      <Demo title="SMS autofill" code="Works by default">
        <Otp autoFocus />
      </Demo>
      <Text style={styles.note}>
        iOS: send yourself an SMS like "Your code is 482913". The code appears above the keyboard. Tap it and every box fills.{"\n\n"}
        Android: Gboard shows the SMS code as a suggestion. Tap it.{"\n\n"}
        Paste: copy "Code: 482-913" from anywhere, long-press a box and paste. Only the digits are kept.
      </Text>
      <Demo title="Paste alphanumeric" code='type="alphanumeric" transform="uppercase"'>
        <Otp type="alphanumeric" transform="uppercase" />
      </Demo>
    </>
  );
}

function VerifyScreen() {
  const ref = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | checking | wrong | ok
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const verify = (code) => {
    setStatus("checking");
    setTimeout(() => {
      if (code === "123456") setStatus("ok");
      else {
        setStatus("wrong");
        setTimeout(() => ref.current && ref.current.clear(), 700);
      }
    }, 800);
  };

  return (
    <View style={styles.verify}>
      <Text style={styles.verifyIcon}>{status === "ok" ? "✅" : "🔐"}</Text>
      <Text style={styles.verifyTitle}>{status === "ok" ? "Verified!" : "Enter verification code"}</Text>
      <Text style={styles.verifySub}>We sent a 6-digit code to +91 98765 43210{"\n"}(Hint: 123456)</Text>

      <OtpInput
        ref={ref}
        length={6}
        shape="rounded"
        shadow
        activeGlow
        autoFocus
        error={status === "wrong"}
        disabled={status === "checking" || status === "ok"}
        filledBorderColor={status === "ok" ? "#10B981" : undefined}
        onChange={() => status === "wrong" && setStatus("idle")}
        onComplete={verify}
      />

      <Text
        style={[
          styles.verifyStatus,
          { color: status === "wrong" ? "#EF4444" : status === "ok" ? "#10B981" : "#6B7280" },
        ]}
      >
        {status === "checking" ? "Checking…" : status === "wrong" ? "Wrong code, try again" : status === "ok" ? "Code accepted" : " "}
      </Text>

      <Pressable
        disabled={timer > 0}
        onPress={() => {
          setTimer(30);
          setStatus("idle");
          ref.current && ref.current.clear();
          ref.current && ref.current.focus();
        }}
      >
        <Text style={[styles.resend, timer > 0 && { color: "#9CA3AF" }]}>
          {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
        </Text>
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Menu                                                                */
/* ------------------------------------------------------------------ */

const SCREENS = [
  { key: "playground", icon: "🎛️", title: "Playground", desc: "Change every prop live", C: PlaygroundScreen, fixed: true },
  { key: "verify", icon: "🔐", title: "Real verify screen", desc: "Error, shake, success, resend timer", C: VerifyScreen },
  { key: "length", icon: "🔢", title: "Length", desc: "4, 5, 6, 8 digits", C: LengthScreen },
  { key: "shapes", icon: "🔷", title: "Shapes", desc: "square, rounded, circle, pill, underline", C: ShapesScreen },
  { key: "glass", icon: "🧊", title: "Glass effect", desc: "light, dark, opacity, glow", C: GlassScreen },
  { key: "colors", icon: "🎨", title: "Colors", desc: "themes, filled, active, dark mode", C: ColorsScreen },
  { key: "shadow", icon: "🌑", title: "Shadow and glow", desc: "default, colored, activeGlow", C: ShadowScreen },
  { key: "position", icon: "📍", title: "Position", desc: "left, center, right, space-*", C: PositionScreen },
  { key: "size", icon: "📏", title: "Size and spacing", desc: "size, gap, cellWidth, font", C: SizeScreen },
  { key: "types", icon: "🔤", title: "Input types", desc: "numeric, alpha, alphanumeric, hex, regex", C: TypesScreen },
  { key: "mask", icon: "🙈", title: "Mask / PIN", desc: "•, *, ●", C: MaskScreen },
  { key: "groups", icon: "➖", title: "Groups and separators", desc: "3-3, 4·4, 3-3-3", C: GroupsScreen },
  { key: "placeholder", icon: "💬", title: "Placeholder", desc: "single char, per box, color", C: PlaceholderScreen },
  { key: "states", icon: "🚦", title: "States", desc: "autoFocus, error, disabled, blurOnComplete", C: StatesScreen },
  { key: "animation", icon: "✨", title: "Animations and cursor", desc: "pop, cursor, shake on/off", C: AnimationScreen },
  { key: "controlled", icon: "🎮", title: "Controlled and events", desc: "value, onChange, onComplete log", C: ControlledScreen },
  { key: "ref", icon: "🪝", title: "Ref methods", desc: "focus, blur, clear, setValue, getValue", C: RefScreen },
  { key: "styles", icon: "🖌️", title: "Custom styles", desc: "cellStyle, activeCellStyle, textStyle…", C: CustomStyleScreen },
  { key: "render", icon: "🧩", title: "renderCell", desc: "draw your own boxes / PIN dots", C: RenderCellScreen },
  { key: "autofill", icon: "📩", title: "SMS autofill and paste", desc: "iOS, Android, paste", C: AutofillScreen },
];

export default function OtpStudioScreen({ onExit }) {
  return (
    <PackageShell
      title="react-native-otp-studio"
      intro="Tap a feature to test it"
      screens={SCREENS}
      onExit={onExit}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 80 },

  demo: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEF0F3",
  },
  demoDark: { backgroundColor: "#0B1220", borderColor: "#0B1220" },
  demoTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  code: {
    marginTop: 6,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#6366F1",
  },
  codeDark: { color: "#A5B4FC" },
  value: { marginTop: 10, fontSize: 12, color: "#6B7280", textAlign: "center" },
  note: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    backgroundColor: "#EEF2FF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },

  glassBox: { padding: 18, borderRadius: 16, marginBottom: 14, backgroundColor: "#6D28D9", overflow: "hidden" },
  glassTitle: { color: "#fff", fontWeight: "700", marginBottom: 14 },

  outline: { borderWidth: 1, borderStyle: "dashed", borderColor: "#CBD5E1", borderRadius: 8, padding: 8 },
  sepBar: { width: 14, height: 3, borderRadius: 2, backgroundColor: "#9CA3AF" },

  pinned: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  previewPlain: { backgroundColor: "#fff", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#EEF0F3" },
  rowLabel: { fontSize: 12, fontWeight: "700", color: "#6B7280", marginBottom: 6, textTransform: "uppercase" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#6366F1", borderColor: "#6366F1" },
  chipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  swatch: { width: 30, height: 30, borderRadius: 15 },
  swatchActive: { borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  toggles: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 14, marginVertical: 8, borderWidth: 1, borderColor: "#EEF0F3" },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEF0F3",
  },
  toggleText: { fontSize: 14, color: "#111827" },
  codeBlock: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    color: "#E5E7EB",
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  logBox: { backgroundColor: "#111827", borderRadius: 12, padding: 12, minHeight: 120 },
  logText: { color: "#A7F3D0", fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 12, marginBottom: 3 },

  verify: { alignItems: "center", paddingTop: 30 },
  verifyIcon: { fontSize: 48 },
  verifyTitle: { fontSize: 22, fontWeight: "800", color: "#111827", marginTop: 12 },
  verifySub: { color: "#6B7280", textAlign: "center", marginTop: 8, marginBottom: 28, lineHeight: 20 },
  verifyStatus: { marginTop: 18, fontWeight: "600", minHeight: 20 },
  resend: { marginTop: 18, color: "#6366F1", fontWeight: "700" },
});
