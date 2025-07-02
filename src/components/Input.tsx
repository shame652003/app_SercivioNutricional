import React, { useState } from 'react';
import {TextInput, StyleSheet, Text, View, TouchableOpacity, Animated, Platform} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Colores definidos
const BLUE = '#0066CC';
const BLUE_LIGHT = '#3399FF';
const BLUE_DARK = '#0066CC';
const GRAY_DEFAULT = '#ccc';
const RED_ERROR = '#df0000';

interface Info {
  label?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  error?: string;
  icon?: string;
  icon2?: string;
  iconError?: string;
  isPassword?: boolean;
}

export default function Input(props: Info) {
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(props.isPassword || false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (props.onFocus) props.onFocus(props.value || '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (props.onBlur) props.onBlur(props.value || '');
  };

  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  const lineWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const lineLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['50%', '0%'],
  });

  const lineColor = props.error ? RED_ERROR : isFocused ? BLUE : GRAY_DEFAULT;
  const labelColor = props.error ? RED_ERROR : isFocused ? BLUE_DARK : BLUE_LIGHT;

  return (
    <View style={styles.container}>
      <View style={styles.textLabel}>
        {props.icon && <FontAwesome name={props.icon} size={20} color={labelColor} />}
        {props.icon2 && (
          <MaterialCommunityIcons name={props.icon2} size={20} color={labelColor} />
        )}
        {props.label && <Text style={[styles.label, { color: labelColor }]}>{props.label}</Text>}
      </View>

      <View
        style={[
          styles.inputContainer,
          { borderBottomColor: props.error ? RED_ERROR : GRAY_DEFAULT },
        ]}
      >
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor="#aaa"
          onBlur={handleBlur}
          onFocus={handleFocus}
          secureTextEntry={secureText}
          style={styles.campo}
          underlineColorAndroid="transparent"
          selectionColor={BLUE}
        />

        {props.isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
            <FontAwesome
              name={secureText ? 'eye-slash' : 'eye'}
              size={20}
              color={labelColor}
            />
          </TouchableOpacity>
        )}

        <Animated.View
          style={[
            styles.animatedLine,
            {
              width: lineWidth,
              left: lineLeft,
              backgroundColor: lineColor,
              position: 'absolute',
              bottom: 0,
            },
          ]}
        />
      </View>

      <View style={styles.errorContainer}>
        {props.iconError && props.error && (
          <FontAwesome name={props.iconError} size={14} color={RED_ERROR} />
        )}
        {props.error && <Text style={styles.error}>{props.error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  textLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
    position: 'relative',
  },
  campo: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 0,
    margin: 0,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  animatedLine: {
    height: 2,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  error: {
    color: RED_ERROR,
    fontSize: 14,
    marginLeft: 6,
  },
});
