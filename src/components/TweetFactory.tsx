import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

interface ITweetFactory {
  userObj: {
    uid?: string;
    displayName?: string;
  };
}

const TweetFactory = ({ userObj }: ITweetFactory) => {
  const { register, handleSubmit, setValue } = useForm();
  const [attachment, setAttachment] = useState<string>("");

  const onSubmit = async ({ tweet }: any) => {
    // Create a child reference
    const imagesRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
    let attachmentUrl = "";
    if (attachment !== "") {
      await uploadString(imagesRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(imagesRef);
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await setDoc(doc(collection(db, "tweets")), tweetObj);
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

  const onClearPhoto = () => {
    setAttachment("");
  };
  return (
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
  );
};

export default TweetFactory;
