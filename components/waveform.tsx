import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import colors from '../constant/colors';

interface WaveformProps {
  isRecording: boolean;
}

export default function Waveform({ isRecording }: WaveformProps) {
  const amplitude = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(amplitude, {
            toValue: 40,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(amplitude, {
            toValue: 10,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
    } else {
      amplitude.setValue(10);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isRecording]);

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    width: 120,
    height: amplitude,
    backgroundColor: colors.BLEU_200,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 30,
    opacity: isRecording ? 0.7 : 0.3,
  };

  return <Animated.View style={animatedStyle} />;
}
