import { TouchableOpacity, Text } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useLocationStore } from '@/lib/zustand/location';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action } from '@/lib/zodSchema/followLocation';
import { UsersToLocations, usersToLocationsSchema } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';
import Toast from 'react-native-toast-message';

export default function FollowButton({
  locationID,
  userId,
}: {
  locationID: string;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const followed = useGetFollow(locationID);
  const { session } = useSessionStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: Action) => {
      const data: UsersToLocations = usersToLocationsSchema.parse({
        locationId: locationID,
        userId,
      });
      const res = await fetch('/api/location/follow', {
        headers: {
          Authorization: `Bearer ${session?.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ ...data, action }),
      });

      const message: string = await res.json();
      const status = res.status;
      return { message, status };
    },
    onSuccess: async (data) => {
      if (data === undefined) {
        Toast.show({
          text1: 'Error',
          text2: 'Error occured. Please try again later.',
          type: 'error',
          position: 'bottom',
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
        return;
      }
      if (data.status === 201) {
        await queryClient.refetchQueries({ queryKey: ['locations'] });
        return;
      } else if (data.status === 409) {
        Toast.show({
          type: 'error',
          text1: 'Already Followed',
          text2: 'You are already following this location',
          position: 'bottom',
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      } else if (data.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Request',
          text2: 'Please try again later with proper information',
          position: 'bottom',
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error occured while following location. Please try again later.',
          position: 'bottom',
          visibilityTime: 3000,
          bottomOffset: 15,
          keyboardOffset: 20,
        });
      }
    },
    onError: (error) => {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error occured while following location. Please try again later.',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 15,
        keyboardOffset: 20,
      });
    },
  });

  /* handleFollow handles the follow event, i.e. it adds the location id to the users location */
  const handleToggleFollow = (action: Action) => {
    if (isPending) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Previous action is still pending. Please wait for it to complete.',
        position: 'bottom',
        visibilityTime: 3000,
        bottomOffset: 15,
        keyboardOffset: 20,
      });
      return;
    }
    mutate(action);
    // locations.load();
  };

  return (
    <>
      {!followed ? (
        <TouchableOpacity
          onPress={() => handleToggleFollow('follow')}
          className="hover:text-gray-500 border-2 bg-primary px-4 py-2 border-green-500 rounded-xl flex-row items-center space-x-2"
        >
          <Text className="font-medium uppercase text-white">Follow</Text>
          <SimpleLineIcons name="user-follow" size={15} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleToggleFollow('unfollow')}
          className="hover:text-gray-500 border-2 bg-green-500 px-4 py-2 border-primary rounded-xl flex-row items-center space-x-2"
        >
          <Text className="font-medium uppercase text-white">Following</Text>
          <SimpleLineIcons name="user-following" size={15} color="white" />
        </TouchableOpacity>
      )}
    </>
  );
}

function useGetFollow(locationID: string): boolean {
  // const locationContext = useContext(LocationContext);
  const locations = useLocationStore((state) => state.locations);
  const [followed, setFollowed] = useState<boolean>(false);

  useEffect(() => {
    if (locations.length === 0) {
      setFollowed(false);
      return;
    }

    for (let i = 0; i < locations.length; i++) {
      if (locations[i].locationId === locationID) {
        setFollowed(true);
        break;
      } else {
        setFollowed(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  return followed;
}
