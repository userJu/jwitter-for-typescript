import React, { useState } from "react";
import { doc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

import { db, storage } from "../firebase";
import { useForm } from "react-hook-form";

interface ITweetsProps {
  tweetObj: {
    text: string;
    createdAt: number;
    id: string;
    userId: string;
    attachmentUrl: string;
  };
  isOwner: boolean;
}

const Tweet = ({ tweetObj, isOwner }: ITweetsProps) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const { register, handleSubmit, setValue } = useForm();

  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (ok) {
      await deleteDoc(doc(db, "tweets", tweetObj.id));
      const desertRef = ref(storage, tweetObj.attachmentUrl);
      deleteObject(desertRef)
        .then(() => {
          console.log("삭제됨");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onSubmit = async ({ edit }: any) => {
    // To update age and favorite color:
    await updateDoc(doc(db, "tweets", tweetObj.id), {
      tweet: edit,
    });
    setValue("edit", "");
    setEditing(false);
  };

  return (
    <div key={tweetObj.id}>
      {editing ? (
        <>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register("edit")}
              placeholder="edit your tweet"
            />
            <input type="submit" />
          </form>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEdit}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
