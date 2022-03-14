import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { collection, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const FactoryForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const FactoryInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  input {
    flex-grow: 1;
    height: 40px;
    padding: 0px 20px;
    color: white;
    border: 1px solid #04aaff;
    border-radius: 20px;
    font-weight: 500;
    font-size: 12px;
  }
`;

const SubmitInput = styled.input`
  position: absolute;
  right: 0;
  background-color: #04aaff;
  height: 40px;
  width: 40px;
  padding: 10px 0px;
  text-align: center;
  border-radius: 20px;
  color: white;
`;

const Label = styled.label`
  color: #04aaff;
  cursor: pointer;
  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;
const Attachment = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    height: 80px;
    width: 80px;
    border-radius: 40px;
  }
`;
const ClearForm = styled.div`
  color: #04aaff;
  cursor: pointer;
  text-align: center;
  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;

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
    <FactoryForm onSubmit={handleSubmit(onSubmit)}>
      <FactoryInputContainer>
        <input
          {...register("tweet", { maxLength: 120 })}
          type="text"
          placeholder="What's on your mind?"
        />
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={changeImg}
          style={{
            opacity: 0,
          }}
        />
        <SubmitInput type="submit" value="Tweet" />
      </FactoryInputContainer>
      <Label htmlFor="attach-file">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </Label>

      {attachment && (
        <Attachment>
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt=""
          />
          <ClearForm onClick={onClearPhoto}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </ClearForm>
        </Attachment>
      )}
    </FactoryForm>
  );
};

export default TweetFactory;
