import React, { useState } from "react";
import { doc, deleteDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { db, storage } from "../firebase";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const TweetBox = styled.div`
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  max-width: 320px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.8);
  h4 {
    font-size: 14px;
  }
  img {
    right: -10px;
    top: 20px;
    position: absolute;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-top: 10px;
  }
`;
const TweetEdit = styled.form`
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 5px;
`;
const FormInput = styled.input``;
const FormBtn = styled.input`
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 5px;
`;
const CancelBtn = styled.span``;
const Actions = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  span {
    cursor: pointer;
  }
  span:first-child {
    margin-right: 10px;
  }
`;
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
  const { register, handleSubmit, setValue, setFocus } = useForm();

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
    setFocus("edit");
  };

  return (
    <TweetBox key={tweetObj.id}>
      {editing ? (
        <>
          <TweetEdit action="" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              type="text"
              {...register("edit")}
              placeholder="edit your tweet"
            />
            <FormBtn type="submit" />
          </TweetEdit>
          <CancelBtn onClick={toggleEdit}>Cancel</CancelBtn>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img src={tweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <Actions>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEdit}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </Actions>
          )}
        </>
      )}
    </TweetBox>
  );
};

export default Tweet;
