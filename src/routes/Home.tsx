import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import TweetFactory from "../components/TweetFactory";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

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

  useEffect(() => {
    const q = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
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
    <Container>
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </Container>
  );
}

export default Home;
