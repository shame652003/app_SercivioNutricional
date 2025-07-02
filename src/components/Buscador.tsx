import React, { useState } from 'react';
import { TextInput, StyleSheet, Text, View, TouchableOpacity, Animated, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BLUE = '#0066CC';
const BLUE_LIGHT = '#3399FF';
const BLUE_DARK = '#0066CC';
const GRAY_DEFAULT = '#ccc';
const RED_ERROR = '#df0000';

interface BuscadorProps {
  label?: string;
  value?: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  error?: string;
  editable?: boolean;
}

export default function Buscador(props: BuscadorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useState(new Animated.Value(0))[0];

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    props.onFocus && props.onFocus(props.value || '');
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    props.onBlur && props.onBlur(props.value || '');
  };

  // Animación para la línea
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
      {props.label && (
        <Text style={[styles.label, { color: labelColor }]}>
          {props.label}
        </Text>
      )}
      <View style={[styles.inputContainer, { borderBottomColor: props.error ? RED_ERROR : GRAY_DEFAULT }]}>
        <FontAwesome name="search" size={20} color={labelColor} style={{ marginRight: 8 }} />
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor="#aaa"
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={styles.input}
          underlineColorAndroid="transparent"
          selectionColor={BLUE}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {props.value && props.value.length > 0 && (
          <TouchableOpacity onPress={() => props.onChangeText && props.onChangeText('')}>
            <FontAwesome name="times" size={18} color={labelColor} style={{ marginLeft: 8 }} />
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
      {props.error && <Text style={styles.error}>{props.error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 0,
    margin: 0,
  },
  animatedLine: {
    height: 2,
  },
  error: {
    color: RED_ERROR,
    fontSize: 14,
    marginTop: 6,
  },
});
