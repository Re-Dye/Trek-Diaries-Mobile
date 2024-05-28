// app/search/[query].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SearchCard from '@/components/search/SearchCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/commons/CustomButton';
import ImagePick from '@/components/commons/ImagePicker';
import SearchBar from '@/components/search/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { getAlgoliaApiKey, getAlgoliaAppId, getAlgoliaIndexName } from '@/lib/secrets';

type Location = {
  objectID: string;
  name: string;
  address: string;
  description: string;
};

const SearchResults = () => {
  const { query } = useLocalSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const { refetch, status } = useQuery({
    queryKey: ['search'],
    queryFn: async () => {
      const algoliasearch = (await import('algoliasearch/lite')).default;
      const appId = getAlgoliaAppId();
      const apiKey = getAlgoliaApiKey();
      const searchClient = algoliasearch(appId, apiKey);
      const indexName = getAlgoliaIndexName();

      const index = searchClient.initIndex(indexName);
      const res = await index.search(query?.toString() ?? ''); // Ensure query is always a string
      setLocations(res.hits as Location[]);
      return res;
    },
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View>
          <SearchBar initialQuery={''} />
        </View>
        <View>
          <View className="m-4">
            <Text className="text-white font-pmedium">Search Results for: {query}</Text>
          </View>
          <View>
            {status === 'pending' ? (
              <Text>Loading...</Text>
            ) : (
              locations.map((location) => (
                <SearchCard
                  key={location.objectID}
                  id={location.objectID}
                  address={location.address}
                  description={location.description}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;
