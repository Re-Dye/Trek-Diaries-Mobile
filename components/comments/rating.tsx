import React from 'react';
import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const Star = ({ stars }: { stars: number }) => {
  const ratingStar = Array.from({ length: 5 }, (ignore, index) => {
    let number = index + 0.5;
    return (
      <View key={index}>
        {stars >= index + 1 ? (
          <AntDesign name="star" size={14} color="#AA6C39" />
        ) : stars >= number ? (
          <AntDesign name="star" size={14} color="#AA6C39" />
        ) : (
          <AntDesign name="staro" size={14} color="#AA6C39" />
        )}
      </View>
    );
  });

  return <View className="flex-row mt-1 gap-1">{ratingStar}</View>;
};

export default Star;
