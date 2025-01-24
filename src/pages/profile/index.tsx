import { useEffect } from 'react';

const testFetch = async () => {
  try {
    const request = await fetch('/api/test');

    if (request.ok) {
      const response = await request.json();
      console.log(response);
    }
  } catch (err) {
    console.error(err);
  }
};

const ProfilePage = () => {
  useEffect(() => {
    testFetch();
  }, []);
  return (
    <>
      <h2>Profile Page</h2>
    </>
  );
};

export default ProfilePage;
