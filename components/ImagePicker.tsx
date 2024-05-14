import { Image, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../constants";

export default function ImagePick() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <View className="flex space-y-4">
      {image && (
        <View className="relative w-full pt-6 pb-3 px-4 border-2 border-black-200">
          <Image
            source={{ uri: image }}
            className="w-full h-[250px] rounded-xl"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={removeImage}
            className="absolute top-2 right-2 rounded-3xl"
          >
            <Image
              source={icons.closeImage}
              resizeMode="contain"
              tintColor="#7b7b8b"
              className="w-4 h-4"
            />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={icons.addImage}
          resizeMode="contain"
          tintColor="#7b7b8b"
          className="w-8 h-8"
        />
      </TouchableOpacity>
    </View>
  );
}
