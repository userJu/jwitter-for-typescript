import { useForm } from "react-hook-form";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

interface ITweets {
  text: string;
  createdAt: number;
  id: string;
  userId: {
    uid: string;
  };
}

interface IHomeprops {
  userObj: object;
}

function Home({ userObj }: IHomeprops) {
  const { register, handleSubmit, setValue } = useForm();
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
  const onSubmit = async ({ tweet }: any) => {
    await addDoc(collection(db, "tweets"), {
      tweet,
      createdAt: Date.now(),
      creatorId: userObj,
    });
    setValue("tweet", "");
  };

  useEffect(() => {
    const q = query(collection(db, "tweets"));
    onSnapshot(q, (querySnapshot) => {
      const tweetArray: any = querySnapshot.docs.map((doc) => ({
        text: doc.data().tweet,
        createdAt: doc.data().createdAt,
        id: doc.id,
        userId: doc.data().creatorId,
      }));
      console.log(tweetArray);
      setTweets(tweetArray);
    });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("tweet", { maxLength: 120 })}
          type="text"
          placeholder="What's on your mind?"
        />
        <input type="submit" value="Tweet" />
      </form>
      <div>
        {tweets.map((tweet) => (
          <div key={tweet.id}>
            <h4>{tweet.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
