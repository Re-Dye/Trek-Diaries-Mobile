// components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { icons } from '../../constants';

const SearchBar = ({ initialQuery }: { initialQuery: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || '');

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 15,
        borderColor: '#333',
        borderWidth: 2,
      }}
    >
      <TextInput
        style={{ color: '#fff', flex: 1 }}
        value={query}
        placeholder="Search a location"
        placeholderTextColor="#CDCDE0"
        onChangeText={setQuery}
      />
      <TouchableOpacity
        onPress={() => {
          if (query === '') {
            Alert.alert(
              'Missing Query',
              'Please input something to search results across database'
            );
            return;
          }

          console.log('pathname', pathname);

          if (pathname.startsWith('/search')) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} style={{ width: 20, height: 20 }} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
