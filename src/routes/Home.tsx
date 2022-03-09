import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import TweetFactory from "../components/TweetFactory";

export interface ITweets {
  attachmentUrl: string;
  createdAt: number;
  creatorId: string;
  id: string;
  text: string;
  userId: string;
}

interface IHomeprops {
  userObj: {
    uid?: string;
    displayName?: string;
  };
}

function Home({ userObj }: IHomeprops) {
  const [tweets, setTweets] = useState<ITweets[]>([]);
  //
  // const getTweets = async () => {
  //   // const docSnap = await getDoc(collection(db, "tweets"));

  //   // if (docSnap.exists()) {
  //   //   console.log("Document data:", docSnap.data());
  //   // } else {
  //   //   console.log("No such document!");
  //   // }
  //   // 아무래도 안됨

  //   const querySnapshot = await getDocs(query(collection(db, "tweets")));
  //   querySnapshot.forEach((doc) => {
  //     // console.log({ ...doc.data() });
  //     // console.log(doc.data().tweet);
  //     const tweetObj = {
  //       text: doc.data().tweet,
  //       createdAt: doc.data().createdAt,
  //       id: doc.id,
  //       userId: doc.data().creatorId,
  //       // ...doc.data(),
  //     };
  //     setTweets((prev) => [tweetObj, ...prev]);
  //   });
  // };
  //

  useEffect(() => {
    const q = query(collection(db, "tweets"));
    onSnapshot(q, (querySnapshot) => {
      const tweetArray: any = querySnapshot.docs.map((doc) => ({
        text: doc.data().text,
        createdAt: doc.data().createdAt,
        creatorId: doc.data().creatorId,
        id: doc.id,
        userId: doc.data().creatorId,
        attachmentUrl: doc.data().attachmentUrl,
      }));
      setTweets(tweetArray);
    });
  }, []);

  return (
    <div>
      <TweetFactory userObj={userObj} />
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
