import { useState } from 'react';

const useGetAvatar = (btcAddress: string | undefined) => {
  const [avatar, setAvatar] = useState<string>();

  if (!btcAddress) return;

  const handleFetchAvatar = async () =>
    await fetch(`https://api.hiro.so/ordinals/v1/inscriptions?address=${btcAddress}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setAvatar(data.results[0].id);
      });

  handleFetchAvatar();

  return avatar;
};

export { useGetAvatar };
