import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "dumbbell.fill": "fitness-center",
  "fork.knife": "restaurant",
  "bell.fill": "notifications",
  "gearshape.fill": "settings",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "plus.circle.fill": "add-circle",
  "pencil": "edit",
  "trash.fill": "delete",
  "video.fill": "videocam",
  "photo.fill": "photo",
  "drop.fill": "water-drop",
  "pills.fill": "medication",
  "star.fill": "star",
  "trophy.fill": "emoji-events",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "square.and.arrow.up": "share",
  "info.circle": "info",
  "clock.fill": "access-time",
  "calendar": "calendar-today",
  "flame.fill": "local-fire-department",
  "person.fill": "person",
  "chart.bar.fill": "bar-chart",
  "list.bullet": "list",
  "magnifyingglass": "search",
  "xmark": "close",
  "checkmark": "check",
  "plus": "add",
  "minus": "remove",
  "circle": "radio-button-unchecked",
  "info.circle.fill": "info",
  "alarm.fill": "alarm",
  "speaker.wave.2.fill": "volume-up",
  "iphone.radiowaves.left.and.right": "vibration",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
