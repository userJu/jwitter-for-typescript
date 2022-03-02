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
import { db, storage } from "../firebase";
import { useEffect, useState } from "react";
import Tweet from "../components/Tweet";
import { runInNewContext } from "vm";
import { v4 as uuidv4 } from "uuid";
import {
  ref,
  uploadString,
  getStorage,
  getDownloadURL,
} from "firebase/storage";

interface ITweets {
  text: string;
  createdAt: number;
  id: string;
  userId: {
    uid: string;
  };
  creatorId: string;
}

interface IHomeprops {
  userObj: {
    uid: string;
  };
}

function Home({ userObj }: IHomeprops) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [tweets, setTweets] = useState<ITweets[]>([]);
  const [attachment, setAttachment] = useState<null | string>(null);
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

  const onSubmit = async ({ tweet, image }: any) => {
    // Create a child reference
    const imagesRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
    console.log(tweet);
    console.log(image);
    if (attachment !== null) {
      uploadString(imagesRef, attachment, "data_url");
      // const attachmentUrl = await getDownloadURL(
      //   ref(storage, `${userObj.uid}/${uuidv4()}`)
      // );
      // console.log(attachmentUrl);
      // const tweetObj = {
      //   text: tweet,
      //   createdAt: Date.now(),
      //   creatorId: userObj.uid,
      //   attachmentUrl,

      // };
    }
    setAttachment("");

    setValue("tweet", "");
  };

  const changeImg = (e: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = e;
    // fileReader API 사용

    if (files !== null) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = (finishedEvent) => {
        const targetResult: any = finishedEvent.target?.result;
        setAttachment(targetResult);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "tweets"));
    onSnapshot(q, (querySnapshot) => {
      const tweetArray: any = querySnapshot.docs.map((doc) => ({
        text: doc.data().tweet,
        createdAt: doc.data().createdAt,
        creatorId: doc.data().creatorId,
        id: doc.id,
        userId: doc.data().creatorId,
      }));
      setTweets(tweetArray);
    });
  }, []);
  const onClearPhoto = () => {
    setAttachment(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("tweet", { maxLength: 120 })}
          type="text"
          placeholder="What's on your mind?"
        />
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={changeImg}
        />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="" />
            <button onClick={onClearPhoto}>Clear</button>
          </div>
        )}
      </form>
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
