import { TouchableOpacity, Text } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useLocationStore } from '@/lib/zustand/location';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Action } from '@/lib/zodSchema/followLocation';
import { UsersToLocations, usersToLocationsSchema } from '@/lib/zodSchema/dbTypes';
import { useSessionStore } from '@/lib/zustand/session';

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
        // toast({
        //   className:
        //     "fixed rounded-md top-0 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   description:
        //     "Error occured while following location. Please try again later.",
        // });
        return;
      }
      if (data.status === 201) {
        await queryClient.refetchQueries({ queryKey: ['locations'] });
        return;
      } else if (data.status === 409) {
        // toast({
        //   className:
        //     "fixed rounded-md top-0 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   title: "Already Followed",
        //   description: "You are already following this location",
        // });
      } else if (data.status === 400) {
        // toast({
        //   className:
        //     "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   title: "Invalid Request",
        //   description: "Please try again later with proper information.",
        // });
      } else {
        // toast({
        //   variant: "destructive",
        //   className:
        //     "fixed rounded-md top-2 left-[50%] flex max-h-screen w-full translate-x-[-50%] p-4 sm:right-0 sm:flex-col md:max-w-[420px]",
        //   description:
        //     "Error occured while following location. Please try again later.",
        //   action: <ToastAction altText="Try again">Try again</ToastAction>,
        // });
      }
    },
    onError: (error) => {
      console.log(error);
      alert(error);
    },
  });

  /* handleFollow handles the follow event, i.e. it adds the location id to the users location */
  const handleToggleFollow = (action: Action) => {
    if (isPending) {
      alert('Previos action is being processed. Please wait for it to complete.');
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
          className="hover:text-gray-500 border-2 bg-primary px-4 py-2 border-green-500 rounded-xl flex-row items-center space-x-2"
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
