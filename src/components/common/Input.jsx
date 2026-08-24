import { TextInput, View, Text, Pressable } from 'react-native';
import MaskInput from 'react-native-mask-input';
import Feather from '@expo/vector-icons/Feather';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isValid,
  icon,
  mono = false,
  editable = true,
  type = 'text',
  rightIcon,
  onRightIconPress,
  multiline = false,
  style,
  mask,
  ...props
}) => {
  const Component = mask ? MaskInput : TextInput;

  return (
    <View className="mb-3" style={style}>
      {label ? <Text className="mb-[6px] font-sans text-label text-slate">{label}</Text> : null}

      <View
        className={`flex-row items-center rounded-control border bg-card px-3 py-[10px] ${
          multiline ? 'min-h-[76px]' : ''
        } ${error ? 'border-alert' : isValid ? 'border-clinic' : 'border-line-strong'}`}
      >
        {icon ? <View className="mr-2">{icon}</View> : null}

        <Component
          className={`flex-1 text-body text-ink ${mono ? 'font-mono' : 'font-sans'}`}
          placeholder={placeholder}
          placeholderTextColor="#8A9A95"
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={type === 'password'}
          multiline={multiline}
          style={multiline ? { textAlignVertical: 'top' } : null}
          mask={mask}
          {...props}
        />

        {rightIcon ? (
          <Pressable className="ml-3" onPress={onRightIconPress} hitSlop={8}>
            {rightIcon}
          </Pressable>
        ) : error ? (
          <Feather name="alert-circle" size={15} color="#C2513A" style={{ marginLeft: 8 }} />
        ) : isValid ? (
          <Feather name="check" size={15} color="#0E7A63" style={{ marginLeft: 8 }} />
        ) : null}
      </View>

      {error ? <Text className="mt-1 font-sans text-label text-alert">{error}</Text> : null}
    </View>
  );
};

export default Input;
